function tokenize(expression) {
  const tokens = []
  const source = String(expression || '').replace(/\s/g, '')
  let index = 0

  while (index < source.length) {
    const char = source[index]
    if (/[0-9.]/.test(char)) {
      let number = char
      index += 1
      while (index < source.length && /[0-9.]/.test(source[index])) {
        number += source[index]
        index += 1
      }
      if (!/^\d*\.?\d+$/.test(number)) return null
      tokens.push({ type: 'number', value: Number(number) })
      continue
    }

    if ('+-*/()'.includes(char)) {
      tokens.push({ type: char })
      index += 1
      continue
    }

    return null
  }

  return tokens
}

function evaluateTokens(tokens) {
  let index = 0

  function parseExpression() {
    let value = parseTerm()
    while (index < tokens.length && (tokens[index].type === '+' || tokens[index].type === '-')) {
      const op = tokens[index].type
      index += 1
      const right = parseTerm()
      value = op === '+' ? value + right : value - right
    }
    return value
  }

  function parseTerm() {
    let value = parseFactor()
    while (index < tokens.length && (tokens[index].type === '*' || tokens[index].type === '/')) {
      const op = tokens[index].type
      index += 1
      const right = parseFactor()
      if (op === '/' && right === 0) throw new Error('除数不能为 0')
      value = op === '*' ? value * right : value / right
    }
    return value
  }

  function parseFactor() {
    if (tokens[index] && tokens[index].type === '-') {
      index += 1
      return -parseFactor()
    }
    if (tokens[index] && tokens[index].type === '+') {
      index += 1
      return parseFactor()
    }
    if (tokens[index] && tokens[index].type === '(') {
      index += 1
      const value = parseExpression()
      if (!tokens[index] || tokens[index].type !== ')') throw new Error('括号不匹配')
      index += 1
      return value
    }
    if (tokens[index] && tokens[index].type === 'number') {
      const value = tokens[index].value
      index += 1
      return value
    }
    throw new Error('表达式无效')
  }

  const result = parseExpression()
  if (index !== tokens.length) throw new Error('表达式无效')
  return result
}

function evaluateExpression(expression) {
  const tokens = tokenize(expression)
  if (!tokens || !tokens.length) return null
  const result = evaluateTokens(tokens)
  if (!Number.isFinite(result)) return null
  return Number(result.toFixed(10))
}

function calcBmi(weightKg, heightCm) {
  const weight = Number(weightKg)
  const height = Number(heightCm) / 100
  if (!weight || !height || weight <= 0 || height <= 0) return null
  const bmi = weight / (height * height)
  let level = '正常'
  if (bmi < 18.5) level = '偏瘦'
  else if (bmi < 24) level = '正常'
  else if (bmi < 28) level = '偏胖'
  else level = '肥胖'
  return {
    bmi: Number(bmi.toFixed(1)),
    level
  }
}

module.exports = {
  evaluateExpression,
  calcBmi
}
