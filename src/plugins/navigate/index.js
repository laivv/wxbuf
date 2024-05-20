const openPage = function (option) {
  if (isRouteAllow(option)) {
    createOpener(option, this)
    const promise = createFeature(option)
    createBody(option)
    startPage(option)
    return promise
  }
  return Promise.reject()
}
