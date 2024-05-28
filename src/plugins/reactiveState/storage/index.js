import { definePlugin } from '../../../core/index'
import {
  setStorage,
  setStorageSync,
  batchSetStorage,
  batchSetStorageSync,
  clearStorageSync,
  clearStorage,
  removeStorage,
  removeStorageSync,
} from './helper'
import { initAppStorage, initStorage } from './init'

export default definePlugin({
  lifetimes: {
    app_init(options) {
      this.mountMethods(wx)
      this.mountMethods(options)
    },
    page_init(options) {
      this.mountMethods(options)
    },
    component_init(options) {
      this.mountMethods(options.methods)
    },
    page_onLoad() {
      initStorage(this.$target.$ctorOptions, this.$target)
      initAppStorage(this.$target)
    },
    component_attached() {
      initStorage(this.$target.$ctorOptions, this.$target)
      initAppStorage(this.$target)
    }
  },
  methods: {
    mountMethods(options) {
      const prefix = this.getConfig('methodPrefix')
      options[`${prefix}setStorage`] = setStorage
      options[`${prefix}setStorageSync`] = setStorageSync
      options[`${prefix}batchSetStorage`] = batchSetStorage
      options[`${prefix}batchSetStorageSync`] = batchSetStorageSync
      options[`${prefix}clearStorageSync`] = clearStorageSync
      options[`${prefix}clearStorage`] = clearStorage
      options[`${prefix}removeStorage`] = removeStorage
      options[`${prefix}removeStorageSync`] = removeStorageSync
    },
  }
})