const resolve = function (base, path) {
  const query = path.split('?')[1]
  path = path .split("?")[0]
  const baseList = path.startsWith('/') ? [] : base.split('/')
  const pathList = path.split('/')
  let dir = null
  baseList.pop()
  while (pathList.length) {
    dir = pathList.shift()
    if (dir === '..') {
      baseList.pop()
    }
    else if (dir === '' || dir === '.') {
      continue
    }
    else if (dir.indexOf('.') === -1) {
      baseList.push(dir)
    } else {
      throw new Error(`path'${path}' is invalid`)
    }
  }
  return baseList.join('/').replace(/^\/*/, '/') + (query ? `?${query}` : '')
}

export default { resolve }