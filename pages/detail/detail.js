const { getToolById } = require('../../utils/data')
const { numberToChineseCapital, numberToChineseLower } = require('../../utils/number')
const { convertCase } = require('../../utils/case')
const {
  convertUnit,
  getUnitGroupKeys,
  getUnitGroupLabels,
  getUnitOptions,
  getTemperatureOptions,
  formatUnitResult
} = require('../../utils/unit')
const { convertColor } = require('../../utils/color')
const { diffDates, addDaysToDate, todayString } = require('../../utils/time')
const { extractByType, getTextStats, cleanText } = require('../../utils/text')
const { evaluateExpression, calcBmi } = require('../../utils/calc')
const { drawQrcodeOnCanvas } = require('../../utils/qrcode')
const { normalizeRect, clampRect, applyMosaicFromImage } = require('../../utils/image-mosaic')

const MAX_CANVAS_SIZE = 4096
const IMAGE_MODES = ['image-compress', 'image-crop', 'image-format', 'image-watermark']
const PREVIEW_FRAME_WIDTH = 680
const PREVIEW_FRAME_HEIGHT = 720

function getImageOrientation(imageWidth, imageHeight) {
  return Number(imageWidth) >= Number(imageHeight) ? 'landscape' : 'portrait'
}

function getPreviewBoxPx(previewWidthRpx, previewHeightRpx, displayWidth, displayHeight) {
  const sys = wx.getSystemInfoSync()
  const rpxRatio = (sys.windowWidth || 375) / 750
  const boxW = Math.max(1, Math.round(displayWidth > 1 ? displayWidth : previewWidthRpx * rpxRatio))
  const boxH = Math.max(1, Math.round(displayHeight > 1 ? displayHeight : previewHeightRpx * rpxRatio))
  return { boxW, boxH }
}

function calcContainFit(boxW, boxH, contentW, contentH) {
  const safeW = Math.max(1, contentW)
  const safeH = Math.max(1, contentH)
  const scale = Math.min(boxW / safeW, boxH / safeH)
  const drawW = safeW * scale
  const drawH = safeH * scale
  return {
    drawW,
    drawH,
    offsetX: (boxW - drawW) / 2,
    offsetY: (boxH - drawH) / 2,
    scale
  }
}

function calcMosaicOrigin(fit, zoom, panX, panY) {
  const cx = fit.offsetX + fit.drawW / 2
  const cy = fit.offsetY + fit.drawH / 2
  return {
    originX: cx - (fit.drawW * zoom) / 2 + panX,
    originY: cy - (fit.drawH * zoom) / 2 + panY
  }
}

function resolveMosaicBoxSize(displayWidth, displayHeight, touchRect, previewWidthRpx, previewHeightRpx) {
  let boxW = touchRect && touchRect.width > 1 ? Math.round(touchRect.width) : 0
  let boxH = touchRect && touchRect.height > 1 ? Math.round(touchRect.height) : 0
  if (displayWidth > 1 && displayHeight > 1) {
    const displayW = Math.round(displayWidth)
    const displayH = Math.round(displayHeight)
    if (boxW < 2 || boxH < 2) {
      boxW = displayW
      boxH = displayH
    } else if (Math.abs(boxW - displayW) > 1 || Math.abs(boxH - displayH) > 1) {
      boxW = displayW
      boxH = displayH
    }
  }
  if (boxW < 2 || boxH < 2) {
    const fallback = getPreviewBoxPx(previewWidthRpx, previewHeightRpx, displayWidth, displayHeight)
    boxW = fallback.boxW
    boxH = fallback.boxH
  }
  return { boxW, boxH }
}

function buildMosaicViewMetrics(boxW, boxH, layoutWidth, layoutHeight, scalePercent, panX, panY) {
  const fit = calcContainFit(boxW, boxH, layoutWidth, layoutHeight)
  const zoom = clamp(scalePercent, 50, 300) / 100
  const clampedPan = clampMosaicPan(fit, boxW, boxH, zoom, panX, panY)
  const origin = calcMosaicOrigin(fit, zoom, clampedPan.panX, clampedPan.panY)
  return {
    layoutWidth,
    layoutHeight,
    baseDrawW: fit.drawW,
    baseDrawH: fit.drawH,
    baseOffsetX: fit.offsetX,
    baseOffsetY: fit.offsetY,
    canvasW: boxW,
    canvasH: boxH,
    zoom,
    panX: clampedPan.panX,
    panY: clampedPan.panY,
    originX: origin.originX,
    originY: origin.originY,
    scaleToDraw: fit.drawW / layoutWidth
  }
}

function clampMosaicPan(fit, boxW, boxH, zoom, panX, panY) {
  if (zoom <= 1) {
    return { panX: 0, panY: 0 }
  }

  const imageW = fit.drawW * zoom
  const imageH = fit.drawH * zoom
  if (imageW <= boxW && imageH <= boxH) {
    return { panX: 0, panY: 0 }
  }

  const origin = calcMosaicOrigin(fit, zoom, panX, panY)
  let originX = origin.originX
  let originY = origin.originY

  if (imageW > boxW) {
    originX = clamp(originX, boxW - imageW, 0)
  } else {
    originX = fit.offsetX + (fit.drawW - imageW) / 2
  }
  if (imageH > boxH) {
    originY = clamp(originY, boxH - imageH, 0)
  } else {
    originY = fit.offsetY + (fit.drawH - imageH) / 2
  }

  const cx = fit.offsetX + fit.drawW / 2
  const cy = fit.offsetY + fit.drawH / 2
  return {
    panX: originX - cx + imageW / 2,
    panY: originY - cy + imageH / 2
  }
}

function detectImageFormat(path, infoType) {
  const type = String(infoType || '').toLowerCase()
  if (type === 'png') return 'png'
  if (type === 'jpg' || type === 'jpeg') return 'jpg'
  const file = String(path || '').split('?')[0].toLowerCase()
  if (file.endsWith('.png')) return 'png'
  return 'jpg'
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max)
}

function formatFileSize(size) {
  const bytes = Number(size || 0)
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function hexToRgb(hex) {
  const clean = String(hex || '#111827').replace('#', '')
  const value = /^[0-9a-fA-F]{6}$/.test(clean) ? clean : '111827'
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  }
}

function limitSize(width, height) {
  const ratio = Math.min(1, MAX_CANVAS_SIZE / width, MAX_CANVAS_SIZE / height)
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
    ratio
  }
}

function buildUnitState(groupIndex = 0) {
  const groupKeys = getUnitGroupKeys()
  const safeIndex = clamp(groupIndex, 0, groupKeys.length - 1)
  const groupKey = groupKeys[safeIndex]
  if (groupKey === 'temperature') {
    const temp = getTemperatureOptions()
    return {
      unitGroupIndex: safeIndex,
      unitGroupKeys: groupKeys,
      unitGroupLabels: getUnitGroupLabels(),
      unitIsTemperature: true,
      unitFromKeys: temp.keys,
      unitToKeys: temp.keys,
      unitFromLabels: temp.labels,
      unitToLabels: temp.labels,
      unitFromIndex: 0,
      unitToIndex: 1
    }
  }
  const options = getUnitOptions(groupKey)
  return {
    unitGroupIndex: safeIndex,
    unitGroupKeys: groupKeys,
    unitGroupLabels: getUnitGroupLabels(),
    unitIsTemperature: false,
    unitFromKeys: options.keys,
    unitToKeys: options.keys,
    unitFromLabels: options.labels,
    unitToLabels: options.labels,
    unitFromIndex: 0,
    unitToIndex: 1
  }
}

Page({
  data: {
    tool: {},
    mode: '',

    imageFilePath: '',
    imageFileName: '未选择图片',
    imageOriginalSize: '--',
    imageOriginalBytes: 0,
    imageOriginalBytesText: '--',
    imageNaturalWidth: 0,
    imageNaturalHeight: 0,
    imagePreviewWidth: PREVIEW_FRAME_WIDTH,
    imagePreviewHeight: PREVIEW_FRAME_HEIGHT,
    imageTargetWidth: '',
    imageQuality: 82,
    imageFormatIndex: 0,
    imageFormatOptions: ['JPG', 'PNG'],
    imageFormatValues: ['jpg', 'png'],
    imageWatermarkText: '仅供本人使用',
    imageWatermarkOpacity: 32,
    imageWatermarkSize: 38,
    imageWatermarkGapX: 280,
    imageWatermarkGapY: 200,
    imageWatermarkModeIndex: 0,
    imageWatermarkModeOptions: ['平铺水印', '居中水印', '右下角水印'],
    imageWatermarkModeValues: ['repeat', 'center', 'bottomRight'],
    imageStatus: '请选择图片，所有处理均在本机完成。',
    imageOutputPath: '',
    imageOutputSize: '--',
    imageProcessing: false,
    imageSourceFormat: 'jpg',

    mosaicStatus: '请选择图片，在预览区框选需要打码的区域。',
    mosaicBlockSize: 16,
    mosaicRegions: [],
    mosaicToolMode: 'select',
    mosaicViewScalePercent: 100,
    mosaicViewPanX: 0,
    mosaicViewPanY: 0,

    numberInput: '',
    numberCapital: '--',
    numberLower: '--',
    numberError: '',
    numberExamples: ['1234.56', '100000000', '10000.05', '99999999.99', '0.50', '-1208.30'],

    caseInput: '',
    caseResult: '',
    caseTypeIndex: 0,
    caseTypeOptions: ['全大写', '全小写', '标题格式', '句首大写', '大小写反转'],
    caseTypeValues: ['upper', 'lower', 'title', 'sentence', 'toggle'],

    unitInput: '1',
    unitResult: '--',
    unitGroupIndex: 0,
    unitGroupKeys: [],
    unitGroupLabels: [],
    unitIsTemperature: false,
    unitFromIndex: 0,
    unitToIndex: 1,
    unitFromKeys: [],
    unitToKeys: [],
    unitFromLabels: [],
    unitToLabels: [],

    qrcodeText: '',
    qrcodeSize: 280,
    qrcodeForeground: '#111827',
    qrcodeStatus: '输入文字或链接，本地生成二维码。',
    qrcodeOutputPath: '',
    qrcodeProcessing: false,

    timeStart: todayString(),
    timeEnd: todayString(),
    timeDiffText: '请选择两个日期',
    timeBaseDate: todayString(),
    timeOffsetDays: '7',
    timeAddResult: '--',

    randomMin: '1',
    randomMax: '100',
    randomCount: '5',
    randomDecimal: false,
    randomDecimalPlaces: '2',
    randomResults: [],

    colorInputTypeIndex: 0,
    colorInputTypeOptions: ['HEX', 'RGB', 'HSL'],
    colorInputTypeValues: ['hex', 'rgb', 'hsl'],
    colorInput: '#0A7BFF',
    colorHex: '--',
    colorRgb: '--',
    colorHsl: '--',
    colorPreview: '#0A7BFF',
    colorError: '',

    textInput: '',
    textExtractTypeIndex: 0,
    textExtractTypeOptions: ['邮箱', '电话', '链接', '数字', '中文'],
    textExtractTypeValues: ['email', 'phone', 'url', 'number', 'chinese'],
    textExtractResults: [],
    textStats: null,
    textCleanOptions: {
      trimLines: true,
      removeEmptyLines: true,
      collapseSpaces: false,
      trim: true
    },

    bmiWeight: '',
    bmiHeight: '',
    bmiValue: '--',
    bmiLevel: '',

    calcExpression: '',
    calcResult: '--',
    calcHistory: [],

    layoutImages: [],
    layoutStatus: '请选择 2～4 张图片进行纵向拼接。',
    layoutOutputPath: '',
    layoutOutputSize: '--',
    layoutProcessing: false,
    layoutPreviewHeight: 420,

    highlights: [],
    scenes: []
  },

  onLoad(options = {}) {
    const target = getToolById(options.id) || getToolById('image-compress')
    const mode = target.mode
    const nextData = {
      tool: target,
      mode,
      highlights: target.highlights || [],
      scenes: target.scenes || []
    }

    if (mode === 'unit') {
      Object.assign(nextData, buildUnitState(0))
    }
    if (mode === 'color') {
      this.updateColorResult('#0A7BFF', 'hex', nextData)
    }
    if (mode === 'time') {
      this.updateTimeDiff(this.data.timeStart, this.data.timeEnd, nextData)
      nextData.timeAddResult = addDaysToDate(this.data.timeBaseDate, this.data.timeOffsetDays) || '--'
    }

    this.setData(nextData, () => {
      if (mode === 'unit') this.convertUnitValue()
      if (mode === 'qrcode') this.renderQrcodePreview()
    })
    wx.setNavigationBarTitle({ title: target.name })
  },

  chooseImage() {
    const onFile = file => {
      const filePath = file.tempFilePath || file.path
      wx.getImageInfo({
        src: filePath,
        success: info => {
          const orientationLabel = getImageOrientation(info.width, info.height) === 'landscape' ? '横图' : '竖图'
          const isMosaic = this.data.mode === 'image-mosaic'
          const patch = {
            imageFilePath: info.path || filePath,
            imageFileName: file.name || '本地图片',
            imageOriginalSize: `${info.width} × ${info.height}`,
            imageNaturalWidth: info.width,
            imageNaturalHeight: info.height,
            imageOriginalBytes: file.size || 0,
            imageOriginalBytesText: formatFileSize(file.size || 0),
            imageSourceFormat: detectImageFormat(info.path || filePath, info.type),
            imageTargetWidth: String(Math.min(info.width, 1600)),
            imageOutputPath: '',
            imageOutputSize: '--'
          }
          if (isMosaic) {
            Object.assign(patch, {
              mosaicRegions: [],
              mosaicViewScalePercent: 100,
              mosaicViewPanX: 0,
              mosaicViewPanY: 0,
              mosaicToolMode: 'select',
              mosaicStatus: `${orientationLabel}已载入，在预览区拖动框选需要打码的区域。`
            })
          } else {
            patch.imageStatus = `${orientationLabel}已载入（${info.width} × ${info.height}），可调整参数后导出。`
          }
          this.setData(patch, () => {
            if (isMosaic) {
              this.renderMosaicPreview()
            } else {
              this.renderImagePreview()
            }
          })
        },
        fail: () => {
          this.setData({ imageStatus: '图片读取失败，请换一张图片重试。' })
        }
      })
    }

    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: res => onFile(res.tempFiles[0])
      })
      return
    }

    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: res => onFile({
        tempFilePath: res.tempFilePaths[0],
        size: res.tempFiles && res.tempFiles[0] ? res.tempFiles[0].size : 0
      })
    })
  },

  cropImage() {
    if (!this.data.imageFilePath) {
      wx.showToast({ title: '请先选择图片', icon: 'none' })
      return
    }
    if (!wx.cropImage) {
      wx.showToast({ title: '当前微信版本不支持裁剪', icon: 'none' })
      return
    }
    wx.cropImage({
      src: this.data.imageFilePath,
      success: res => {
        wx.getImageInfo({
          src: res.tempFilePath,
          success: info => {
            this.setData({
              imageFilePath: info.path || res.tempFilePath,
              imageOriginalSize: `${info.width} × ${info.height}`,
              imageNaturalWidth: info.width,
              imageNaturalHeight: info.height,
              imageOutputPath: '',
              imageOutputSize: '--',
              imageStatus: '裁剪完成，可继续导出保存。'
            }, () => this.renderImagePreview())
          }
        })
      }
    })
  },

  onImageInput(e) {
    const key = e.currentTarget.dataset.key
    if (!key) return
    const value = key === 'imageWatermarkText'
      ? e.detail.value
      : Number(e.detail.value)
    const patch = { [key]: value, imageOutputPath: '', imageOutputSize: '--' }
    this.setData(patch, () => this.renderImagePreview())
  },

  onWatermarkGapChange(e) {
    const axis = e.currentTarget.dataset.axis
    if (!axis) return
    const key = axis === 'y' ? 'imageWatermarkGapY' : 'imageWatermarkGapX'
    this.setData({
      [key]: Number(e.detail.value),
      imageOutputPath: '',
      imageOutputSize: '--'
    }, () => this.renderImagePreview())
  },

  onImageFormatChange(e) {
    this.setData({ imageFormatIndex: Number(e.detail.value), imageOutputPath: '', imageOutputSize: '--' }, () => {
      this.renderImagePreview()
    })
  },

  onImageWatermarkModeChange(e) {
    this.setData({ imageWatermarkModeIndex: Number(e.detail.value) }, () => this.renderImagePreview())
  },

  getCanvas(selector) {
    return new Promise((resolve, reject) => {
      this.createSelectorQuery()
        .select(selector)
        .fields({ node: true, size: true })
        .exec(res => {
          const item = res && res[0]
          if (!item || !item.node) {
            reject(new Error('Canvas 初始化失败'))
            return
          }
          resolve({
            canvas: item.node,
            displayWidth: item.width || 1,
            displayHeight: item.height || 1
          })
        })
    })
  },

  getMosaicScratchCanvas() {
    if (this._mosaicScratchCanvas) return Promise.resolve(this._mosaicScratchCanvas)
    return this.getCanvas('#mosaicScratchCanvas')
      .then(({ canvas }) => {
        this._mosaicScratchCanvas = canvas
        return canvas
      })
      .catch(() => null)
  },

  loadCanvasImage(canvas, src) {
    return new Promise((resolve, reject) => {
      const image = canvas.createImage()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = src
    })
  },

  getImageLayout(image) {
    const mode = this.data.mode
    let targetWidth = image.width
    if (mode === 'image-compress' || mode === 'image-watermark') {
      targetWidth = Number(this.data.imageTargetWidth) || image.width
    }
    const safeWidth = clamp(targetWidth, 1, image.width)
    const targetHeight = Math.round(image.height * safeWidth / image.width)
    return limitSize(safeWidth, targetHeight)
  },

  drawImageWatermark(ctx, width, height, refWidth = width) {
    const text = this.data.imageWatermarkText.trim()
    if (!text) return

    const mode = this.data.imageWatermarkModeValues[this.data.imageWatermarkModeIndex]
    const opacity = clamp(this.data.imageWatermarkOpacity, 1, 100) / 100
    const coordScale = Math.max(width / Math.max(refWidth, 1), 0.05)
    const size = Math.max(6, Math.round(clamp(this.data.imageWatermarkSize, 8, 120) * coordScale))
    const gapScale = width / 1200
    const gapX = Math.max(24, Math.round(clamp(this.data.imageWatermarkGapX, 120, 1200) * gapScale))
    const gapY = Math.max(20, Math.round(clamp(this.data.imageWatermarkGapY, 80, 900) * gapScale))

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.fillStyle = '#0F172A'
    ctx.font = `600 ${size}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    if (mode === 'repeat') {
      ctx.translate(width / 2, height / 2)
      ctx.rotate(-Math.PI / 7)
      for (let x = -width; x <= width; x += gapX) {
        for (let y = -height; y <= height; y += gapY) {
          ctx.fillText(text, x, y)
        }
      }
    } else if (mode === 'bottomRight') {
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillText(text, width - 28, height - 28)
    } else {
      ctx.fillText(text, width / 2, height / 2)
    }
    ctx.restore()
  },

  async drawImageToCanvas(options = {}) {
    const forExport = options.forExport !== false
    const { canvas, displayWidth, displayHeight } = await this.getCanvas('#imageCanvas')
    const image = await this.loadCanvasImage(canvas, this.data.imageFilePath)
    const layout = this.getImageLayout(image)
    const dpr = wx.getSystemInfoSync().pixelRatio || 2
    const ctx = canvas.getContext('2d')

    if (!forExport) {
      const { boxW, boxH } = getPreviewBoxPx(
        this.data.imagePreviewWidth,
        this.data.imagePreviewHeight,
        displayWidth,
        displayHeight
      )
      const fit = calcContainFit(boxW, boxH, layout.width, layout.height)

      canvas.width = Math.round(boxW * dpr)
      canvas.height = Math.round(boxH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, boxW, boxH)
      ctx.drawImage(image, fit.offsetX, fit.offsetY, fit.drawW, fit.drawH)
      if (this.data.mode === 'image-watermark') {
        ctx.save()
        ctx.translate(fit.offsetX, fit.offsetY)
        this.drawImageWatermark(ctx, fit.drawW, fit.drawH, layout.width)
        ctx.restore()
      }
      return { canvas, width: layout.width, height: layout.height, ratio: layout.ratio }
    }

    canvas.width = Math.round(layout.width * dpr)
    canvas.height = Math.round(layout.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, layout.width, layout.height)
    ctx.drawImage(image, 0, 0, layout.width, layout.height)
    if (this.data.mode === 'image-watermark') {
      this.drawImageWatermark(ctx, layout.width, layout.height, layout.width)
    }

    return { canvas, width: layout.width, height: layout.height, ratio: layout.ratio }
  },

  async renderImagePreview() {
    if (!this.data.imageFilePath || this.data.imageProcessing) return
    if (!IMAGE_MODES.includes(this.data.mode)) return
    await new Promise(resolve => wx.nextTick(resolve))
    try {
      const layout = await this.drawImageToCanvas({ forExport: false })
      const ratioHint = layout.ratio < 1 ? '，已按小程序 Canvas 上限等比缩小' : ''
      this.setData({
        imageStatus: `预览已更新，输出尺寸约 ${layout.width} × ${layout.height}${ratioHint}。`
      })
    } catch (error) {
      this.setData({ imageStatus: `预览失败：${error.message || '请重试'}` })
    }
  },

  async drawMosaicCanvas(options = {}) {
    const forExport = options.forExport !== false
    const frozenView = !forExport && this._mosaicViewSnapshot ? this._mosaicViewSnapshot : null
    const { canvas, displayWidth, displayHeight } = await this.getCanvas('#mosaicCanvas')
    const workCanvas = await this.getMosaicScratchCanvas()
    const image = await this.loadCanvasImage(canvas, this.data.imageFilePath)
    const layout = limitSize(image.width, image.height)

    await this.updateMosaicTouchRect()
    const canvasRect = this._mosaicCanvasRect

    const sys = wx.getSystemInfoSync()
    const dpr = sys.pixelRatio || 2
    const imageScale = image.width / layout.width
    let canvasW
    let canvasH
    let drawW
    let drawH
    let zoom
    let originX
    let originY
    let scaleToDraw
    let baseOffsetX = 0
    let baseOffsetY = 0
    let panX = 0
    let panY = 0

    if (forExport) {
      canvasW = layout.width
      canvasH = layout.height
      drawW = layout.width
      drawH = layout.height
      zoom = 1
      originX = 0
      originY = 0
      scaleToDraw = 1
    } else if (frozenView) {
      canvasW = frozenView.canvasW
      canvasH = frozenView.canvasH
      drawW = frozenView.baseDrawW
      drawH = frozenView.baseDrawH
      zoom = frozenView.zoom
      originX = frozenView.originX
      originY = frozenView.originY
      scaleToDraw = frozenView.scaleToDraw
      baseOffsetX = frozenView.baseOffsetX || 0
      baseOffsetY = frozenView.baseOffsetY || 0
    } else {
      const { boxW, boxH } = resolveMosaicBoxSize(
        displayWidth,
        displayHeight,
        canvasRect,
        this.data.imagePreviewWidth,
        this.data.imagePreviewHeight
      )
      const metrics = buildMosaicViewMetrics(
        boxW,
        boxH,
        layout.width,
        layout.height,
        this.data.mosaicViewScalePercent,
        this.data.mosaicViewPanX,
        this.data.mosaicViewPanY
      )
      canvasW = metrics.canvasW
      canvasH = metrics.canvasH
      drawW = metrics.baseDrawW
      drawH = metrics.baseDrawH
      baseOffsetX = metrics.baseOffsetX
      baseOffsetY = metrics.baseOffsetY
      zoom = metrics.zoom
      panX = metrics.panX
      panY = metrics.panY
      originX = metrics.originX
      originY = metrics.originY
      scaleToDraw = metrics.scaleToDraw
    }

    canvas.width = Math.round(canvasW * dpr)
    canvas.height = Math.round(canvasH * dpr)

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvasW, canvasH)

    if (!forExport) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, canvasW, canvasH)
      ctx.clip()
    }

    ctx.save()
    ctx.translate(originX, originY)
    ctx.scale(zoom, zoom)
    ctx.drawImage(image, 0, 0, drawW, drawH)
    ctx.restore()

    const blockSize = clamp(this.data.mosaicBlockSize, 6, 48)

    this.data.mosaicRegions.forEach(region => {
      const rect = clampRect(region, layout.width, layout.height)
      if (rect.width < 2 || rect.height < 2) return
      applyMosaicFromImage(
        ctx,
        image,
        {
          x: rect.x * imageScale,
          y: rect.y * imageScale,
          width: rect.width * imageScale,
          height: rect.height * imageScale
        },
        {
          x: originX + rect.x * scaleToDraw * zoom,
          y: originY + rect.y * scaleToDraw * zoom,
          width: rect.width * scaleToDraw * zoom,
          height: rect.height * scaleToDraw * zoom
        },
        blockSize,
        { workCanvas }
      )
    })

    if (!forExport && this._mosaicTouch && this._mosaicTouch.selecting) {
      const sel = clampRect(
        this._mosaicTouch.currentSelect || { x: 0, y: 0, width: 0, height: 0 },
        layout.width,
        layout.height
      )
      const minSelect = Math.max(12, Math.round(layout.width * 0.012))
      if (sel.width >= minSelect && sel.height >= minSelect) {
        applyMosaicFromImage(
          ctx,
          image,
          {
            x: sel.x * imageScale,
            y: sel.y * imageScale,
            width: sel.width * imageScale,
            height: sel.height * imageScale
          },
          {
            x: originX + sel.x * scaleToDraw * zoom,
            y: originY + sel.y * scaleToDraw * zoom,
            width: sel.width * scaleToDraw * zoom,
            height: sel.height * scaleToDraw * zoom
          },
          blockSize,
          { workCanvas }
        )
      }
      if (sel.width > 1 && sel.height > 1) {
        const sx = originX + sel.x * scaleToDraw * zoom
        const sy = originY + sel.y * scaleToDraw * zoom
        const sw = sel.width * scaleToDraw * zoom
        const sh = sel.height * scaleToDraw * zoom
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.95)'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])
        ctx.strokeRect(sx, sy, sw, sh)
        ctx.setLineDash([])
      }
    }

    if (!forExport) {
      ctx.restore()
    }

    if (!forExport && !frozenView) {
      this._mosaicView = {
        layoutWidth: layout.width,
        layoutHeight: layout.height,
        baseDrawW: drawW,
        baseDrawH: drawH,
        baseOffsetX,
        baseOffsetY,
        canvasW,
        canvasH,
        zoom,
        panX,
        panY,
        originX,
        originY,
        scaleToDraw
      }
      await this.updateMosaicTouchRect()
    }

    return { canvas, width: layout.width, height: layout.height, ratio: layout.ratio }
  },

  async renderMosaicPreview(updateStatus = true) {
    if (!this.data.imageFilePath || this.data.mode !== 'image-mosaic') return
    const run = async () => {
      await new Promise(resolve => wx.nextTick(resolve))
      try {
        const layout = await this.drawMosaicCanvas({ forExport: false })
        if (updateStatus && !this._mosaicTouch) {
          const ratioHint = layout.ratio < 1 ? '，输出将按 Canvas 上限等比缩小' : ''
          const regionHint = this.data.mosaicRegions.length
            ? `，已打码 ${this.data.mosaicRegions.length} 处`
            : '，在预览区拖动框选敏感区域'
          const toolHint = this.data.mosaicToolMode === 'pan' ? '拖动视图' : '框选打码'
          this.setData({
            mosaicStatus: `双指缩放、${toolHint}${regionHint}${ratioHint}。`
          })
        }
      } catch (error) {
        this.setData({ mosaicStatus: `预览失败：${error.message || '请重试'}` })
      }
    }
    this._mosaicRenderPromise = run().finally(() => {
      this._mosaicRenderPromise = null
    })
    return this._mosaicRenderPromise
  },

  waitMosaicRenderIdle() {
    if (!this._mosaicRenderPromise) return Promise.resolve()
    return this._mosaicRenderPromise
  },

  getActiveMosaicView() {
    return this._mosaicViewSnapshot || this._mosaicView
  },

  snapshotMosaicView() {
    if (!this._mosaicView) return
    this._mosaicViewSnapshot = { ...this._mosaicView }
  },

  clearMosaicViewSnapshot() {
    this._mosaicViewSnapshot = null
  },

  normalizeMosaicView(scalePercent, panX, panY) {
    const view = this._mosaicView
    const scale = clamp(scalePercent, 50, 300)
    if (!view) {
      return {
        mosaicViewScalePercent: scale,
        mosaicViewPanX: 0,
        mosaicViewPanY: 0
      }
    }
    const fit = {
      offsetX: view.baseOffsetX,
      offsetY: view.baseOffsetY,
      drawW: view.baseDrawW,
      drawH: view.baseDrawH
    }
    const zoom = scale / 100
    const clamped = clampMosaicPan(fit, view.canvasW, view.canvasH, zoom, panX, panY)
    return {
      mosaicViewScalePercent: scale,
      mosaicViewPanX: clamped.panX,
      mosaicViewPanY: clamped.panY
    }
  },

  scheduleMosaicRender() {
    if (this._mosaicRenderTimer) return
    this._mosaicRenderTimer = setTimeout(() => {
      this._mosaicRenderTimer = null
      this.renderMosaicPreview(false)
    }, 16)
  },

  mapCanvasPointToImage(canvasX, canvasY) {
    const view = this.getActiveMosaicView()
    if (!view) return { x: 0, y: 0 }
    let drawX = (canvasX - view.originX) / view.zoom
    let drawY = (canvasY - view.originY) / view.zoom
    drawX = clamp(drawX, 0, view.baseDrawW)
    drawY = clamp(drawY, 0, view.baseDrawH)
    return {
      x: drawX * view.layoutWidth / view.baseDrawW,
      y: drawY * view.layoutHeight / view.baseDrawH
    }
  },

  isPointInImageArea(canvasX, canvasY) {
    const view = this.getActiveMosaicView() || this._mosaicView
    if (!view) return false
    const drawX = (canvasX - view.originX) / view.zoom
    const drawY = (canvasY - view.originY) / view.zoom
    return drawX >= 0 && drawY >= 0 && drawX <= view.baseDrawW && drawY <= view.baseDrawH
  },

  getMosaicMinSelectSize(view) {
    if (!view) return 12
    return Math.max(12, Math.round(view.layoutWidth * 0.012))
  },

  getMosaicTouchPoint(touch) {
    const rect = this._mosaicTouchRect
    const view = this.getActiveMosaicView() || this._mosaicView
    const scroll = this._mosaicScrollOffset || { scrollLeft: 0, scrollTop: 0 }
    const scrollLeft = Number(scroll.scrollLeft) || 0
    const scrollTop = Number(scroll.scrollTop) || 0
    let x = 0
    let y = 0

    if (rect && typeof touch.clientX === 'number' && typeof touch.clientY === 'number') {
      x = touch.clientX - rect.left
      y = touch.clientY - rect.top
    } else if (rect && typeof touch.pageX === 'number' && typeof touch.pageY === 'number') {
      x = touch.pageX - rect.left - scrollLeft
      y = touch.pageY - rect.top - scrollTop
    } else if (typeof touch.x === 'number' && typeof touch.y === 'number') {
      x = touch.x
      y = touch.y
    } else {
      x = touch.x || 0
      y = touch.y || 0
    }

    if (view && rect && rect.width > 0 && rect.height > 0) {
      x *= view.canvasW / rect.width
      y *= view.canvasH / rect.height
    }
    return { x, y }
  },

  updateMosaicTouchRect() {
    return new Promise(resolve => {
      this.createSelectorQuery()
        .select('#mosaicTouchLayer')
        .boundingClientRect(rect => {
          this._mosaicTouchRect = rect || null
          this._mosaicCanvasRect = rect || null
        })
        .selectViewport()
        .scrollOffset(scroll => {
          this._mosaicScrollOffset = scroll || { scrollLeft: 0, scrollTop: 0 }
        })
        .exec(res => {
          resolve(res && res[0])
        })
    })
  },

  updateMosaicCanvasRect() {
    return this.updateMosaicTouchRect()
  },

  refreshMosaicViewFromTouchRect() {
    if (!this._mosaicView) return
    const layerRect = this._mosaicTouchRect
    const { boxW, boxH } = resolveMosaicBoxSize(
      layerRect ? layerRect.width : 0,
      layerRect ? layerRect.height : 0,
      layerRect,
      this.data.imagePreviewWidth,
      this.data.imagePreviewHeight
    )
    this._mosaicView = buildMosaicViewMetrics(
      boxW,
      boxH,
      this._mosaicView.layoutWidth,
      this._mosaicView.layoutHeight,
      this.data.mosaicViewScalePercent,
      this.data.mosaicViewPanX,
      this.data.mosaicViewPanY
    )
  },

  async onMosaicTouchStart(e) {
    if (!this.data.imageFilePath) return
    await this.waitMosaicRenderIdle()
    if (!this._mosaicView) return
    await this.updateMosaicTouchRect()
    this.refreshMosaicViewFromTouchRect()
    const touches = e.touches || []
    if (touches.length >= 2) {
      this.clearMosaicViewSnapshot()
      const p0 = this.getMosaicTouchPoint(touches[0])
      const p1 = this.getMosaicTouchPoint(touches[1])
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      this._mosaicTouch = {
        mode: 'pinch',
        startDistance: Math.max(Math.sqrt(dx * dx + dy * dy), 1),
        startScalePercent: this.data.mosaicViewScalePercent,
        startPanX: this.data.mosaicViewPanX,
        startPanY: this.data.mosaicViewPanY,
        startMidX: (p0.x + p1.x) / 2,
        startMidY: (p0.y + p1.y) / 2
      }
      return
    }

    const point = this.getMosaicTouchPoint(touches[0])
    if (this.data.mosaicToolMode === 'pan') {
      this.clearMosaicViewSnapshot()
      this._mosaicTouch = {
        mode: 'pan',
        startX: point.x,
        startY: point.y,
        startPanX: this.data.mosaicViewPanX,
        startPanY: this.data.mosaicViewPanY
      }
      return
    }

    this.snapshotMosaicView()
    const imagePoint = this.mapCanvasPointToImage(point.x, point.y)
    this._mosaicTouch = {
      mode: 'select',
      selecting: true,
      startImage: imagePoint,
      currentSelect: { x: imagePoint.x, y: imagePoint.y, width: 0, height: 0 }
    }
  },

  onMosaicTouchMove(e) {
    if (!this._mosaicTouch || !this.getActiveMosaicView()) return
    const touches = e.touches || []

    if (this._mosaicTouch.mode === 'pinch' && touches.length >= 2) {
      const p0 = this.getMosaicTouchPoint(touches[0])
      const p1 = this.getMosaicTouchPoint(touches[1])
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
      const ratio = distance / this._mosaicTouch.startDistance
      const nextScale = clamp(Math.round(this._mosaicTouch.startScalePercent * ratio), 50, 300)
      const midX = (p0.x + p1.x) / 2
      const midY = (p0.y + p1.y) / 2
      const nextPanX = this._mosaicTouch.startPanX + midX - this._mosaicTouch.startMidX
      const nextPanY = this._mosaicTouch.startPanY + midY - this._mosaicTouch.startMidY
      this.clearMosaicViewSnapshot()
      this.setData(Object.assign(
        this.normalizeMosaicView(nextScale, nextPanX, nextPanY),
        { imageOutputPath: '', imageOutputSize: '--' }
      ), () => this.scheduleMosaicRender())
      return
    }

    if (this._mosaicTouch.mode === 'pan' && touches.length === 1) {
      const point = this.getMosaicTouchPoint(touches[0])
      const nextPanX = this._mosaicTouch.startPanX + point.x - this._mosaicTouch.startX
      const nextPanY = this._mosaicTouch.startPanY + point.y - this._mosaicTouch.startY
      this.clearMosaicViewSnapshot()
      this.setData(Object.assign(
        this.normalizeMosaicView(this.data.mosaicViewScalePercent, nextPanX, nextPanY),
        { imageOutputPath: '', imageOutputSize: '--' }
      ), () => this.scheduleMosaicRender())
      return
    }

    if (this._mosaicTouch.mode === 'select' && touches.length === 1) {
      const point = this.getMosaicTouchPoint(touches[0])
      const endImage = this.mapCanvasPointToImage(point.x, point.y)
      const view = this.getActiveMosaicView()
      const rect = normalizeRect(
        this._mosaicTouch.startImage.x,
        this._mosaicTouch.startImage.y,
        endImage.x,
        endImage.y
      )
      this._mosaicTouch.currentSelect = clampRect(
        rect,
        view.layoutWidth,
        view.layoutHeight
      )
      this.scheduleMosaicRender()
    }
  },

  onMosaicTouchEnd() {
    if (!this._mosaicTouch) return
    const view = this.getActiveMosaicView()
    const touch = this._mosaicTouch
    this._mosaicTouch = null

    if (touch.mode === 'select' && touch.selecting && view) {
      const rect = clampRect(
        touch.currentSelect || { x: 0, y: 0, width: 0, height: 0 },
        view.layoutWidth,
        view.layoutHeight
      )
      if (rect.width >= this.getMosaicMinSelectSize(view) && rect.height >= this.getMosaicMinSelectSize(view)) {
        const regions = this.data.mosaicRegions.concat([{
          id: `${Date.now()}`,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        }])
        this.setData({
          mosaicRegions: regions,
          imageOutputPath: '',
          imageOutputSize: '--',
          mosaicStatus: `已添加打码区域，共 ${regions.length} 处。可继续框选或导出。`
        }, () => {
          this.clearMosaicViewSnapshot()
          this.renderMosaicPreview(false)
        })
        return
      }
    }

    this.clearMosaicViewSnapshot()
    this.renderMosaicPreview(false)
  },

  onMosaicToolModeChange(e) {
    const mode = e.currentTarget.dataset.mode
    if (!mode || mode === this.data.mosaicToolMode) return
    this.setData({ mosaicToolMode: mode }, () => this.renderMosaicPreview())
  },

  onMosaicZoomChange(e) {
    this.setData(Object.assign(
      this.normalizeMosaicView(Number(e.detail.value), this.data.mosaicViewPanX, this.data.mosaicViewPanY),
      { imageOutputPath: '', imageOutputSize: '--' }
    ), () => this.renderMosaicPreview(false))
  },

  onMosaicZoomStep(e) {
    const step = Number(e.currentTarget.dataset.step) || 0
    this.setData(Object.assign(
      this.normalizeMosaicView(this.data.mosaicViewScalePercent + step, this.data.mosaicViewPanX, this.data.mosaicViewPanY),
      { imageOutputPath: '', imageOutputSize: '--' }
    ), () => this.renderMosaicPreview(false))
  },

  resetMosaicView() {
    this.setData({
      mosaicViewScalePercent: 100,
      mosaicViewPanX: 0,
      mosaicViewPanY: 0
    }, () => this.renderMosaicPreview())
  },

  undoMosaicRegion() {
    if (!this.data.mosaicRegions.length) return
    const regions = this.data.mosaicRegions.slice(0, -1)
    this.setData({
      mosaicRegions: regions,
      imageOutputPath: '',
      imageOutputSize: '--',
      mosaicStatus: regions.length
        ? `已撤销上一块，当前 ${regions.length} 处打码。`
        : '已清空全部打码，可重新框选。'
    }, () => this.renderMosaicPreview(false))
  },

  clearMosaicRegions() {
    if (!this.data.mosaicRegions.length) return
    this.setData({
      mosaicRegions: [],
      imageOutputPath: '',
      imageOutputSize: '--',
      mosaicStatus: '已清空全部打码，可重新框选。'
    }, () => this.renderMosaicPreview(false))
  },

  onMosaicSettingChange(e) {
    const key = e.currentTarget.dataset.key
    if (!key) return
    this.setData({
      [key]: Number(e.detail.value),
      imageOutputPath: '',
      imageOutputSize: '--'
    }, () => this.renderMosaicPreview(false))
  },

  createExportedImageFile() {
    const isMosaic = this.data.mode === 'image-mosaic'
    return (async () => {
      const result = isMosaic
        ? await this.drawMosaicCanvas({ forExport: true })
        : await this.drawImageToCanvas({ forExport: true })
      await new Promise(resolve => wx.nextTick(resolve))
      const format = isMosaic
        ? (this.data.imageSourceFormat || 'jpg')
        : this.data.imageFormatValues[this.data.imageFormatIndex]
      const quality = format === 'jpg'
        ? (isMosaic ? 1 : clamp(this.data.imageQuality, 1, 100) / 100)
        : 1
      return new Promise((resolve, reject) => {
        const options = {
          canvas: result.canvas,
          x: 0,
          y: 0,
          width: result.canvas.width,
          height: result.canvas.height,
          destWidth: result.width,
          destHeight: result.height,
          fileType: format,
          success: res => resolve({
            tempFilePath: res.tempFilePath,
            format,
            width: result.width,
            height: result.height
          }),
          fail: err => reject(new Error((err && err.errMsg) || '图片导出失败'))
        }
        if (format === 'jpg') {
          options.quality = quality
        }
        wx.canvasToTempFilePath(options, this)
      })
    })()
  },

  async exportImage() {
    if (!this.data.imageFilePath) {
      wx.showToast({ title: '请先选择图片', icon: 'none' })
      return
    }

    const isMosaic = this.data.mode === 'image-mosaic'
    this.setData({
      imageProcessing: true,
      imageStatus: '正在本地生成图片...',
      mosaicStatus: isMosaic ? '正在本地生成图片...' : this.data.mosaicStatus
    })
    try {
      const exported = await this.createExportedImageFile()
      const size = await new Promise(resolve => {
        wx.getFileInfo({
          filePath: exported.tempFilePath,
          success: res => resolve(res.size),
          fail: () => resolve(0)
        })
      })
      const statusText = isMosaic
        ? `打码图片已导出（${exported.format.toUpperCase()}）：${formatFileSize(size)}，可保存到相册。`
        : `图片已导出：${formatFileSize(size)}，可保存到相册。`
      this.setData({
        imageOutputPath: exported.tempFilePath,
        imageOutputSize: formatFileSize(size),
        imageStatus: statusText,
        mosaicStatus: isMosaic ? statusText : this.data.mosaicStatus
      })
      wx.showToast({ title: '导出成功', icon: 'success' })
    } catch (error) {
      const message = `导出失败：${error.message || '请稍后重试'}`
      this.setData({
        imageStatus: message,
        mosaicStatus: isMosaic ? message : this.data.mosaicStatus
      })
      wx.showToast({ title: '导出失败', icon: 'none' })
    } finally {
      this.setData({ imageProcessing: false }, () => {
        if (isMosaic && this.data.imageFilePath) {
          this.renderMosaicPreview(false)
        }
      })
    }
  },

  async saveImageResult() {
    let filePath = this.data.imageOutputPath
    const isMosaic = this.data.mode === 'image-mosaic'

    if (!filePath) {
      if (!this.data.imageFilePath) {
        wx.showToast({ title: '请先选择图片', icon: 'none' })
        return
      }
      this.setData({
        imageProcessing: true,
        mosaicStatus: isMosaic ? '正在生成图片...' : this.data.mosaicStatus,
        imageStatus: '正在生成图片...'
      })
      try {
        const exported = await this.createExportedImageFile()
        filePath = exported.tempFilePath
        const size = await new Promise(resolve => {
          wx.getFileInfo({
            filePath,
            success: res => resolve(res.size),
            fail: () => resolve(0)
          })
        })
        await new Promise(resolve => {
          this.setData({
            imageOutputPath: filePath,
            imageOutputSize: formatFileSize(size),
            mosaicStatus: isMosaic
              ? `图片已生成（${formatFileSize(size)}），正在保存到相册...`
              : this.data.mosaicStatus,
            imageStatus: `图片已生成（${formatFileSize(size)}），正在保存到相册...`
          }, resolve)
        })
      } catch (error) {
        const message = `生成失败：${error.message || '请稍后重试'}`
        this.setData({
          imageStatus: message,
          mosaicStatus: isMosaic ? message : this.data.mosaicStatus
        })
        wx.showToast({ title: '请先生成图片', icon: 'none' })
        return
      } finally {
        this.setData({ imageProcessing: false }, () => {
          if (isMosaic && this.data.imageFilePath) {
            this.renderMosaicPreview(false)
          }
        })
      }
    }

    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
      fail: () => {
        wx.showModal({
          title: '保存失败',
          content: '请在微信设置中允许保存到相册后重试。',
          showCancel: false
        })
      }
    })
  },

  chooseLayoutImages() {
    const choose = count => {
      wx.chooseMedia({
        count,
        mediaType: ['image'],
        sourceType: ['album'],
        success: res => {
          const files = (res.tempFiles || []).slice(0, 4)
          if (files.length < 2) {
            wx.showToast({ title: '至少选择 2 张图片', icon: 'none' })
            return
          }
          const layoutImages = files.map((file, index) => ({
            id: `${Date.now()}-${index}`,
            path: file.tempFilePath,
            name: file.name || `图片${index + 1}`
          }))
          this.setData({
            layoutImages,
            layoutOutputPath: '',
            layoutOutputSize: '--',
            layoutStatus: `已选择 ${layoutImages.length} 张图片，可生成拼图。`
          }, () => this.renderLayoutPreview())
        }
      })
    }

    if (wx.chooseMedia) {
      choose(4)
      return
    }
    wx.chooseImage({
      count: 4,
      success: res => {
        const files = res.tempFilePaths.map((path, index) => ({ tempFilePath: path, name: `图片${index + 1}` }))
        if (files.length < 2) {
          wx.showToast({ title: '至少选择 2 张图片', icon: 'none' })
          return
        }
        const layoutImages = files.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          path: file.tempFilePath,
          name: file.name
        }))
        this.setData({
          layoutImages,
          layoutOutputPath: '',
          layoutOutputSize: '--',
          layoutStatus: `已选择 ${layoutImages.length} 张图片，可生成拼图。`
        }, () => this.renderLayoutPreview())
      }
    })
  },

  async buildLayoutCanvas(options = {}) {
    const forExport = options.forExport !== false
    const { canvas, displayWidth, displayHeight } = await this.getCanvas('#layoutCanvas')
    const images = []
    for (let i = 0; i < this.data.layoutImages.length; i += 1) {
      images.push(await this.loadCanvasImage(canvas, this.data.layoutImages[i].path))
    }

    const targetWidth = Math.min(1200, Math.max(...images.map(img => img.width)))
    const scaledHeights = images.map(img => Math.round(img.height * targetWidth / img.width))
    const totalHeight = scaledHeights.reduce((sum, h) => sum + h, 0)
    const layout = limitSize(targetWidth, totalHeight)

    let drawWidth = layout.width
    let drawHeight = layout.height
    if (!forExport && displayWidth > 1 && displayHeight > 1) {
      const fitScale = Math.min(displayWidth / layout.width, displayHeight / layout.height, 1)
      drawWidth = Math.max(1, Math.round(layout.width * fitScale))
      drawHeight = Math.max(1, Math.round(layout.height * fitScale))
    }

    const dpr = wx.getSystemInfoSync().pixelRatio || 2
    canvas.width = Math.round(drawWidth * dpr)
    canvas.height = Math.round(drawHeight * dpr)

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, drawWidth, drawHeight)

    let offsetY = 0
    const scale = drawWidth / targetWidth
    for (let i = 0; i < images.length; i += 1) {
      const drawImageHeight = Math.round(scaledHeights[i] * scale)
      ctx.drawImage(images[i], 0, offsetY, drawWidth, drawImageHeight)
      offsetY += drawImageHeight
    }

    return { canvas, width: layout.width, height: layout.height }
  },

  async renderLayoutPreview() {
    if (this.data.layoutImages.length < 2 || this.data.layoutProcessing) return
    await new Promise(resolve => wx.nextTick(resolve))
    try {
      const layout = await this.buildLayoutCanvas({ forExport: false })
      const previewHeight = Math.round(clamp(680 * layout.height / layout.width, 320, 720))
      this.setData({
        layoutPreviewHeight: previewHeight,
        layoutStatus: `预览已更新，输出尺寸约 ${layout.width} × ${layout.height}。`
      })
    } catch (error) {
      this.setData({ layoutStatus: `预览失败：${error.message || '请重试'}` })
    }
  },

  async exportLayout() {
    if (this.data.layoutImages.length < 2) {
      wx.showToast({ title: '请先选择图片', icon: 'none' })
      return
    }
    this.setData({ layoutProcessing: true, layoutStatus: '正在本地合成拼图...' })
    try {
      const { canvas } = await this.buildLayoutCanvas({ forExport: true })
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvas,
          fileType: 'jpg',
          quality: 0.92,
          success: res => resolve(res.tempFilePath),
          fail: reject
        }, this)
      })
      const size = await new Promise(resolve => {
        wx.getFileInfo({
          filePath: tempFilePath,
          success: res => resolve(res.size),
          fail: () => resolve(0)
        })
      })
      this.setData({
        layoutOutputPath: tempFilePath,
        layoutOutputSize: formatFileSize(size),
        layoutStatus: `拼图已生成：${formatFileSize(size)}，可保存到相册。`
      })
    } catch (error) {
      this.setData({ layoutStatus: `生成失败：${error.message || '请稍后重试'}` })
    } finally {
      this.setData({ layoutProcessing: false })
    }
  },

  saveLayoutResult() {
    if (!this.data.layoutOutputPath) {
      wx.showToast({ title: '请先生成拼图', icon: 'none' })
      return
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.layoutOutputPath,
      success: () => wx.showToast({ title: '已保存到相册' }),
      fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },


  onNumberInput(e) {
    const value = e.detail.value
    const capital = numberToChineseCapital(value)
    const lower = numberToChineseLower(value)
    this.setData({
      numberInput: value,
      numberCapital: value ? (capital || '格式有误，请输入有效数字') : '--',
      numberLower: value ? (lower || '格式有误，请输入有效数字') : '--',
      numberError: value && (!capital || !lower) ? '支持整数、小数、负数和千分位，最大到千亿级别。' : ''
    })
  },

  useNumberExample(e) {
    this.onNumberInput({ detail: { value: e.currentTarget.dataset.value } })
  },

  copyNumberResult(e) {
    const key = e.currentTarget.dataset.key
    const text = key === 'capital' ? this.data.numberCapital : this.data.numberLower
    if (!text || text === '--' || text.includes('格式有误')) return
    wx.setClipboardData({ data: text })
  },

  onCaseInput(e) {
    const value = e.detail.value
    const type = this.data.caseTypeValues[this.data.caseTypeIndex]
    this.setData({
      caseInput: value,
      caseResult: value ? convertCase(value, type) : ''
    })
  },

  onCaseTypeChange(e) {
    const index = Number(e.detail.value)
    const type = this.data.caseTypeValues[index]
    this.setData({
      caseTypeIndex: index,
      caseResult: this.data.caseInput ? convertCase(this.data.caseInput, type) : ''
    })
  },

  copyCaseResult() {
    if (!this.data.caseResult) return
    wx.setClipboardData({ data: this.data.caseResult })
  },

  onUnitInput(e) {
    this.setData({ unitInput: e.detail.value }, () => this.convertUnitValue())
  },

  onUnitGroupChange(e) {
    const index = Number(e.detail.value)
    this.setData(buildUnitState(index), () => this.convertUnitValue())
  },

  onUnitFromChange(e) {
    this.setData({ unitFromIndex: Number(e.detail.value) }, () => this.convertUnitValue())
  },

  onUnitToChange(e) {
    this.setData({ unitToIndex: Number(e.detail.value) }, () => this.convertUnitValue())
  },

  convertUnitValue() {
    const groupIndex = this.data.unitGroupIndex
    const groupKeys = this.data.unitGroupKeys
    const groupKey = groupKeys[groupIndex]
    const fromUnit = this.data.unitFromKeys[this.data.unitFromIndex]
    const toUnit = this.data.unitToKeys[this.data.unitToIndex]
    const result = groupKey === 'temperature'
      ? convertUnit(this.data.unitInput, 'temperature', fromUnit, toUnit)
      : convertUnit(this.data.unitInput, groupKey, fromUnit, toUnit)
    this.setData({
      unitResult: result === null ? '请输入有效数值' : formatUnitResult(result)
    })
  },

  swapUnitDirection() {
    this.setData({
      unitFromIndex: this.data.unitToIndex,
      unitToIndex: this.data.unitFromIndex
    }, () => this.convertUnitValue())
  },

  onQrcodeInput(e) {
    this.setData({ qrcodeText: e.detail.value, qrcodeOutputPath: '' }, () => this.renderQrcodePreview())
  },

  onQrcodeSizeChange(e) {
    this.setData({ qrcodeSize: Number(e.detail.value) || 280, qrcodeOutputPath: '' }, () => this.renderQrcodePreview())
  },

  onQrcodeColorInput(e) {
    this.setData({ qrcodeForeground: e.detail.value, qrcodeOutputPath: '' }, () => this.renderQrcodePreview())
  },

  async renderQrcodePreview() {
    if (this.data.qrcodeProcessing) return
    const text = this.data.qrcodeText.trim()
    if (!text) {
      this.setData({ qrcodeStatus: '请输入要编码的文字或链接。' })
      return
    }
    try {
      const { canvas } = await this.getCanvas('#qrcodeCanvas')
      const ok = drawQrcodeOnCanvas(canvas, text, {
        size: clamp(this.data.qrcodeSize, 180, 520),
        foreground: this.data.qrcodeForeground || '#111827'
      })
      this.setData({
        qrcodeStatus: ok ? '二维码预览已更新，可保存到相册。' : '内容过长，请缩短后重试。'
      })
    } catch (error) {
      this.setData({ qrcodeStatus: `生成失败：${error.message || '请重试'}` })
    }
  },

  async saveQrcodeResult() {
    const text = this.data.qrcodeText.trim()
    if (!text) {
      wx.showToast({ title: '请先输入内容', icon: 'none' })
      return
    }
    this.setData({ qrcodeProcessing: true })
    try {
      const { canvas } = await this.getCanvas('#qrcodeCanvas')
      drawQrcodeOnCanvas(canvas, text, {
        size: clamp(this.data.qrcodeSize, 180, 520),
        foreground: this.data.qrcodeForeground || '#111827'
      })
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvas,
          fileType: 'png',
          success: res => resolve(res.tempFilePath),
          fail: reject
        }, this)
      })
      this.setData({ qrcodeOutputPath: tempFilePath })
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => wx.showToast({ title: '已保存到相册' }),
        fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
      })
    } catch (error) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      this.setData({ qrcodeProcessing: false })
    }
  },

  updateTimeDiff(start, end, target = {}) {
    const diff = diffDates(start, end)
    if (!diff) {
      Object.assign(target, { timeDiffText: '日期格式无效，请使用 2024-01-01 格式。' })
      return target
    }
    const direction = diff.days >= 0 ? '相差' : '反向相差'
    Object.assign(target, {
      timeDiffText: `${direction} ${diff.absDays} 天（约 ${diff.weeks} 周 ${diff.remainDays} 天，${diff.monthsApprox} 个月）`
    })
    return target
  },

  onTimeStartInput(e) {
    const timeStart = e.detail.value
    const patch = { timeStart }
    this.updateTimeDiff(timeStart, this.data.timeEnd, patch)
    this.setData(patch)
  },

  onTimeEndInput(e) {
    const timeEnd = e.detail.value
    const patch = { timeEnd }
    this.updateTimeDiff(this.data.timeStart, timeEnd, patch)
    this.setData(patch)
  },

  onTimeBaseInput(e) {
    this.setData({ timeBaseDate: e.detail.value }, () => this.updateTimeAddResult())
  },

  onTimeOffsetInput(e) {
    this.setData({ timeOffsetDays: e.detail.value }, () => this.updateTimeAddResult())
  },

  updateTimeAddResult() {
    const result = addDaysToDate(this.data.timeBaseDate, this.data.timeOffsetDays)
    this.setData({ timeAddResult: result || '日期或天数无效' })
  },

  onRandomInput(e) {
    const key = e.currentTarget.dataset.key
    if (!key) return
    this.setData({ [key]: e.detail.value })
  },

  onRandomSwitch(e) {
    this.setData({ randomDecimal: e.detail.value })
  },

  generateRandomNumbers() {
    const min = Number(this.data.randomMin)
    const max = Number(this.data.randomMax)
    const count = clamp(Number(this.data.randomCount), 1, 50)
    const places = clamp(Number(this.data.randomDecimalPlaces), 0, 6)

    if (Number.isNaN(min) || Number.isNaN(max)) {
      wx.showToast({ title: '请输入有效范围', icon: 'none' })
      return
    }
    if (min > max) {
      wx.showToast({ title: '最小值不能大于最大值', icon: 'none' })
      return
    }

    const results = []
    for (let i = 0; i < count; i += 1) {
      const raw = min + Math.random() * (max - min)
      if (this.data.randomDecimal) {
        results.push(Number(raw.toFixed(places)).toString())
      } else {
        results.push(String(Math.floor(raw)))
      }
    }
    this.setData({ randomResults: results })
  },

  copyRandomResults() {
    if (!this.data.randomResults.length) return
    wx.setClipboardData({ data: this.data.randomResults.join('\n') })
  },

  updateColorResult(input, inputType, target = {}) {
    const result = convertColor(input, inputType)
    if (!result) {
      Object.assign(target, {
        colorError: '格式无效，HEX 如 #0A7BFF，RGB 如 10,123,255，HSL 如 210,100%,50%',
        colorHex: '--',
        colorRgb: '--',
        colorHsl: '--'
      })
      return target
    }
    Object.assign(target, {
      colorError: '',
      colorHex: result.hex,
      colorRgb: result.rgb,
      colorHsl: result.hsl,
      colorPreview: result.preview
    })
    return target
  },

  onColorInput(e) {
    const colorInput = e.detail.value
    const inputType = this.data.colorInputTypeValues[this.data.colorInputTypeIndex]
    const patch = { colorInput }
    this.updateColorResult(colorInput, inputType, patch)
    this.setData(patch)
  },

  onColorTypeChange(e) {
    const index = Number(e.detail.value)
    const inputType = this.data.colorInputTypeValues[index]
    const patch = { colorInputTypeIndex: index }
    this.updateColorResult(this.data.colorInput, inputType, patch)
    this.setData(patch)
  },

  copyColorResult(e) {
    const key = e.currentTarget.dataset.key
    const map = { hex: this.data.colorHex, rgb: this.data.colorRgb, hsl: this.data.colorHsl }
    const text = map[key]
    if (!text || text === '--') return
    wx.setClipboardData({ data: text })
  },

  onTextInput(e) {
    const textInput = e.detail.value
    this.setData({
      textInput,
      textStats: getTextStats(textInput),
      textExtractResults: this.extractTextResults(textInput)
    })
  },

  onTextExtractTypeChange(e) {
    this.setData({
      textExtractTypeIndex: Number(e.detail.value),
      textExtractResults: this.extractTextResults(this.data.textInput)
    })
  },

  extractTextResults(text) {
    const type = this.data.textExtractTypeValues[this.data.textExtractTypeIndex]
    return extractByType(text, type)
  },

  cleanTextContent() {
    const cleaned = cleanText(this.data.textInput, this.data.textCleanOptions)
    this.setData({
      textInput: cleaned,
      textStats: getTextStats(cleaned),
      textExtractResults: this.extractTextResults(cleaned)
    })
  },

  copyTextExtractResults() {
    if (!this.data.textExtractResults.length) return
    wx.setClipboardData({ data: this.data.textExtractResults.join('\n') })
  },

  onBmiInput(e) {
    const key = e.currentTarget.dataset.key
    if (!key) return
    const patch = { [key]: e.detail.value }
    const result = calcBmi(
      key === 'bmiWeight' ? e.detail.value : this.data.bmiWeight,
      key === 'bmiHeight' ? e.detail.value : this.data.bmiHeight
    )
    if (result) {
      patch.bmiValue = String(result.bmi)
      patch.bmiLevel = result.level
    } else {
      patch.bmiValue = '--'
      patch.bmiLevel = ''
    }
    this.setData(patch)
  },

  onCalcInput(e) {
    this.setData({ calcExpression: e.detail.value })
  },

  appendCalcToken(e) {
    const token = e.currentTarget.dataset.token
    this.setData({ calcExpression: `${this.data.calcExpression}${token}` })
  },

  clearCalcExpression() {
    this.setData({ calcExpression: '', calcResult: '--' })
  },

  backspaceCalcExpression() {
    const value = this.data.calcExpression.slice(0, -1)
    this.setData({ calcExpression: value })
  },

  runCalcExpression() {
    try {
      const result = evaluateExpression(this.data.calcExpression)
      if (result === null) {
        this.setData({ calcResult: '表达式无效' })
        return
      }
      const history = [{ expression: this.data.calcExpression, result: String(result) }].concat(this.data.calcHistory).slice(0, 8)
      this.setData({ calcResult: String(result), calcHistory: history })
    } catch (error) {
      this.setData({ calcResult: error.message || '计算失败' })
    }
  },

  copyCalcResult() {
    if (!this.data.calcResult || this.data.calcResult === '--') return
    wx.setClipboardData({ data: this.data.calcResult })
  }
})
