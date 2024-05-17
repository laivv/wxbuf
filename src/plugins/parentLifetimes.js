import { definePlugin } from "../core/index"

function createParentLifetimes(target) {
  return definePlugin({
    options: {
      target
    },
    lifetimes: {
      setData_end() {
        const components = this.$target.$components || []
        components.forEach(c => {
          const ctor = c.$ctorOptions || {}
          const lifetimes = ctor.parentLifetimes || {}
          if (lifetimes.setData) {
            lifetimes.setData.call(c, c.data)
          }
        })
      }
    }
  })
}

export const parentLifetimesPage = createParentLifetimes('page')
export const parentLifetimesComponent = createParentLifetimes('component')
