import { definePlugin } from "../core/index"

export default definePlugin({
  options: {
    target: 'page'
  },
  lifetimes: {
    init() {
      const app = getApp()
      if (!app.$pages)
        app.$pages = []
    },
    onLoad() {
      const app = getApp()
      app.$pages.push(this.$target)
    },
    onUnload() {
      const app = getApp()
      const index = app.$pages.indexOf(this.$target)
      if (index > -1)
        app.$pages.splice(index, 1)
    }
  }
})


