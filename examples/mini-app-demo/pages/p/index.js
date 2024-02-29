Page({
  async handleA() {
    const item = text => `<div style="color: #fff;background: rgb(25, 175, 83);padding: 8px 0;border-bottom: solid 1px #eee;">${text}</div>`
    const value = await this.showPicker({
      noStyle: true,
      title: '<span style="color: red;font-size: 30px">请选择</span>',
      items: [
        { text: item('选项1'), value: 1 },
        { text: item('选项2'), value: 2 }
      ]
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