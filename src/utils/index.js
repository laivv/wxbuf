import { isFunction } from "../util"

export const getPage = function (context) {
  let p
  while (p = context.selectOwnerComponent()) {
    context = p
  }
  return context.route ? context : null
}

export const getPageTabbar = context => {
  if (isFunction(context.getTabBar)) {
    const tabbar = context.getTabBar()
    if (tabbar && isFunction(tabbar.setData)) {
      return tabbar
    }
    return null
  }
  return null
}