Page({
  async handleA() {
    const value = await this.showPicker({
      title: '请选择',
      items: [{ text: '选项1', value: 1 }, { text: '选项2', value: 2 }]
    })
    this.setData({ value1: value })
  },
  handleB() {
    this.showPicker({
      title: '请选择',
      items: [{ text: 'wxbuf选项1', value: 1 }, { text: 'wxbuf选项2', value: 2 }],
      onOk: async (value) => {
        this.setData({ value2: value })
        wx.showLoading()
        await new Promise(resolve => setTimeout(resolve, 3000))
        wx.hideLoading()
      }
    })
  }
})