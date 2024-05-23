import { definePlugin } from "../core/index"

export default definePlugin({
  lifetimes: {
    app_onLaunch(options) {
      this.callWatcher('onAppLaunch', options)
    },
    app_onShow() {
      this.callWatcher('onAppLaunch')
    },
    app_onHide() {
      this.callWatcher('onAppHide')
    },
    page_onLoad(options) {
      this.callWatcher('onPageLoad', options)
    },
    page_onShow() {
      this.callWatcher('onPageShow')
    },
    page_onHide() {
      this.callWatcher('onPageHide')
    },
    page_onPageScroll(e) {
      this.callWatcher('onPageScroll', e)
    },
    page_onReachBottom() {
      this.callWatcher('onPageReachBottom')
    },
    page_onPullDownRefresh() {
      this.callWatcher('onPagePullDownRefresh')
    },
  }
})
