class Observer {
  constructor() {
    this.watchers = []
  }
  add(watcher) {
    this.watchers.push(watcher)
  }
  remove(watcher) {
    const index = this.watchers.findIndex(w => w === watcher)
    if (index > - 1) {
      this.watchers.splice(index, 1)
      return true
    }
    return false
  }
  notify(action) {
    for (let i = 0, len = this.watchers.length; i < len; i++) {
      this.watchers[i].update()
    }
  }
}