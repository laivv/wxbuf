Page({
  data: { list: [] },
  onLoad(options) {
    const list = []
    for (let key in options) {
      list.push({
        key,
        type: Object.prototype.toString.call(options[key])
      })
    }
    this.setData({ list })
  }
})