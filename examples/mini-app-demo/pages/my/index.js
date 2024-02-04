Page({
  // 首次进入页面在onLoad钩子接收wx.switchTab参数
  onLoad(options) {
    this.setData({ data: JSON.stringify(options) })
  },
  // 非首次(第二次onShow及之后)在onSwitchTab钩子接收wx.switchTab参数
  onSwitchTab(options) {
    this.setData({ data: JSON.stringify(options) })
  }
})