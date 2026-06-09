const qrcodeFactory = require('./qrcode-lib')

function createQr(text) {
  const content = String(text || '').trim()
  if (!content) return null

  for (let typeNumber = 1; typeNumber <= 10; typeNumber += 1) {
    try {
      const qr = qrcodeFactory(typeNumber, 'M')
      qr.addData(content)
      qr.make()
      return qr
    } catch (error) {
      // try larger type number
    }
  }
  return null
}

function drawQrcodeOnCanvas(canvas, text, options = {}) {
  const qr = createQr(text)
  if (!qr || !canvas) return false

  const size = options.size || 280
  const margin = options.margin == null ? 12 : options.margin
  const foreground = options.foreground || '#111827'
  const background = options.background || '#FFFFFF'
  const count = qr.getModuleCount()
  const ctx = canvas.getContext('2d')
  const inner = Math.max(1, size - margin * 2)
  const tile = inner / count

  canvas.width = size
  canvas.height = size
  ctx.fillStyle = background
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = foreground

  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(margin + col * tile, margin + row * tile, tile + 0.5, tile + 0.5)
      }
    }
  }

  return true
}

module.exports = {
  createQr,
  drawQrcodeOnCanvas
}
