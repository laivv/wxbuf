Component({
  externalClasses: ["class"],
  options: {
    virtualHost: true,
  },
  properties: {
    value: {
      optionalTypes: [String, Number, Object, Array, Boolean, null]
    },
    filter: String,
    params: {
      optionalTypes: [String, Number, Object, Array, Boolean, null]
    }
  },
  observers: {
    "filter,params,value"() {
      this.render()
    },
  },
  lifetimes: {
    attached() {
      this.render()
    },
  },
  data: {
    text: "",
  },
  methods: {
    render() {
      const { value, filter, params } = this.data
      let text = value
      if (filter) {
        const handler = this.$parent[filter]
        const _params = Array.isArray(params) ? params : [params]
        if (handler) {
          text = handler.call(this.$parent, value, ..._params)
        }
      }
      this.setData({ text: text ?? "" })
    },
  },
})
