import { definePlugin } from "../core/index"
import { isObject } from "../util"

export default definePlugin({
  lifetimes: {
    page_init(page) {
      const cb = page.onShareAppMessage
      if (!cb) return
      page.onShareAppMessage = function (object) {
        let options = cb.call(this, object)
        const app = getApp()
        if (app.onPageShareAppMessage) {
          const ret = app.onPageShareAppMessage(this, options, object)
          options = isObject(ret) ? ret : options
        }
        return options
      }
    }
  }
})