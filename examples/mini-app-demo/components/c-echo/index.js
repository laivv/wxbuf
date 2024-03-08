Component({
  options: {
    virtualHost: true
  },
  properties: {
    filter: {
      type: String,
      value: '',
      observer() {
        this.render()
      }
    },
    params: {
      type: Array,
      value: [],
      observer() {
        this.render()
      }
    },
  },
  lifetimes: {
    attached() {
      this.render()
    }
  },
  methods: {
    render() {
      const { filter, params } = this.data
      if (this.$parent && this.$parent[filter]) {
        const text = this.$parent[filter](...params)
        this.setData({ text: text ?? '' })
      } else {
        this.setData({ text: '' })
      }
    }
  }
})