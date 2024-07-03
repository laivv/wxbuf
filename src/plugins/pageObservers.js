import { definePlugin } from "../core/index"
import { getValueByKeypath, isFunction } from "../util"

export default definePlugin({
  targetHooks: {
    page_setData() {
      const target = this.$target
      const observers = target.$ctorOptions.observers
      if (!observers) return
      target._observersOldData = {}
      for (let key in observers) {
        if (key !== '**') {
          target._observersOldData[key] = getValueByKeypath(target.data, key)
        }
      }
    },
    page_setData_end() {
      const target = this.$target
      const observers = target.$ctorOptions.observers
      if (!observers || !target._observersOldData) return
      for (let key in observers) {
        const fn = observers[key]
        if (key === '**') {
          fn.call(target, target.data)
        } else {
          const newVal = getValueByKeypath(target.data, key)
          const oldVal = target._observersOldData[key]
          if (isFunction(fn) && newVal !== oldVal) {
            fn.call(target, newVal, oldVal)
          }
        }
      }
      delete target._observersOldData
    }
  }
})
