import { definePlugin } from "../core/index"
import { callUserHook } from "../hookConfig"

export const appUserHook = definePlugin({
  options: {
    target: 'app'
  },
  lifetimes: {
    onLaunch(options) {
      callUserHook(getApp(), 'onAppLaunch', options)
    },
    onShow() {
      callUserHook(getApp(), 'onAppLaunch')
    },
    onHide() {
      callUserHook(getApp(), 'onAppHide')
    }
  }
})

export const pageUserHook = definePlugin({
  options: {
    target: 'page'
  },
  lifetimes: {
    onLoad(options) {
      callUserHook(this.$target, 'onPageLoad', options)
    },
    onShow() {
      callUserHook(this.$target, 'onPageShow')
    },
    onHide() {
      callUserHook(this.$target, 'onPageHide')
    },
    onPageScroll(e) {
      callUserHook(this.$target, 'onPageScroll', e)
    },
    onReachBottom() {
      callUserHook(this.$target, 'onPageReachBottom')
    },
    onPullDownRefresh() {
      callUserHook(this.$target, 'onPagePullDownRefresh')
    },
  }
})