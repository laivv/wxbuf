Page({
  // 首次进入页面在onLoad钩子接收wx.switchTab参数
  onLoad(options) {
    this.setData({ data: JSON.stringify(options) })
  },
  // 非首次进入页面在onSwitchTab钩子接收wx.switchTab参数
  onSwitchTab(options) {
    this.setData({ data: JSON.stringify(options) })
  }
})