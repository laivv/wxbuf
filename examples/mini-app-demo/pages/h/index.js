Page({
  data: {
    count: 1
  },
  observers: {
    count() {
      wx.showToast({ title: '您修改了count的值', icon: 'none' })
    }
  },
  handle() {
    this.setData({ count: this.data.count + 1 })
  }
})