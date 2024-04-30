Component({
  pageLifetimes: {
    // 非首次进入在switchTab钩子接收wx.switchTab参数 
    switchTab(options) {
      this.setData({ data: JSON.stringify(options) })
    }
  },
  lifetimes: {
    // 首次在ready钩子之后的生命周期获取wx.switchTab参数
    // 在ready之前的生命周期调用this.getUrlParams()可能不会得到正确结果
    ready() {
      this.setData({ data: JSON.stringify(this.getUrlParams()) })
    }
  }
})