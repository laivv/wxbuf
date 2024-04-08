import { isFunction } from "./util"

const pages = []
const components = []


export function addPage(ob) {
  pages.push(ob)
}

export function removePage(ob) {
  const index = pages.indexOf(ob)
  const page = pages[index] || null
  if (index > -1) {
    pages.splice(index, 1)
  }
  return page
}

export function addCom(ob) {
  components.push(ob)
}

export function removeCom(context) {
  const index = components.findIndex(c => c.context === context)
  const com = components.find(c => c.context === context)
  if (index > -1) {
    components.splice(index, 1)
  }
  return com
}

export function getSavedPages() {
  return pages.slice(0)
}

export function getSavedComs() {
  return components.slice(0)
}

export function getSavedTabBars() {
  const tabbars = []
  pages.forEach(page => {
    if (isFunction(page.getTabBar)) {
      const tabbar = page.getTabBar()
      if (tabbar && isFunction(tabbar.setData)) {
        tabbars.push(tabbar)
      }
    }
  })
  return tabbars
}
// skyline support
export function getSavedAppBars() {
  const appbars = []
  pages.forEach(page => {
    if (isFunction(page.getAppBar)) {
      const appbar = page.getAppBar()
      if (appbar && isFunction(appbar.setData) && !appbars.includes(appbar)) {
        appbars.push(appbar)
      }
    }
  })
  return appbars
}