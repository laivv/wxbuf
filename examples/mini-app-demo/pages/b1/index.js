Page({
  n: 1,
  handleA() {
    wx.showToast({ title: `第${this.n}次回传数据`, icon: 'none'})
    // invoke方法就是尝试调用父页面的方法，当父页面不存在方法时，不会报错
    this.invoke('updateData', { text: `第${this.n ++}次回传数据` })
  },
  handleB() {
    this.finish({ text: '我是来自被打开页单次回传的数据', value: Math.floor(Math.random() * 10000) })
  }
})