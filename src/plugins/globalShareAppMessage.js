import { definePlugin } from "../core/index"
import { getNavigateBarTitle } from "../util"

export default definePlugin({
  options: {
    target: 'page',
  },
  lifetimes: {
    init(page) {
      if (this.getConfig('enableGlobalShareTimeline') && !page.onShareTimeline) {
        page.onShareTimeline = function () {
          let options = {
            title: getNavigateBarTitle(),
            query: this.$rawParamsQuery,
          }
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
  }
})