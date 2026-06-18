function normalizeHex(hex) {
  const clean = String(hex || '').replace('#', '').trim()
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return clean.split('').map(ch => ch + ch).join('')
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return clean
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

function rgba(hex, alpha) {
  const rgb = hexToRgb(hex)
  if (!rgb) return ''
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

function lightenHex(hex, amount) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const mix = value => Math.min(255, Math.round(value + (255 - value) * amount))
  const toHex = value => value.toString(16).padStart(2, '0')
  return `#${toHex(mix(rgb.r))}${toHex(mix(rgb.g))}${toHex(mix(rgb.b))}`
}

function buildColorStyle(color, variant, size) {
  const isHex = /^#/.test(String(color || ''))
  if (!isHex) {
    return { colorClass: color || 'blue', colorStyle: '' }
  }

  const tone = `#${normalizeHex(color)}`
  const light = lightenHex(tone, variant === 'soft' ? 0.08 : 0.24)
  const shadowAlpha = size === 'xl' ? 0.22 : 0.18
  const shadowSize = size === 'xl' ? '0 18rpx 34rpx' : '0 10rpx 22rpx'

  if (variant === 'soft') {
    return {
      colorClass: 'hex-tone',
      colorStyle: `--tone: ${tone}; background: ${rgba(tone, 0.1)}; border-color: ${rgba(tone, 0.22)};`
    }
  }

  return {
    colorClass: 'hex-tone',
    colorStyle: `background: linear-gradient(135deg, ${tone}, ${light}); box-shadow: ${shadowSize} ${rgba(tone, shadowAlpha)};`
  }
}

Component({
  properties: {
    type: {
      type: String,
      value: 'default'
    },
    color: {
      type: String,
      value: 'blue'
    },
    size: {
      type: String,
      value: 'md'
    },
    variant: {
      type: String,
      value: 'solid'
    }
  },

  data: {
    colorClass: 'blue',
    colorStyle: ''
  },

  observers: {
    'color, variant, size'() {
      this.applyColor()
    }
  },

  lifetimes: {
    attached() {
      this.applyColor()
    }
  },

  methods: {
    applyColor() {
      const { color, variant, size } = this.properties
      this.setData(buildColorStyle(color, variant, size))
    }
  }
})
