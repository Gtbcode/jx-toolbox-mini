const {
  getFeaturedTools,
  getAllDisplayTools
} = require('../../utils/data')

Page({
  data: {
    commonTools: getFeaturedTools(),
    allTools: getAllDisplayTools()
  },
  goDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  },
  onAllItemTap(e) {
    if (e.currentTarget.dataset.more) {
      wx.reLaunch({ url: '/pages/category/category' })
      return
    }
    this.goDetail(e)
  }
})
