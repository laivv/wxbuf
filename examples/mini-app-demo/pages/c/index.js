Page({
  listeners: {
    dataChange(e) {
      this.setData({ eventData: e.value })
    }
  },
  handle() {
    this.openPage({
      url: '/pages/c1/index',
    })
  }
})