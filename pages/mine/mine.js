Page({
  data: {
    menus: [
      { icon: 'doc', name: '使用说明', color: 'blue' },
      { icon: 'shield', name: '隐私说明', color: 'blue' },
      { icon: 'info', name: '关于我们', color: 'green' }
    ],
    benefits: [
      { icon: 'gift', title: '免费使用', desc: '所有工具免费' },
      { icon: 'shield', title: '本地处理', desc: '数据安全可靠' },
      { icon: 'rocket', title: '持续更新', desc: '更多工具上线' }
    ]
  },
  onMenuTap(e) {
    const name = e.currentTarget.dataset.name
    wx.showToast({ title: `${name}功能即将上线`, icon: 'none' })
  }
})
