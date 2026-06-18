function toUpper(text) {
  return String(text || '').toUpperCase()
}

function toLower(text) {
  return String(text || '').toLowerCase()
}

function toTitle(text) {
  return String(text || '').replace(/\b\w/g, char => char.toUpperCase())
}

function toSentence(text) {
  const value = String(text || '').toLowerCase()
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : ''
}

function toggleCase(text) {
  return String(text || '').replace(/./g, char => {
    if (char === char.toUpperCase()) return char.toLowerCase()
    return char.toUpperCase()
  })
}

function convertCase(text, type) {
  switch (type) {
    case 'upper': return toUpper(text)
    case 'lower': return toLower(text)
    case 'title': return toTitle(text)
    case 'sentence': return toSentence(text)
    case 'toggle': return toggleCase(text)
    default: return text
  }
}

module.exports = {
  convertCase,
  toUpper,
  toLower,
  toTitle,
  toSentence,
  toggleCase
}
