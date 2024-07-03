import { definePlugin } from '../../../core/index'
import { getStore, setStore } from './helper'
import { initStore, initAppStore } from './init'

export default definePlugin({
  targetHooks: {
    app_init(options) {
      this.mountMethods(wx)
      this.mountMethods(options)
      // this.reactive(
      //   options,
      //   this.getConfig('storeKey'),
      //   updateMixinsAsync
      // )
    },
    page_init(options) {
      this.mountMethods(options)
    },
    component_init(options) {
      this.mountMethods(options.methods)
    },
    page_onLoad() {
      initStore(this.$target.$ctorOptions, this.$target)
      initAppStore(this.$target)
    },
    component_attached() {
      initStore(this.$target.$ctorOptions, this.$target)
      initAppStore(this.$target)
    }
  },
  methods: {
    mountMethods(options) {
      const prefix = this.getConfig('methodPrefix')
      options[`${prefix}getStore`] = getStore
      options[`${prefix}setStore`] = setStore
    },
    // reactive(options, storeKey, fn) {
    //   options[storeKey] = new Proxy(options[storeKey], {
    //     get(target, key) {
    //       return target[key]
    //     },
    //     set(target, key, value) {
    //       const oldValue = target[key]
    //       if (oldValue !== value) {
    //         fn && fn({ [key]: value }, { [key]: oldValue }, 'store')
    //       }
    //       target[key] = value
    //       return true
    //     }
    //   })
    // }
  }
})