import _wx from './_wx'
import { definePlugin } from "../../core/index"
import {
  resolveOpener,
  resolveBody,
  resolveFeature,
  resolveSwitchTabParams_onLoad,
  resolveSwitchTabParams_onShow,
  resolvePageRouter,
  resolveParams,
  destoryFeature,
  callSwitchTabHook
} from "./helper"
import {
  openPage,
  replacePage,
  reLaunch,
  navigateTo,
  redirectTo,
  switchTab,
  finish,
  getUrlParams
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
      resolveParams(options, target, this.getConfig('parseUrlArgs'))
      resolveFeature(target)
      resolvePageRouter(target)

    },
    page_onShow() {
      const params = resolveSwitchTabParams_onShow(this.$target, this.getConfig('parseUrlArgs'))
      callSwitchTabHook(params || {})
      this.$target._isWakeUp = true
    },
    page_onUnload() {
      destoryFeature(this.$target)
    },
    component_init(options) {
      this.mountComMethods(options.methods)
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
    },
    mountComMethods(options) {
      const prefix = this.getConfig('methodPrefix')
      options[`${prefix}getUrlParams`] = getUrlParams
    }
  }
})