import { definePlugin } from "../core/index"
import { isObject } from "../util"

export default definePlugin({
  lifetimes: {
    page_init(page) {
      const cb = page.onShareTimeline
      if (!cb) return
      page.onShareTimeline = function () {
        let options = cb.call(this)
        const app = getApp()
        if (app.onPageShareTimeline) {
          const ret = app.onPageShareTimeline(this, options)
          options = isObject(ret) ? ret : options
        }
        return options
      }
    }
  }
})