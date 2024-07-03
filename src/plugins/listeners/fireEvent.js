import { isFunction } from "../../util"

export const fireEvent = function (name, value) {

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