
import { isFunction } from "../util"


export function traverseInstance(callback) {

  const appbarCache = []

  const walk = (contexts, callback) => {
    for (let i = contexts.length - 1; i >= 0; i--) {
      const context = contexts[i]
      if (context.$components) {
        walk(context.$components, callback)
      }
      callback(context)
    }
  }
  const walkTabbar = (pages) => {
    for (let i = pages.length - 1; i >= 0; i--) {
      const page = pages[i]
      if (isFunction(page.getTabBar)) {
        const tabbar = page.getTabBar()
        if (tabbar && isFunction(tabbar.setData)) {
          callback(tabbar)
        }
      }

      if (isFunction(page.getAppBar)) {
        const appbar = page.getAppBar()
        if (
          appbar &&
          isFunction(appbar.setData) &&
          !appbarCache.includes(appbar)
        ) {
          appbarCache.push(appbar)
          callback(appbar)
        }
      }
    }
  }
  walk(getApp().$pages, callback)
  walkTabbar(getApp().$pages, callback)
}