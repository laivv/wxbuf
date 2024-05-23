import _wx from './_wx'
import { noop } from '../../../util'
import { storageCache } from './cache'
import { updateModelSync } from '../shared/updateModel'
import { updateViewAsync } from '../shared/updateView'

export const getStorageSync = function (key) {
  return storageCache.get(key)
}

export const setStorage = function (option) {
  const { success, key, data } = option
  if (!key) return
  const oldVal = storageCache.get(key)
  option.success = function () {
    storageCache.set(key, data)
    const kvs = { [key]: data }
    const oldkvs = { [key]: oldVal }
    updateModelSync(kvs, 'storage')
    updateViewAsync({ kvs, oldkvs, name: 'storage' })
    return (success || noop).apply(this, arguments)
  }
  return _wx.setStorage.apply(wx, arguments)
}

export const batchSetStorage = function (option) {
  const { kvList, success } = option
  const oldVal = function () {
    const o = {}
    kvList.forEach(({ key }) => o[key] = getStorageSync(key))
    return o
  }()
  option.success = function () {
    const kvs = {}
    kvList.forEach(({ key, value }) => {
      kvs[key] = value
      storageCache.set(key, value)
    })
    updateModelSync(kvs, 'storage')
    updateViewAsync({ kvs, oldkvs: oldVal, name: 'storage' })
    return (success || noop).apply(this, arguments)
  }
  return _wx.batchSetStorage.apply(wx, arguments)
}

export const removeStorage = function (option) {
  const { key, success } = option
  if (!key) return
  const oldVal = storageCache.get(key)
  option.success = function () {
    storageCache.remove(key)
    const kvs = { [key]: '' }
    const oldkvs = { [key]: oldVal }
    updateModelSync(kvs, 'storage')
    updateViewAsync({ kvs, oldkvs, name: 'storage' })
    return (success || noop).apply(this, arguments)
  }
  return _wx.removeStorage.call(wx, option)
}

export const setStorageSync = function (key, value) {
  if (!key) return
  const oldVal = storageCache.get(key)
  storageCache.set(key, value)
  _wx.setStorageSync.call(wx, key, value)
  const kvs = { [key]: value }
  const oldkvs = { [key]: oldVal }
  updateModelSync(kvs, 'storage')
  updateViewAsync({ kvs, oldkvs, name: 'storage' })
}

export const batchSetStorageSync = function (kvList) {
  const kvs = {}
  const oldkvs = {}
  kvList.forEach(({ key, value }) => {
    kvs[key] = value
    storageCache.set(key, value)
    oldkvs[key] = getStorageSync(key)
  })
  updateModelSync(kvs, 'storage')
  updateViewAsync({ kvs, oldkvs, name: 'storage' })
  return _wx.batchSetStorageSync.apply(wx, arguments)
}

export const removeStorageSync = function (key) {
  if (!key) return
  const oldValue = storageCache.get(key)
  storageCache.remove(key)
  _wx.removeStorageSync.call(wx, key)
  const kvs = { [key]: '' }
  const oldkvs = { [key]: oldValue }
  updateModelSync(kvs, 'storage')
  updateViewAsync({ kvs, oldkvs, name: 'storage' })
}

export const clearStorage = function (option = {}) {
  const success = option.success
  const keys = _wx.getStorageInfoSync().keys
  option.success = function () {
    const kvs = {}
    const oldkvs = {}
    keys.forEach(key => {
      kvs[key] = ''
      storageCache.remove(key)
      oldkvs[key] = getStorageSync(key)
    })
    updateModelSync(kvs, 'storage')
    updateViewAsync({ kvs, oldkvs, name: 'storage' })
    return (success || noop).apply(wx, arguments)
  }
  return _wx.clearStorage.call(wx, option)
}

export const clearStorageSync = function () {
  const kvs = {}
  const oldkvs = {}
  _wx.getStorageInfoSync().keys.forEach(key => {
    kvs[key] = ''
    storageCache.remove(key)
    oldkvs[key] = getStorageSync(key)
  })
  updateModelSync(kvs, 'storage')
  updateViewAsync({ kvs, oldkvs, name: 'storage' })
  return _wx.clearStorageSync.apply(wx, arguments)
}