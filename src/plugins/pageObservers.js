import { definePlugin } from "../core/index"
import { getValueByKeypath, isFunction } from "../util"

export default definePlugin({
  options: {
    target: 'page',
  },
  lifetimes: {
    setData() {
      const observers = this.$target.$ctorOptions.observers
      this.observers = observers
      if (!observers) return
      this.oldData = {}
      for (let key in observers) {
        if (key !== '**') {
          this.oldData[key] = getValueByKeypath(this.data, key)
        }
      }
    },
    setData_end() {
      const observers = this.observers
      if (!observers || !this.oldData) return
      for (let key in observers) {
        const fn = observers[key]
        if (key === '**') {
          fn.call(this.$target, this.$target.data)
        } else {
          const newVal = getValueByKeypath(this.$target.data, key)
          const oldVal = this.oldData[key]
          if (isFunction(fn) && newVal !== oldVal) {
            fn.call(this.$traget, newVal, oldVal)
          }
        }
      }
      this.oldData = null
    }
  }
})
