const watchers = {}

export function watch(options = {}) {
  for (let key in options) {
    if (typeof options[key] === 'function') {
      let list = watchers[key]
      if (!list) {
        watchers[key] = list = []
      }
      list.push(options[key])
    }
  }
}

export function callWatcher(context, name) {
  const fns = watchers[name] || []
  fns.forEach(fn => {
    fn.apply(context, arguments)
  })
}