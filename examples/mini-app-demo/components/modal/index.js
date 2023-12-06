Component({
  attached() {
  },
  pageMethods:{
    showPicker ({ onOk, ...option }) {
      this.showPicker(option)
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
    showPicker(option) {
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