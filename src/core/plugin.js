import { getConfig } from "./config"
import { callWatcher } from "./watch"

let uid = 0
export default class Plugin {
  constructor(options) {
    /** 插件是否启用 */
    this.enable = true
    // 目标实例
    this.$target = null
    this._uid = ++uid
    this.init(options)
  }
  init({ data, lifetimes, targetHooks, methods }) {
    this.data = data
    this.lifetimes = lifetimes
    this.targetHooks = targetHooks
    for (let key in methods) {
      this[key] = methods[key]
    }
    if (lifetimes.created) {
      lifetimes.created.call(this)
    }
  }
  getConfig(key) {
    return getConfig(key)
  }
  callWatcher(name, ...args) {
    callWatcher(this.$target, name, ...args)
  }
}