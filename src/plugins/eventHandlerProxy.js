import { definePlugin } from "../core/index"
import { isFunction, isEvent, upperCase, extend, getPageInstance, hasOwn, defProperty } from "../util"
import { PAGE_LIFETIMES } from "../core/constants"
import { callUserHook } from "../hookConfig"

function createEventHandlerProxy(target) {
  return definePlugin({
    options: {
      target,
    },
    lifetimes: {
      init(options) {
        const app = getApp()
        for (let key in options) {
          if (
            (target === 'page' && PAGE_LIFETIMES.includes(key)) ||
            !hasOwn(options, key) ||
            !isFunction(options[key])
          ) {
            continue
          }
          const fn = options[key]
          options[key] = function (e) {
            if (isEvent(e) && !e._ignore) {
              callUserHook(
                this,
                'on' + upperCase(e.type, 0),
                extend(e, { path: getPageInstance(this).route })
              )
            }
            if (
              app.onEventDispatch &&
              isEvent(e) &&
              !e._ignore
            ) {
              let prevent = true
              let args = [e]
              const next = function () {
                prevent = false
                args = [].slice.call(arguments, 0)
              }
              app.onEventDispatch(e, next)
              defProperty(e, '_ignore', true)
              if (!prevent) {
                return fn.apply(this, args)
              }
            } else {
              if (isEvent(e)) {
                defProperty(e, '_ignore', true)
              }
              return fn.apply(this, arguments)
            }
          }
        }
      }
    }
  })
}

export const pageEventHandlerProxy = createEventHandlerProxy('page')
export const componentEventHandlerProxy = createEventHandlerProxy('component')
export const behaviorEventHandlerProxy = createEventHandlerProxy('behavior')

