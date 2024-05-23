



export function traverseInstance(callback) {

  const appbarCache = []

  const walk = (contexts, callback) => {
    for (let i = contexts.length - 1; i >= 0; i--) {
      const context = contexts[i]
      if (context.$components) {
        walk(context.$components)
      }
      callback(context)

      if (isFunction(context.getTabBar)) {
        const tabbar = context.getTabBar()
        if (tabbar && isFunction(tabbar.setData)) {
          walk([tabbar])
          callback(tabbar)
        }
      }

      if (isFunction(context.getAppBar)) {
        const appbar = context.getAppBar()
        if (
          appbar &&
          isFunction(appbar.setData) &&
          !appbarCache.includes(appbar)
        ) {
          appbarCache.push(appbar)
          walk([appbar])
          callback(appbar)
        }
      }
    }
  }
  walk(getApp().$pages(), callback)
}