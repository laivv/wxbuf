import { definePlugin } from "../core/index"
import { isFunction, isEmpty } from "../util"

function createComputed(target, lifetime) {
  return definePlugin({
    options: {
      target
    },
    lifetimes: {
      [lifetime]: function () {
        this.update()
      },
      setData_end() {
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
}

export const computedPage = createComputed('page', 'onLoad')
export const computedComponent = createComputed('component', 'attached')
