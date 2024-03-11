Page({
  handleA() {
    this.setStore('appCount', this.data.$store.appCount + 1)
  },
  handleB() {
    this.setStorageSync('count', this.data.$storage.count + 1)
  },
})