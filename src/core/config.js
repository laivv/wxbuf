
const conf = {}

export const getConfig = function (key) {
  return conf[key]
}

export const config = function (options = {}) {
  Object.assign(conf, options)
}