Component({
  pageLifetimes: {
    pullDownRefresh() {
      this.setData({ text: '页面下拉刷新了' })
    },
    reachBottom() {
      wx.showToast({
        title: '组件A：页面到底了',
        icon: 'none'
      })
    },
    pageScroll() {
      this.setData({ text: '页面滚动了' })
    },
  }
})