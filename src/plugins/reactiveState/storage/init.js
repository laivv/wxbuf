import { getRealKey, extend } from "../../../util"
import { getStorageSync } from "./helper"

export const initStorage = function (option, context) {
  const mixinKeys = option.mixinStorage
  if (!Array.isArray(mixinKeys)) return
  const data = {}
  mixinKeys.forEach(key => {
    const [sourceKey, targetKey] = getRealKey(key)
    data[targetKey] = getStorageSync(sourceKey)
  })
  context.setData(data)
}

export const initAppStorage = function (context) {
  const mixinConfig = getApp.injectStorage
  if (!mixinConfig) return
  const mixinKeys = mixinConfig.keys
  const namespace = mixinConfig.namespace
  if (!Array.isArray(mixinKeys)) return
  const data = {}
  mixinKeys.forEach(key => {
    const [sourceKey, targetKey] = getRealKey(key)
    data[targetKey] = getStorageSync(sourceKey)
  })
  if (namespace) {
    const _data = extend({}, context.data[namespace] || {}, data)
    context.setData({ [namespace]: _data })
  } else {
    context.setData(data)
  }
}