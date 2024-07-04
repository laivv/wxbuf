import { definePlugin } from "../core/index"
import { getPageTabbar } from "../utils/index"

export default definePlugin({
  targetHooks: {
    page_onLoad: function () {
      this.init()
    },
    page_onShow() {
      this.callTabbarLifetime('show')
    },
    page_onHide() {
      this.callTabbarLifetime('hide')
    },
    page_onPageScroll(e){
      this.callTabbarLifetime('pageScroll', e)
    },
    page_onReachBottom(){
      this.callTabbarLifetime('reachBottom')
    },
    page_onPullDownRefresh(){
      this.callTabbarLifetime('pullDownRefresh')
    },
  },
  methods: {
    init() {
      const tabbar = getPageTabbar(this.$target)
      if (tabbar) {
        tabbar.$page = this
        tabbar.$feature = this.$feature
        tabbar.$route = this.route
      }
    },
    callTabbarLifetime(name, ...args) {
      const tabbar = getPageTabbar(this.$target)
      if (tabbar) {
        const lifetime = (tabbar.$ctorOptions.pageLifetimes || {})[name]
        if (lifetime) {
          lifetime.apply(tabbar, args)
        }
      }
    }
  }
})

