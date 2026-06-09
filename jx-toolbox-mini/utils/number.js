const CAPITAL_DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const LOWER_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const CAPITAL_UNITS4 = ['仟', '佰', '拾', '']
const LOWER_UNITS4 = ['千', '百', '十', '']
const BIG_UNITS = ['', '万', '亿']

function convertFourDigits(s, digits, units4) {
  const padded = s.padStart(4, '0')
  let result = ''
  let zeroPending = false

  for (let i = 0; i < 4; i += 1) {
    const d = Number(padded[i])
    if (d === 0) {
      zeroPending = true
    } else {
      if (zeroPending && result) result += digits[0]
      zeroPending = false
      result += digits[d] + units4[i]
    }
  }

  return result
}

function convertInteger(intStr, digits, units4) {
  const clean = intStr.replace(/^0+/, '') || '0'
  if (clean === '0') return digits[0]
  if (clean.length > 12) return null

  const groups = []
  let rest = clean
  while (rest.length > 0) {
    groups.unshift(rest.slice(-4))
    rest = rest.slice(0, -4)
  }

  const addZero = value => (value && !value.endsWith(digits[0]) ? value + digits[0] : value)
  let result = ''

  for (let i = 0; i < groups.length; i += 1) {
    const groupValue = Number(groups[i])
    const groupText = convertFourDigits(groups[i], digits, units4)
    const bigUnit = BIG_UNITS[groups.length - 1 - i] || ''

    if (groupText) {
      if (result && groupValue < 1000) result = addZero(result)
      result += groupText + bigUnit
    } else if (result && i < groups.length - 1) {
      result = addZero(result)
    }
  }

  return result.replace(new RegExp(`${digits[0]}$`), '')
}

function normalizeNumberInput(input) {
  const raw = String(input || '').trim().replace(/,/g, '')
  const isNegative = raw.startsWith('-')
  const abs = isNegative ? raw.slice(1) : raw
  if (!/^\d+(\.\d+)?$/.test(abs)) return null
  return { isNegative, abs }
}

function numberToChineseCapital(input) {
  const normalized = normalizeNumberInput(input)
  if (!normalized) return null

  const { isNegative, abs } = normalized
  const dotIndex = abs.indexOf('.')
  const intStr = dotIndex >= 0 ? abs.slice(0, dotIndex) : abs
  const fracStr = dotIndex >= 0 ? `${abs.slice(dotIndex + 1)}00`.slice(0, 2) : '00'
  const intResult = convertInteger(intStr, CAPITAL_DIGITS, CAPITAL_UNITS4)

  if (intResult === null) return '数字过大（超过千亿级别）'

  const jiao = Number(fracStr[0])
  const fen = Number(fracStr[1])
  let result = intResult !== CAPITAL_DIGITS[0] ? `${intResult}元` : ''

  if (jiao === 0 && fen === 0) {
    result = `${result || '零元'}整`
  } else if (jiao > 0 && fen === 0) {
    result += `${CAPITAL_DIGITS[jiao]}角整`
  } else if (jiao === 0) {
    if (result && !result.endsWith('零')) result += '零'
    result += `${CAPITAL_DIGITS[fen]}分`
  } else {
    result += `${CAPITAL_DIGITS[jiao]}角${CAPITAL_DIGITS[fen]}分`
  }

  return isNegative ? `负${result}` : result
}

function numberToChineseLower(input) {
  const normalized = normalizeNumberInput(input)
  if (!normalized) return null

  const { isNegative, abs } = normalized
  const dotIndex = abs.indexOf('.')
  const intStr = dotIndex >= 0 ? abs.slice(0, dotIndex) : abs
  const fracDigits = dotIndex >= 0 ? abs.slice(dotIndex + 1).replace(/0+$/, '') : ''
  const intResult = convertInteger(intStr, LOWER_DIGITS, LOWER_UNITS4)

  if (intResult === null) return '数字过大（超过千亿级别）'

  let result = intResult
  if (fracDigits) {
    result += `点${fracDigits.split('').map(d => LOWER_DIGITS[Number(d)]).join('')}`
  }
  return isNegative ? `负${result}` : result
}

module.exports = {
  numberToChineseCapital,
  numberToChineseLower
}
