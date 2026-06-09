const UNIT_GROUPS = {
  length: {
    label: '长度',
    base: 'm',
    units: {
      m: { label: '米 (m)', ratio: 1 },
      km: { label: '千米 (km)', ratio: 1000 },
      cm: { label: '厘米 (cm)', ratio: 0.01 },
      mm: { label: '毫米 (mm)', ratio: 0.001 },
      mile: { label: '英里 (mile)', ratio: 1609.344 },
      ft: { label: '英尺 (ft)', ratio: 0.3048 },
      inch: { label: '英寸 (inch)', ratio: 0.0254 }
    }
  },
  weight: {
    label: '重量',
    base: 'kg',
    units: {
      kg: { label: '千克 (kg)', ratio: 1 },
      g: { label: '克 (g)', ratio: 0.001 },
      mg: { label: '毫克 (mg)', ratio: 0.000001 },
      t: { label: '吨 (t)', ratio: 1000 },
      lb: { label: '磅 (lb)', ratio: 0.453592 },
      oz: { label: '盎司 (oz)', ratio: 0.0283495 }
    }
  },
  area: {
    label: '面积',
    base: 'm2',
    units: {
      m2: { label: '平方米 (m²)', ratio: 1 },
      km2: { label: '平方千米 (km²)', ratio: 1000000 },
      cm2: { label: '平方厘米 (cm²)', ratio: 0.0001 },
      ha: { label: '公顷 (ha)', ratio: 10000 },
      acre: { label: '英亩 (acre)', ratio: 4046.8564224 }
    }
  },
  volume: {
    label: '体积',
    base: 'l',
    units: {
      l: { label: '升 (L)', ratio: 1 },
      ml: { label: '毫升 (mL)', ratio: 0.001 },
      m3: { label: '立方米 (m³)', ratio: 1000 },
      gal: { label: '加仑 (gal)', ratio: 3.78541 }
    }
  }
}

function convertTemperature(value, from, to) {
  const num = Number(value)
  if (Number.isNaN(num)) return null

  let celsius = num
  if (from === 'f') celsius = (num - 32) * 5 / 9
  if (from === 'k') celsius = num - 273.15

  if (to === 'c') return celsius
  if (to === 'f') return celsius * 9 / 5 + 32
  if (to === 'k') return celsius + 273.15
  return null
}

function convertUnit(value, groupKey, fromUnit, toUnit) {
  const num = Number(value)
  if (Number.isNaN(num)) return null

  if (groupKey === 'temperature') {
    return convertTemperature(num, fromUnit, toUnit)
  }

  const group = UNIT_GROUPS[groupKey]
  if (!group) return null
  const from = group.units[fromUnit]
  const to = group.units[toUnit]
  if (!from || !to) return null

  const baseValue = num * from.ratio
  return baseValue / to.ratio
}

function getUnitGroupKeys() {
  return Object.keys(UNIT_GROUPS).concat(['temperature'])
}

function getUnitGroupLabels() {
  return Object.values(UNIT_GROUPS).map(group => group.label).concat(['温度'])
}

function getUnitOptions(groupKey) {
  const group = UNIT_GROUPS[groupKey]
  if (!group) return { keys: [], labels: [] }
  const keys = Object.keys(group.units)
  return {
    keys,
    labels: keys.map(key => group.units[key].label)
  }
}

function getTemperatureOptions() {
  return {
    keys: ['c', 'f', 'k'],
    labels: ['摄氏度 (°C)', '华氏度 (°F)', '开尔文 (K)']
  }
}

function formatUnitResult(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '--'
  const abs = Math.abs(value)
  if (abs >= 1000000 || (abs > 0 && abs < 0.0001)) return value.toExponential(6)
  return Number(value.toFixed(8)).toString()
}

module.exports = {
  UNIT_GROUPS,
  convertUnit,
  convertTemperature,
  getUnitGroupKeys,
  getUnitGroupLabels,
  getUnitOptions,
  getTemperatureOptions,
  formatUnitResult
}
