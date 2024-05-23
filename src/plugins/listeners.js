import { definePlugin } from "../core/index"
import { isFunction } from "../util"

const fireEvent = function (name, value) {

  const event = {
    route: this.route ? this.route : this.$route,
    value
  }

  const callListener = function (context) {
    const listeners = context.$ctorOptions.listeners || {}
    if (listeners[name]) {
      listeners[name].call(context, event)
    }
  }


  const notify = (contexts) => {
    for (let i = contexts.length - 1; i >= 0; i--) {
      const context = contexts[i]
      if (context.$components) {
        notify(context.$components)
      }
      callListener(context)

      if (isFunction(context.getTabBar)) {
        const tabbar = context.getTabBar()
        if (tabbar && isFunction(tabbar.setData)) {
          notify([tabbar])
        }
      }

      if (isFunction(context.getAppBar)) {
        const appbar = context.getAppBar()
        if (appbar && isFunction(appbar.setData)) {
          // todo 此处要作去重，appbar可能是共享实例
          notify([appbar])
        }
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