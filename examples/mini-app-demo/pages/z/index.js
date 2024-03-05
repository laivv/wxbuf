Page({
  handleA() {
    const a = parseInt(Math.random() * 1000)
    wx.switchTab({
      url: `/pages/my/index?a=${a}&b=123`,
    })
  },
  handleB() {
    wx.showToast({
      title: getAppName(),
      icon: 'none'
    })
  },
  handleC() {
    this.showToast('这个页面toast方法定义在app.js中')
  },
  handleD() {
    wx.navigateTo({
      url: '/pages/o/index?count=10&list=[1,2,3]&isTrue=true&error=null&ndef=undefined&emptyStr=&id=157892112014121020112',
    })
  },
  async handleE() {
    await new Promise(resolve => setTimeout(resolve, 3000))
    wx.showToast({
      title: '提交成功',
      icon: 'none'
    })
  }
})