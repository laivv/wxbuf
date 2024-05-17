import { callPlugins } from "./plugin"
import { definePlugin } from "./definePlugin"

function createSetDataPlugin(target, lifetime) {
  return definePlugin({
    options: {
      target,
    },
    lifetimes: {
      [lifetime]: function () {
        const context = this.$target
        const setData = context.setData
        let pending = false
        context.setData = function (...args) {
          if (pending) {
            return setData.apply(context, arguments)
          }
          pending = true
          callPlugins(context, target, 'setData', args)
          setData.apply(context, arguments)
          callPlugins(context, target, 'setData_end', args, context.data)
          pending = false
        }
      }
    }
  })
}

export const setDataPage = createSetDataPlugin('page', 'onLoad')
export const setDataComponent = createSetDataPlugin('component', 'created')
export const setDataBehavior = createSetDataPlugin('behavior', 'created')




