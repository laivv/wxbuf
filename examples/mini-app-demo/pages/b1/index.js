Page({
  handle() {
    this.finish({ text: '我是来自被打开页回传的数据', value: Math.floor(Math.random() * 10000) })
  }
})