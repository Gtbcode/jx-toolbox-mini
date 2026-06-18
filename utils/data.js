const categories = ['全部', '图片工具', '文字工具', '计算换算', '生活工具']

const tools = [
  {
    id: 'watermark',
    mode: 'image-watermark',
    name: '水印处理',
    desc: '为图片添加文字水印并导出',
    tags: ['水印', '图片'],
    iconType: 'watermark',
    color: '#8B5CF6',
    category: '图片工具',
    highlights: ['平铺 / 居中 / 右下角', '可调字号与透明度', '本地 Canvas 绘制'],
    scenes: [
      { icon: '版', name: '版权标识', desc: '给作品添加署名' },
      { icon: '防', name: '防搬运', desc: '平铺水印防截图' }
    ]
  },
  {
    id: 'image-mosaic',
    mode: 'image-mosaic',
    name: '图片打码',
    desc: '框选区域添加马赛克，支持缩放预览',
    tags: ['打码', '隐私'],
    iconType: 'mosaic',
    color: '#F97316',
    badge: '常用',
    category: '图片工具',
    highlights: ['手指框选打码区域', '双指缩放 / 拖动视图', '本地 Canvas 处理'],
    scenes: [
      { icon: '隐', name: '隐私遮挡', desc: '遮挡证件号、人脸' },
      { icon: '享', name: '安全分享', desc: '打码后再发图' }
    ]
  },
  {
    id: 'image-compress',
    mode: 'image-compress',
    name: '图片压缩',
    desc: '按目标宽度与质量压缩图片，减小体积',
    tags: ['压缩', '本地处理'],
    iconType: 'compress',
    color: '#0A7BFF',
    badge: '常用',
    category: '图片工具',
    highlights: ['按宽度与质量压缩', '实时预览输出尺寸', '支持 JPG / PNG 导出'],
    scenes: [
      { icon: '传', name: '聊天发送', desc: '压缩大图便于分享' },
      { icon: '存', name: '节省空间', desc: '降低相册占用' }
    ]
  },
  {
    id: 'image-crop',
    mode: 'image-crop',
    name: '图片裁剪',
    desc: '调用系统裁剪框，快速裁切图片',
    tags: ['裁剪', '本地处理'],
    iconType: 'crop',
    color: '#05C8E8',
    badge: '常用',
    category: '图片工具',
    highlights: ['系统原生裁剪体验', '支持自由比例', '裁剪后可导出保存'],
    scenes: [
      { icon: '头', name: '头像制作', desc: '裁切正方形头像' },
      { icon: '证', name: '证件照', desc: '调整构图区域' }
    ]
  },
  {
    id: 'text-extract',
    mode: 'text',
    name: '文字提取',
    desc: '从文本中提取邮箱、电话、链接等信息',
    tags: ['提取', '文本'],
    iconType: 'text',
    color: '#7C5CFF',
    badge: '常用',
    category: '文字工具',
    highlights: ['提取邮箱 / 电话 / 链接', '统计字数与行数', '一键整理文本格式'],
    scenes: [
      { icon: '联', name: '联系方式', desc: '批量提取电话邮箱' },
      { icon: '整', name: '文本整理', desc: '去空行与多余空格' }
    ]
  },
  {
    id: 'unit-convert',
    mode: 'unit',
    name: '单位换算',
    desc: '长度、重量、面积、体积与温度换算',
    tags: ['换算', '计算'],
    iconType: 'unit',
    color: '#FF8A00',
    badge: '常用',
    category: '计算换算',
    highlights: ['多类常用单位', '实时换算结果', '支持温度换算'],
    scenes: [
      { icon: '长', name: '长度换算', desc: '米 / 千米 / 英里' },
      { icon: '温', name: '温度换算', desc: '摄氏 / 华氏 / 开尔文' }
    ]
  },
  {
    id: 'format-convert',
    mode: 'image-format',
    name: '格式转换',
    desc: '在 JPG 与 PNG 之间转换图片格式',
    tags: ['格式', '图片'],
    iconType: 'format',
    color: '#22C55E',
    category: '图片工具',
    highlights: ['JPG / PNG 互转', '可选导出质量', '本地 Canvas 处理'],
    scenes: [
      { icon: '透', name: '透明图', desc: 'PNG 保留透明通道' },
      { icon: '小', name: '体积优化', desc: 'JPG 适合照片分享' }
    ]
  },
  {
    id: 'qrcode-gen',
    mode: 'qrcode',
    name: '二维码生成',
    desc: '输入文字或链接，本地生成二维码',
    tags: ['二维码', '生成'],
    iconType: 'qrcode',
    color: '#111827',
    category: '生活工具',
    highlights: ['本地生成二维码', '支持保存到相册', '可调尺寸与颜色'],
    scenes: [
      { icon: '链', name: '链接分享', desc: '生成网址二维码' },
      { icon: 'Wi', name: 'WiFi 信息', desc: '粘贴 WiFi 文本生成码' }
    ]
  },
  {
    id: 'case-convert',
    mode: 'case',
    name: '大小写转换',
    desc: '英文大小写、首字母大写等快速转换',
    tags: ['英文', '转换'],
    iconType: 'case',
    color: '#2563EB',
    category: '文字工具',
    highlights: ['全大写 / 全小写', '标题格式 / 句首大写', '一键复制结果'],
    scenes: [
      { icon: '标', name: '标题规范', desc: '英文标题首字母大写' },
      { icon: '邮', name: '邮箱整理', desc: '统一为小写格式' }
    ]
  },
  {
    id: 'time-calc',
    mode: 'time',
    name: '时间计算',
    desc: '计算两个日期相差天数，或日期加减',
    tags: ['日期', '计算'],
    iconType: 'time',
    color: '#0EA5E9',
    category: '生活工具',
    highlights: ['日期差值计算', '日期加减天数', '支持常见日期格式'],
    scenes: [
      { icon: '假', name: '请假天数', desc: '计算起止日期差' },
      { icon: '倒', name: '倒计时', desc: '距离目标日期还有几天' }
    ]
  },
  {
    id: 'random-num',
    mode: 'random',
    name: '随机数',
    desc: '在指定范围内生成随机整数或小数',
    tags: ['随机', '抽奖'],
    iconType: 'random',
    color: '#F97316',
    category: '计算换算',
    highlights: ['整数 / 小数随机', '可设置数量批量生成', '一键复制全部结果'],
    scenes: [
      { icon: '抽', name: '抽奖号码', desc: '生成不重复随机数' },
      { icon: '测', name: '测试数据', desc: '快速生成样例数值' }
    ]
  },
  {
    id: 'color-convert',
    mode: 'color',
    name: '颜色转换',
    desc: 'HEX、RGB、HSL 颜色格式互转',
    tags: ['颜色', '设计'],
    iconType: 'color',
    color: '#EC4899',
    category: '生活工具',
    highlights: ['HEX / RGB / HSL 互转', '实时颜色预览', '一键复制各格式'],
    scenes: [
      { icon: 'UI', name: '界面取色', desc: '设计稿颜色格式转换' },
      { icon: '码', name: '代码开发', desc: 'CSS 颜色值互转' }
    ]
  },
  {
    id: 'bmi-calc',
    mode: 'bmi',
    name: 'BMI计算',
    desc: '输入身高体重，计算 BMI 与健康区间',
    tags: ['健康', '计算'],
    iconType: 'bmi',
    color: '#14B8A6',
    category: '生活工具',
    highlights: ['即时 BMI 结果', '中文健康区间提示', '支持公制单位'],
    scenes: [
      { icon: '体', name: '体重管理', desc: '了解当前 BMI 区间' },
      { icon: '健', name: '健康参考', desc: '辅助评估体型状态' }
    ]
  },
  {
    id: 'wallet-calc',
    mode: 'calc',
    name: '记账计算',
    desc: '四则运算计算器，支持括号与连续计算',
    tags: ['计算', '记账'],
    iconType: 'wallet',
    color: '#6366F1',
    category: '计算换算',
    highlights: ['加减乘除与括号', '连续输入表达式', '一键复制结果'],
    scenes: [
      { icon: '账', name: '日常记账', desc: '快速核算金额' },
      { icon: '算', name: '简单运算', desc: '替代系统计算器' }
    ]
  },
  {
    id: 'layout',
    mode: 'layout',
    name: '拼图排版',
    desc: '将 2～4 张图片拼接为一张长图',
    tags: ['拼图', '排版'],
    iconType: 'layout',
    color: '#64748B',
    category: '图片工具',
    highlights: ['2～4 图纵向拼接', '等宽自适应高度', '本地合成导出'],
    scenes: [
      { icon: '晒', name: '长图分享', desc: '多张截图合成一条' },
      { icon: '对', name: '对比展示', desc: '前后效果拼图' }
    ]
  },
  {
    id: 'number-tool',
    mode: 'number',
    name: '数字转大写',
    desc: '金额数字转中文大写与小写读法',
    tags: ['金额', '大写'],
    iconType: 'number',
    color: '#0A7BFF',
    category: '文字工具',
    highlights: ['中文大写金额', '中文小写数字', '支持负数与小数'],
    scenes: [
      { icon: '票', name: '票据填开', desc: '金额大写转换' },
      { icon: '合', name: '合同金额', desc: '规范中文金额写法' }
    ]
  }
]

const catalog = tools

function getToolById(id) {
  return tools.find(item => item.id === id)
}

function getFeaturedTools() {
  return tools.filter(item => item.badge === '常用').slice(0, 4)
}

function getAllDisplayTools() {
  const list = tools.slice(0, 7)
  return list.concat([{
    id: 'more-tools',
    name: '更多',
    desc: '查看全部工具',
    iconType: 'more',
    color: '#94A3B8',
    category: '全部',
    isMore: true
  }])
}

function getToolsByCategory(category) {
  if (category === '全部') return catalog.slice()
  return catalog.filter(item => item.category === category)
}

function searchCatalog(keyword, category) {
  const query = String(keyword || '').trim().toLowerCase()
  let list = catalog.slice()
  if (category && category !== '全部') {
    list = list.filter(item => item.category === category)
  }
  if (!query) return list
  return list.filter(item => {
    const name = String(item.name || '').toLowerCase()
    const desc = String(item.desc || '').toLowerCase()
    const itemCategory = String(item.category || '').toLowerCase()
    return name.includes(query) || desc.includes(query) || itemCategory.includes(query)
  })
}

module.exports = {
  categories,
  tools,
  catalog,
  getToolById,
  getFeaturedTools,
  getAllDisplayTools,
  getToolsByCategory,
  searchCatalog
}
