import _wx from './_wx'
import { definePlugin } from "../../core/index"
import {
  resolveOpener,
  resolveBody,
  resolveFeature,
  resolveSwitchTabParams_onLoad,
  resolveSwitchTabParams_onShow,
  resolvePageRouter,
} from "./helper"
import {
  openPage,
  replacePage,
  reLaunch,
  navigateTo,
  redirectTo,
  switchTab,
  finish
} from './navigate'

export default definePlugin({
  targetHooks: {
    app_init() {
      this.proxyMethods(wx)
      this.mountMethods(wx)
    },
    page_init(options) {
      this.mountMethods(options)
    },
    component_init(options) {
      this.mountMethods(options.methods)
    },
    page_onLoad(options) {
      const target = this.$target
      resolveOpener(target)
      resolveBody(options, target)
      resolveSwitchTabParams_onLoad(options, target)
      resolveFeature(target)
      resolvePageRouter(target)
    },
    page_onShow() {
      resolveSwitchTabParams_onShow(this.$target, this.getConfig('parseUrlArgs'))
    },
    component_created() {
      resolvePageRouter(this.$target)
    }
  },
  methods: {
    mountMethods(options) {
      const prefix = this.getConfig('methodPrefix')
      options[`${prefix}openPage`] = openPage
      options[`${prefix}replacePage`] = replacePage
      options[`${prefix}finish`] = finish
    },
    proxyMethods(options) {
      const prefix = this.getConfig('methodPrefix')
      options[`${prefix}navigateTo`] = navigateTo
      options[`${prefix}redirectTo`] = redirectTo
      options[`${prefix}reLaunch`] = reLaunch
      options[`${prefix}switchTab`] = switchTab
    }
  }
})