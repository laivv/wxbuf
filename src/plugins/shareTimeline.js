import { definePlugin } from "../core/index"
import { isObject } from "../util"

export default definePlugin({
  options: {
    target: 'page'
  },
  lifetimes: {
    init(page) {
      const cb = page.onShareTimeline
      if (!cb) return
      page.onShareTimeline = function () {
        let options = cb.call(this)
        const app = getApp()
        if (app.onPageShareTimeline) {
          const ret = app.onPageShareTimeline(this, options)
          if (isObject(ret)) {
            options = ret
          }
        }
        return options
      }
    }
  }
})