function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalizeHex(hex) {
  const clean = String(hex || '').trim().replace('#', '')
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return clean.split('').map(ch => ch + ch).join('').toUpperCase()
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return clean.toUpperCase()
  return null
}

function hexToRgb(hex) {
  const value = normalizeHex(hex)
  if (!value) return null
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  }
}

function rgbToHex(r, g, b) {
  const toHex = n => clamp(Math.round(Number(n) || 0), 0, 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function rgbToHsl(r, g, b) {
  const rn = clamp(Number(r) || 0, 0, 255) / 255
  const gn = clamp(Number(g) || 0, 0, 255) / 255
  const bn = clamp(Number(b) || 0, 0, 255) / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case rn: h = ((gn - bn) / delta) % 6; break
      case gn: h = (bn - rn) / delta + 2; break
      default: h = (rn - gn) / delta + 4; break
    }
    h *= 60
    if (h < 0) h += 360
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToRgb(h, s, l) {
  const hn = ((Number(h) || 0) % 360 + 360) % 360
  const sn = clamp(Number(s) || 0, 0, 100) / 100
  const ln = clamp(Number(l) || 0, 0, 100) / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs((hn / 60) % 2 - 1))
  const m = ln - c / 2
  let rp = 0
  let gp = 0
  let bp = 0

  if (hn < 60) [rp, gp, bp] = [c, x, 0]
  else if (hn < 120) [rp, gp, bp] = [x, c, 0]
  else if (hn < 180) [rp, gp, bp] = [0, c, x]
  else if (hn < 240) [rp, gp, bp] = [0, x, c]
  else if (hn < 300) [rp, gp, bp] = [x, 0, c]
  else [rp, gp, bp] = [c, 0, x]

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255)
  }
}

function parseRgbInput(input) {
  const match = String(input || '').trim().match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/)
  if (!match) return null
  return {
    r: clamp(Number(match[1]), 0, 255),
    g: clamp(Number(match[2]), 0, 255),
    b: clamp(Number(match[3]), 0, 255)
  }
}

function parseHslInput(input) {
  const match = String(input || '').trim().match(/^(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?$/)
  if (!match) return null
  return {
    h: clamp(Number(match[1]), 0, 360),
    s: clamp(Number(match[2]), 0, 100),
    l: clamp(Number(match[3]), 0, 100)
  }
}

function convertColor(input, inputType) {
  if (inputType === 'hex') {
    const rgb = hexToRgb(input)
    if (!rgb) return null
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return {
      hex: `#${normalizeHex(input)}`,
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`,
      preview: `#${normalizeHex(input)}`
    }
  }

  if (inputType === 'rgb') {
    const rgb = parseRgbInput(input)
    if (!rgb) return null
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return {
      hex,
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`,
      preview: hex
    }
  }

  const hsl = parseHslInput(input)
  if (!hsl) return null
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  return {
    hex,
    rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`,
    preview: hex
  }
}

module.exports = {
  normalizeHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  parseRgbInput,
  parseHslInput,
  convertColor
}
