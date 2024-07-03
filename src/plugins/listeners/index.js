import { definePlugin } from "../../core/index"
import { fireEvent } from "./fireEvent"

export default definePlugin({
  targetHooks: {
    app_init(options) {
      this.mountMethods(wx)
      this.mountMethods(options)
    },
    page_init(options) {
      this.mountMethods(options)
    },
    component_init(options) {
      this.mountMethods(options.methods)
    }
  },
  methods: {
    mountMethods(options) {
      const prefix = this.getConfig('methodPrefix')
      options[`${prefix}fireEvent`] = fireEvent
    }
  }
})