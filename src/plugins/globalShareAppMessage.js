import { definePlugin } from "../core/index"
import { getNavigateBarTitle } from "../util"

export default definePlugin({
  options: {
    target: 'page',
  },
  lifetimes: {
    init(page) {
      if (!this.getConfig('enableGlobalShareTimeline') || page.onShareTimeline) {
        return
      }
      page.onShareTimeline = function () {
        let options = {
          title: getNavigateBarTitle(),
          query: this.$rawParamsQuery,
        }
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