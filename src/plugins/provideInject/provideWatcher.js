export default class ProvideWatcher {
  constructor(parent, context, key) {
    this.parent = parent
    this.context = context
    this.key = key
  }
  update() {
    const provide = this.parent.provide()
    const key = this.key
    const v = provide[key]
    if (typeof v === 'function') {
      this.context[key] = v.bind(this.parent)
    } else {
      if (this.context.data[key] !== v) {
        this.context.setData({ [key]: v })
      }
    }
  }
}