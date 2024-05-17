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
        const context = this.$target
        const computed = context.$ctorOptions.computed
        if (!computed) return
        const oldData = context.data
        const data = {}
        let value
        for (let key in computed) {
          const fn = computed[key]
          if (isFunction(fn)) {
            value = fn.call(context)
            if (oldData[key] !== value) {
              data[key] = value
            }
          }
        }
        if (!isEmpty(data)) {
          context.setData(data)
        }
      }
    }
  })
}

export const computedPage = createComputed('page', 'onLoad')
export const computedComponent = createComputed('component', 'created')
