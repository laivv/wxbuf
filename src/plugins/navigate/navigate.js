import {
  isRouteAllow,
  createOpener,
  createFeature,
  createBody,
  startPage,
  resetSwitchTabParams,
  jumpPage,
} from "./helper"
import _wx from './_wx'
import { getPage } from "../../utils/index"

export const openPage = function (option) {
  if (isRouteAllow(option)) {
    createOpener(option, this)
    const promise = createFeature(option)
    createBody(option)
    startPage(option)
    return promise
  }
  return Promise.reject()
}

export const replacePage = function (option) {
  if (isRouteAllow(option)) {
    createBody(option)
    startPage(option, true)
  }
}

export const finish = function (data) {
  const context = this.$page ? this.$page : this
  if (context.$feature) {
    context.$feature.resolve(data)
    context.$feature = null
  }
  return wx.navigateBack()
}

export const navigateTo = function (option) {
  return jumpPage(_wx.navigateTo, option)
}

export const redirectTo = function (option) {
  return jumpPage(_wx.redirectTo, option)
}

export const reLaunch = function (option) {
  return jumpPage(_wx.reLaunch, option)
}

export const switchTab = function (option) {
  resetSwitchTabParams()
  return jumpPage(_wx.switchTab, option)
}

export const getUrlParams = function () {
  const page = this.$page || getPage(this)
  return page ? page.$params : null
}