export default class ProvideObserver {
  constructor() {
    this.watchers = []
  }
  add(watcher) {
    this.watchers.push(watcher)
  }
  remove(context) {
    this.watchers = this.watchers.filter(w => w.context !== context)
  }
  notify() {
    this.watchers.forEach(w => w.update())
  }
}