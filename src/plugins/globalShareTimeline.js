import { definePlugin } from "../core/index"
import { getNavigateBarTitle } from "../util"

export default definePlugin({
  options: {
    target: 'page',
  },
  lifetimes: {
    init(page) {
      if (!this.getConfig('enableGlobalShareAppMessage') || page.onShareAppMessage) {
        return
      }
      page.onShareAppMessage = function (object) {
        let options = {
          title: getNavigateBarTitle(),
          url: `${this.route}${this.$rawParamsQuery ? `?${this.$rawParamsQuery}` : ''}`,
        }
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