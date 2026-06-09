function normalizeRect(x1, y1, x2, y2) {
  const x = Math.min(x1, x2)
  const y = Math.min(y1, y2)
  return {
    x,
    y,
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1)
  }
}

function clampRect(rect, maxWidth, maxHeight) {
  const x = Math.max(0, Math.min(rect.x, maxWidth - 1))
  const y = Math.max(0, Math.min(rect.y, maxHeight - 1))
  const width = Math.max(0, Math.min(rect.width, maxWidth - x))
  const height = Math.max(0, Math.min(rect.height, maxHeight - y))
  return { x, y, width, height }
}

function createOffscreen(width, height) {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  if (typeof wx !== 'undefined' && wx.createOffscreenCanvas) {
    return wx.createOffscreenCanvas({ type: '2d', width: w, height: h })
  }
  return null
}

function prepareWorkCanvas(canvas, width, height) {
  if (!canvas || typeof canvas.getContext !== 'function') return null
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  canvas.width = w
  canvas.height = h
  return canvas
}

function getWorkCanvases(width, height, options = {}) {
  const canvases = []
  const reusableCanvas = prepareWorkCanvas(options.workCanvas, width, height)
  if (reusableCanvas) canvases.push(reusableCanvas)
  const offscreen = createOffscreen(width, height)
  if (offscreen) canvases.push(offscreen)
  return canvases
}

function applyMosaicFromImage(ctx, image, srcRect, destRect, blockSize, options = {}) {
  const sx = Math.round(srcRect.x)
  const sy = Math.round(srcRect.y)
  const sw = Math.round(srcRect.width)
  const sh = Math.round(srcRect.height)
  const dx = destRect.x
  const dy = destRect.y
  const dw = destRect.width
  const dh = destRect.height
  if (sw < 2 || sh < 2 || dw < 2 || dh < 2 || !image) return

  const block = Math.max(2, Math.round(blockSize))
  const pixelW = Math.max(1, Math.round(dw))
  const pixelH = Math.max(1, Math.round(dh))
  const smallW = Math.max(1, Math.ceil(pixelW / block))
  const smallH = Math.max(1, Math.ceil(pixelH / block))

  const workCanvases = getWorkCanvases(smallW, smallH, options)
  if (!workCanvases.length) return false

  for (let i = 0; i < workCanvases.length; i += 1) {
    const workCanvas = workCanvases[i]
    const workCtx = workCanvas.getContext('2d')
    if (!workCtx) continue

    let saved = false
    try {
      if (typeof workCtx.setTransform === 'function') {
        workCtx.setTransform(1, 0, 0, 1, 0, 0)
      }
      workCtx.imageSmoothingEnabled = false
      workCtx.clearRect(0, 0, smallW, smallH)
      workCtx.drawImage(image, sx, sy, sw, sh, 0, 0, smallW, smallH)

      ctx.save()
      saved = true
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(workCanvas, 0, 0, smallW, smallH, dx, dy, dw, dh)
      ctx.imageSmoothingEnabled = true
      ctx.restore()
      saved = false
      return true
    } catch (error) {
      if (saved && typeof ctx.restore === 'function') {
        try {
          ctx.restore()
        } catch (restoreError) {}
      }
    }
  }
  return false
}

module.exports = {
  normalizeRect,
  clampRect,
  applyMosaicFromImage
}
