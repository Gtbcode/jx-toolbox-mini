function parseDateInput(input) {
  const value = String(input || '').trim()
  if (!value) return null
  const normalized = value.replace(/\./g, '-').replace(/\//g, '-')
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function diffDates(startInput, endInput) {
  const start = parseDateInput(startInput)
  const end = parseDateInput(endInput)
  if (!start || !end) return null

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const diffMs = endDay.getTime() - startDay.getTime()
  const days = Math.round(diffMs / 86400000)
  const absDays = Math.abs(days)
  const weeks = Math.floor(absDays / 7)
  const remainDays = absDays % 7
  const monthsApprox = (absDays / 30.4375).toFixed(1)
  const yearsApprox = (absDays / 365.25).toFixed(2)

  return {
    days,
    absDays,
    weeks,
    remainDays,
    monthsApprox,
    yearsApprox,
    direction: days >= 0 ? 'forward' : 'backward'
  }
}

function addDaysToDate(input, offsetDays) {
  const date = parseDateInput(input)
  const offset = Number(offsetDays)
  if (!date || Number.isNaN(offset)) return null
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  result.setDate(result.getDate() + offset)
  return formatDate(result)
}

function todayString() {
  return formatDate(new Date())
}

module.exports = {
  parseDateInput,
  formatDate,
  diffDates,
  addDaysToDate,
  todayString
}
