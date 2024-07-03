import { definePlugin } from "../core/index"

export default definePlugin({
  targetHooks: {
    page_init() {
      const app = getApp()
      if (!app.$pages)
        app.$pages = []
    },
    page_onLoad() {
      const app = getApp()
      app.$pages.push(this.$target)
    },
    page_onUnload() {
      const app = getApp()
      const index = app.$pages.indexOf(this.$target)
      if (index > -1)
        app.$pages.splice(index, 1)
    }
  }
})


