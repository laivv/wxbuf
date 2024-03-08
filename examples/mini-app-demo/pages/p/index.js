Page({
  data: {
    install: true
  },
  async handleA() {
    const value = await this.showPicker({
      title: '请选择',
      items: [
        { text: '选项1', value: 1 },
        { text: '选项2', value: 2 }
      ]
    })
    this.setData({ value })
  },
  observers: {
    install(v) {
      wx.showModal({
        content: v ? '已安装picker组件，页面可以正常打开picker' : '已卸载picker组件，页面无法正常打开picker',
        showCancel: false
      })
    }
  },
  handleB() {
    this.setData({ install: !this.data.install })
  }
})