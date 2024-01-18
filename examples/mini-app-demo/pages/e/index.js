
Page({
  mixinStorage: ['count'],
  onLoad() {
    if(!this.data.count) {
      this.setStorageSync('count', 1)
    }
  },
  handle() {
    this.openPage({
      url: '/pages/e1/index'
    })
  }
})
