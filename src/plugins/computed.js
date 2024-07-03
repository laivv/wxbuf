import { definePlugin } from "../core/index"
import { isFunction, isEmpty } from "../util"

export default definePlugin({
  targetHooks: {
    page_onLoad: function () {
      this.update()
    },
    component_attached: function () {
      this.update()
    },
    page_setData_end() {
      this.update()
    },
    component_setData_end() {
      this.update()
    }
  },
  methods: {
    update() {
      const target = this.$target
      const computed = target.$ctorOptions.computed
      if (!computed) return
      const oldData = target.data
      const data = {}
      let value
      for (let key in computed) {
        const fn = computed[key]
        if (isFunction(fn)) {
          value = fn.call(target)
          if (oldData[key] !== value) {
            data[key] = value
          }
        }
      }
      if (!isEmpty(data)) {
        target.setData(data)
      }
    }
  }
})

