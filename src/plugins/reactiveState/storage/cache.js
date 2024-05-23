import _wx from './_wx'

export const storageCache = function () {
  const _storage = {}
  return {
    get(key) {
      if (!_storage.hasOwnProperty(key)) {
        _storage[key] = _wx.getStorageSync.call(wx, key)
      }
      return _storage[key] === undefined ? '' : _storage[key]
    },
    set(key, value) {
      _storage[key] = value
    },
    remove(key) {
      delete _storage[key]
    }
  }
}()
