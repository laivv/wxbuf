Page({
  mixinStore: ['appCount'],
  handle() {
    const n = this.data.appCount
    for (let i = 0; i < 10000; i++) {
      this.setStore('appCount', i + n)
    }
  }
})