import { getUserConfig } from "./userConfig"

class Plugin {

  constructor(options) {
    // 目标实例
    this.$target = null
    this.init(options)
  }

  init({ options, data, lifetimes, methods }) {
    this.target = options.target
    this.data = data
    this.lifetimes = lifetimes
    for (let key in methods) {
      this[key] = methods[key]
    }
  }

  getConfig(key) {
    return getUserConfig(key)
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