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
  lifetimes: {
    attached() {
      const ctx = this
      this.$_setData = this.$parent.setData
      this.$parent.setData = function () {
        ctx.$_setData.apply(this, arguments)
        ctx.init()
      }
    },
    detached() {
      this.$parent.setData = this.$_setData
    }
  },
  data: {
    value: '',
  },
  methods: {
    init() {
      if (this.$parent && this.data.vModel) {
        const value = this.getValueByKeypath(this.$parent.data, this.data.vModel)
        this.setData({ value })
      }
    },
    handleInput({ detail: { value } }) {
      if (this.data.vModel) {
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