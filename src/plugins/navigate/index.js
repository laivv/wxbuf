import {
  isRouteAllow,
  createOpener,
  createFeature,
  createBody,
  startPage,
  resolveOpener,
  resolveBody,
  resolveFeature,
  resolveSwitchTabParams_onLoad,
  resolveSwitchTabParams_onShow,
  resetSwitchTabParams,
  jumpPage, 
} from "./helper"

import _wx from './_wx'
import { definePlugin } from "../../core/index"

const openPage = function (option) {
  if (isRouteAllow(option)) {
    createOpener(option, this)
    const promise = createFeature(option)
    createBody(option)
    startPage(option)
    return promise
  }
  return Promise.reject()
}

const replacePage = function (option) {
  if (isRouteAllow(option)) {
    createBody(option)
    startPage(option, true)
  }
}

const finish = function (data) {
  const context = this.$page ? this.$page : this
  if (context.$feature) {
    context.$feature.resolve(data)
    context.$feature = null
  }
  return wx.navigateBack()
}




const navigateTo = function (option) {
  return jumpPage(_wx.navigateTo, option)
}

const redirectTo = function (option) {
  return jumpPage(_wx.redirectTo, option)
}

const reLaunch = function (option) {
  return jumpPage(_wx.reLaunch, option)
}

const switchTab = function (option) {
  resetSwitchTabParams()
  return jumpPage(_wx.switchTab, option)
}


export default definePlugin({
  lifetimes: {
    app_init() {
      const prefix = this.getConfig('prefix')
      wx[`${prefix}openPage`] = openPage
      wx[`${prefix}replacePage`] = replacePage
      wx[`${prefix}navigateTo`] = navigateTo
      wx[`${prefix}redirectTo`] = redirectTo
      wx[`${prefix}reLaunch`] = reLaunch
      wx[`${prefix}switchTab`] = switchTab
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
      resolveSwitchTabParams_onLoad(params, target)
      resolveFeature(target)
    },
    page_onShow() {
      resolveSwitchTabParams_onShow(this.$target, this.getConfig('parseUrlArgs'))
    }
  },
  methods: {
    mountMethods(options) {
      const prefix = this.getConfig('prefix')
      options[`${prefix}openPage`] = openPage
      options[`${prefix}replacePage`] = replacePage
      options[`${prefix}finish`] = finish
    }
  }
})