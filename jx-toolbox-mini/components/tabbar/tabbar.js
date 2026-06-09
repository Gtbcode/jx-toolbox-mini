Component({
  properties: {
    active: {
      type: String,
      value: 'home'
    }
  },
  data: {
    items: [
      { key: 'home', text: '首页', icon: 'home', url: '/pages/index/index' },
      { key: 'category', text: '工具', icon: 'grid', url: '/pages/category/category' },
      { key: 'mine', text: '我的', icon: 'user', url: '/pages/mine/mine' }
    ]
  },
  methods: {
    go(e) {
      const url = e.currentTarget.dataset.url
      wx.reLaunch({ url })
    }
  }
})
