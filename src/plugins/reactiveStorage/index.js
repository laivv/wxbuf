
const setStorage = function (option) {
  const { success, key, data } = option
  if (!key) return
  const oldVal = storageCache.get(key)
  option.success = function () {
    storageCache.set(key, data)
    updateMixinsAsync({ [key]: data }, { [key]: oldVal }, 'storage')
    return (success || noop).apply(this, arguments)
  }
  return _setStorage.apply(wx, arguments)
}

const batchSetStorage = function (option) {
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
    updateMixinsAsync(kvs, oldVal, 'storage')
    return (success || noop).apply(this, arguments)
  }
  return _batchSetStorage.apply(wx, arguments)
}

const removeStorage = function (option) {
  const { key, success } = option
  if (!key) return
  const oldVal = storageCache.get(key)
  option.success = function () {
    storageCache.remove(key)
    updateMixinsAsync({ [key]: '' }, { [key]: oldVal })
    return (success || noop).apply(this, arguments)
  }
  return _removeStorage.call(wx, option)
}

const getStorageSync = function (key) {
  return storageCache.get(key)
}

const setStorageSync = function (key, value) {
  if (!key) return
  const oldVal = storageCache.get(key)
  storageCache.set(key, value)
  _setStorageSync.call(wx, key, value)
  updateMixinsAsync({ [key]: value }, { [key]: oldVal }, 'storage')
}

const batchSetStorageSync = function (kvList) {
  const kvs = {}
  const oldKvs = {}
  kvList.forEach(({ key, value }) => {
    kvs[key] = value
    storageCache.set(key, value)
    oldKvs[key] = getStorageSync(key)
  })
  updateMixinsAsync(kvs, oldKvs, 'storage')
  return _batchSetStorageSync.apply(wx, arguments)
}

const removeStorageSync = function (key) {
  if (!key) return
  const oldValue = storageCache.get(key)
  storageCache.remove(key)
  _removeStorageSync.call(wx, key)
  updateMixinsAsync({ [key]: '' }, { [key]: oldValue }, 'storage')
}

const clearStorage = function (option = {}) {
  const success = option.success
  const keys = _wx.getStorageInfoSync().keys
  option.success = function () {
    const kvs = {}
    const oldKvs = {}
    keys.forEach(key => {
      kvs[key] = ''
      storageCache.remove(key)
      oldKvs[key] = getStorageSync(key)
    })
    updateMixinsAsync(kvs, oldKvs, 'storage')
    return (success || noop).apply(wx, arguments)
  }
  return _clearStorage.call(wx, option)
}

const clearStorageSync = function () {
  const kvs = {}
  const oldKvs = {}
  _wx.getStorageInfoSync().keys.forEach(key => {
    kvs[key] = ''
    storageCache.remove(key)
    oldKvs[key] = getStorageSync(key)
  })
  updateMixinsAsync(kvs, oldKvs, 'storage')

  return _clearStorageSync.apply(wx, arguments)
}