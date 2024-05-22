import { definePlugin } from "../core/index"

const fireEvent = function (name, value) {
  let context, listeners
  const event = {
    route: this.route ? this.route : this.$route,
    value
  }
  const notify = (contexts) => {
    for (let i = contexts.length - 1; i >= 0; i--) {
      context = contexts[i]
      listeners = context.$ctorOptions.listeners || {}
      if (!listeners[name]) {
        continue
      }
      listeners[name].call(context, event)
      if (context.$components) {
        notify(context.$components)
      }
    }
  }
  notify(getApp().$pages)
  notify([getApp()])
}

export default definePlugin({
  lifetimes: {
    app_init(options) {
      const prefix = this.getConfig('methodPrefix')
      wx[`${prefix}fireEvent`] = fireEvent

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