const EXTRACT_PATTERNS = {
  email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  phone: /(?:\+?86[-\s]?)?1[3-9]\d{9}|(?:\+?86[-\s]?)?0\d{2,3}-?\d{7,8}/g,
  url: /https?:\/\/[^\s]+|www\.[^\s]+/gi,
  number: /-?\d+(?:\.\d+)?/g,
  chinese: /[\u4e00-\u9fff]+/g
}

function extractByType(text, type) {
  const pattern = EXTRACT_PATTERNS[type]
  if (!pattern) return []
  const matches = String(text || '').match(pattern) || []
  return [...new Set(matches)]
}

function getTextStats(text) {
  const value = String(text || '')
  const lines = value ? value.split(/\r?\n/) : []
  const chars = value.length
  const charsNoSpace = value.replace(/\s/g, '').length
  const words = value.trim() ? value.trim().split(/\s+/).length : 0
  const chineseCount = (value.match(/[\u4e00-\u9fff]/g) || []).length
  return {
    lines: lines.length,
    chars,
    charsNoSpace,
    words,
    chineseCount
  }
}

function cleanText(text, options = {}) {
  let value = String(text || '')
  if (options.trimLines) {
    value = value.split(/\r?\n/).map(line => line.trim()).join('\n')
  }
  if (options.removeEmptyLines) {
    value = value.split(/\r?\n/).filter(line => line.trim()).join('\n')
  }
  if (options.collapseSpaces) {
    value = value.replace(/[ \t]+/g, ' ')
  }
  if (options.trim) {
    value = value.trim()
  }
  return value
}

module.exports = {
  EXTRACT_PATTERNS,
  extractByType,
  getTextStats,
  cleanText
}
