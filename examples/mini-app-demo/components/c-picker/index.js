Component({
  // 向父组件实例挂载方法
  exportMethods: {
    showPicker(option) {
      this.openPicker(option)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  },
  methods: {
    openPicker({ onOk, title, items, style = '', maskClose = true, noStyle = false }) {
      this.onOk = onOk
      this.setData({
        visible: true,
        title,
        items,
        noStyle,
        maskClose,
        style
      }, () => {
        setTimeout(() => {
          this.setData({ open: true })
        }, 16)
      })
    },
    async onSelected({ currentTarget: { dataset: { value } } }) {
      this.resolve && this.resolve(value)
      if (this.onOk) {
        await this.onOk(value)
      }
      this.close()
    },
    close() {
      this.setData({ open: false }, () => {
        setTimeout(() => {
          this.setData({ visible: false })
        }, 300)
      })
      this.resolve = null
      this.reject = null
      this.onOk = null
    },
    handleMaskTap() {
      if (this.data.maskClose) {
        this.close()
      }
    }
  }
})