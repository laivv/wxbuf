Component({
  // 向父组件实例挂载方法
  exportMethods:{
    showPicker ({ onOk, ...option }) {
      this.openPicker(option)
      return new Promise((resolve, reject) => {
        this.data.resolve = resolve
        this.data.reject = reject
        this.data.onOk = onOk
      })
    }
  },
  data: {
    visible: false,
    resolve: null,
    reject: null
  },
  methods: {
    openPicker(option) {
      this.setData({ visible: true, ...option })
    },
    async onSelected({ currentTarget: { dataset: { value } } }) {
      this.data.resolve && this.data.resolve(value)
      if (this.data.onOk) {
        await this.data.onOk(value)
      }
      this.setData({ visible: false })
      this.data.onOk = null
      this.data.resolve = null
      this.data.reject = null
    }
  }
})