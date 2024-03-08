Component({
  data: {
    install: true
  },
  observers: {
    install(v) {
      wx.showModal({
        content: v ? '已安装picker组件，组件A可以正常打开picker' : '已卸载picker组件，组件A无法正常打开picker',
        showCancel: false
      })
    }
  },
  methods: {
    handle() {
      this.$picker.showPicker({
        title: '请选择',
        items: [{ text: '选项1', value: 1 }, { text: '选项2', value: 2 }],
        onOk: async (value) => {
          this.setData({ value })
          wx.showLoading()
          await new Promise(resolve => setTimeout(resolve, 3000))
          wx.hideLoading()
        }
      })
    },
    handleB() {
      this.setData({ install: !this.data.install })
    }
  }
})