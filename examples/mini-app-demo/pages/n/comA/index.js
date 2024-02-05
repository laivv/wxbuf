Component({
  pageLifetimes: {
    pullDownRefresh() {
      this.setData({ text: '页面下拉刷新了' })
    },
    pageScroll() {
      this.setData({ text: '页面滚动了' })
    },
  }
})