Page({
  handleSwitch() {
    const a = parseInt(Math.random()* 1000)
    wx.switchTab({
      url: `/pages/my/index?a=${a}&b=123`,
    })
  }
})