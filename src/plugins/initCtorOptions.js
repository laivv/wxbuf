import { definePlugin } from "../core/index"
import { extend, noop } from "../util"

const proxy = function (options, key) {
  const fn = options[key] || noop
  const option = key === 'created' ? options.lifetimes : options
  option[key] = function () {
    this.$ctorOptions = options
    return fn.apply(this, arguments)
  }
}

const createCtorOptions = function (target, key) {
  return definePlugin({
    options: {
      target,
    },
    lifetimes: {
      init_end(options) {
        proxy(options, key)
      }
    }
  })
}

export const appCtorOptions = createCtorOptions('app', 'onLaunch')
export const pageCtorOptions = createCtorOptions('page', 'onLoad')
export const componentCtorOptions = createCtorOptions('component', 'created')

