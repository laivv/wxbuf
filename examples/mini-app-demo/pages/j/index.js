Page({
  mixinGlobalData: ['appCount'],
  mixinStorage: ['count'],
  handleUpdateGlobalData() {
    this.setGlobalData('appCount', this.getGlobalData('appCount') + 1)
  },
  handleUpdateStorage() {
    this.setStorageSync('count', this.getStorageSync('count') + 1)
  },
  onGlobalDataChange(kvs, oldKvs) {
    wx.showToast({
      title: 'globalData被修改啦',
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