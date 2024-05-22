import { getConfig } from "./config"
import { callWatcher } from "./watch"

let uid = 0
class Plugin {
  constructor(options) {
    // 目标实例
    this.$target = null
    this._uid = ++uid
    this.init(options)
  }
  init({ data, lifetimes, methods }) {
    this.data = data
    this.lifetimes = lifetimes
    for (let key in methods) {
      this[key] = methods[key]
    }
  }
  getConfig(key) {
    return getConfig(key)
  }
  callWatcher(name, ...args) {
    callWatcher(this.$target, name, ...args)
  }
}


function patch(options) {
  if (!options) options = {}
  if (!options.options) options.options = {}
  if (!options.options.target) options.options.target = 'behavior'
  if (!options.data) options.data = {}
  if (!options.lifetimes) options.lifetimes = {}
  if (!options.methods) options.methods = {}
  return options
}

export function definePlugin(options) {
  return new Plugin(patch(options))
}