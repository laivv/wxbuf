Page({
  data: {
    count: 1
  },
  observers: {
    count(v) {
      wx.showToast({ title: '您修改了count的值，新值是' + v, icon: 'none' })
    }
  },
  handle() {
    this.setData({ count: this.data.count + 1 })
  }
})