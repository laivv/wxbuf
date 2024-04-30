Component({
  properties: {
    placeholder: String,
    vModel: {
      type: String,
      value: '',
      observer() {
        this.init()
      }
    },
  },
  // wxbuf提供了一些父组件的生命周期parentLifetimes
  parentLifetimes: {
    // 父组件发生setData行为时调用
    setData() {
      this.init()
    }
  },
  lifetimes: {
    attached() {
      this.init()
    }
  },
  data: {
    value: '',
  },
  methods: {
    init() {
      if (this.$parent && this.data.vModel) {
        const value = this.getValueByKeypath(this.$parent.data, this.data.vModel)
        if (value !== this.data.value) {
          this.setData({ value })
        }
      }
    },
    handleInput({ detail: { value } }) {
      if (this.$parent && this.data.vModel) {
        this.$parent.setData({ [this.data.vModel]: value })
      }
      this.setData({ value })
    },
    getValueByKeypath(data, keypath) {
      const keys = keypath.split(/\[|\]|\./).filter(Boolean).map(i => i.replace(/\'|\"/g, ''))
      let val = undefined
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        data = val = data[key]
      }
      return val
    }
  }
})