Page({
  mixinStore: ['appCount'],
  mixinStorage: ['count'],
  handleUpdateStoreData() {
    this.setStore('appCount', this.getStore('appCount') + 1)
  },
  handleUpdateStorage() {
    this.setStorageSync('count', this.getStorageSync('count') + 1)
  },
  onStoreChange(kvs, oldKvs) {
    wx.showToast({
      title: 'store被修改啦',
      icon: 'none'
    })
  },
  onStorageChange(kvs, oldKvs) {
    wx.showToast({
      title: 'storage被修改啦',
      icon: 'none'
    })
  }
})