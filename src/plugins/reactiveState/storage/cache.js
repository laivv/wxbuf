import _wx from './_wx'

export const storageCache = function () {
  const cache = {}
  return {
    get(key) {
      if (!cache.hasOwnProperty(key)) {
        cache[key] = _wx.getStorageSync.call(wx, key)
      }
      return cache[key] === undefined ? '' : cache[key]
    },
    set(key, value) {
      cache[key] = value
    },
    remove(key) {
      delete cache[key]
    }
  }
}()
