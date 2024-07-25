const conf = {
  methodPrefix: '',
  parseUrlArgs: false,
  enableGlobalShareAppMessage: false,
  enableGlobalShareTimeline: false,
  storeKey: 'globalData'
}

export const getConfig = function (key) {
  return key ? conf[key] : Object.assign({}, conf)
}

export const config = function (options = {}) {
  Object.assign(conf, options)
}