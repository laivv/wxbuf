import { definePlugin } from "../core/index"
import { noop } from "../util"

export default definePlugin({
  lifetimes: {
    app_init_end(options) {
      this.proxy(options, 'onLaunch')
    },
    page_init_end(options) {
      this.proxy(options, 'onLoad')
    },
    component_init_end(options) {
      this.proxy(options, 'created')
    },
  },
  methods: {
    proxy(options, key) {
      const option = key === 'created' ? options.lifetimes : options
      const fn = option[key] || noop
      option[key] = function () {
        this.$ctorOptions = options
        return fn.apply(this, arguments)
      }
    }
  }
})



