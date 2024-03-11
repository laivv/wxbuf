Page({
  data: {
    count: 1,
    obj: { count: 1 }
  },
  observers: {
    count(v) {
      wx.showToast({ title: '您修改了count的值，新值是' + v, icon: 'none' })
    },
    'obj.count'(v) {
      wx.showToast({ title: '您修改了obj.count的值，新值是' + v, icon: 'none' })
    },
    // obj(o) {
    //   wx.showToast({ title: '您修改了obj，obj.count新值是' + o.count, icon: 'none' })
    // }
  },
  handleA() {
    this.setData({ count: this.data.count + 1 })
  },
  handleB() {
    // this.setData({ 'obj.count': this.data.obj.count + 1 })
    this.setData({ obj: { count: this.data.obj.count + 1 } })
  }
})