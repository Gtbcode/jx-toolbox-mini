const {
  categories,
  searchCatalog
} = require('../../utils/data')

Page({
  data: {
    categories,
    activeIndex: 0,
    searchKeyword: '',
    tools: searchCatalog('', '全部')
  },
  applyFilters(keyword, activeIndex) {
    const index = typeof activeIndex === 'number' ? activeIndex : this.data.activeIndex
    const categoryName = categories[index]
    const tools = searchCatalog(keyword, categoryName)
    this.setData({
      searchKeyword: keyword,
      activeIndex: index,
      tools
    })
  },
  chooseCategory(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.applyFilters(this.data.searchKeyword, index)
  },
  onSearchInput(e) {
    this.applyFilters(e.detail.value, this.data.activeIndex)
  },
  onSearchConfirm(e) {
    this.applyFilters(e.detail.value, this.data.activeIndex)
  },
  onSearchClear() {
    this.applyFilters('', this.data.activeIndex)
  },
  goDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }
})
