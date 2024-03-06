import { isFunction } from "./util"

let appOption = {}

export const saveAppConfig = function (option) {
  appOption = option
}

export const getAppConfig = function (key) {
  return appOption[key]
}

export const callAppHook = function (hook) {
  if (isFunction(appOption[hook])) {
    return appOption[hook].apply(getApp(), [].slice.call(arguments, 1))
  }
}