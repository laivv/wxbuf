
import myBehavior from  './behavior/myBehaivor'

Page({
  mixinGlobalData: [
    'globalNumber', 
    'globalTotal->gtotal'
  ],
  mixinStorage: ['number->storageNumber'],
  behaviors:[myBehavior],
  data: {
    n: 1,
    showCompB: true
  },
  provide() {
    return {
      count: this.data.globalNumber
    }
  
  },
  handleAddNumber() {
    this.setData({ n: this.data.n + 1 })
  },
  onLoad(option){
    console.log('detail_onLoad:', option)
  },
  onReachTop() {
  },
  onStorageChange(newVal, oldVal) {
    // console.log('来自logs页的消息,storage数据改变了, 旧值:', oldVal)
    // console.log('来自logs页的消息,storage数据改变了, 新值:', newVal)
  },
  onGlobalDataChange(newVal, oldVal) {
    // console.log('来自logs页的消息,全局数据改变了, 旧值:', oldVal)
    // console.log('来自logs页的消息,全局数据改变了, 新值:', newVal)
  },
  changeGlobalData() {
      wx.setGlobalData('globalNumber', this.data.globalNumber + 1)
      console.log(getApp().globalData.globalNumber)
  
  },
  changeGlobaltotal() {
    wx.setGlobalData('globalTotal', this.data.gtotal + 1)
    console.log(this.data.gtotal)
  },
  changeStorage() {
    wx.setStorageSync('number', this.data.storageNumber + 1)
    console.log(this.data.storageNumber)
  },
  handleremoveStorage(){
    wx.removeStorageSync('number')
  },
  handleFinish() {
    this.finish('Page-111222')
  },
  showTips(text){
    wx.showToast({
      title: text,
      icon: 'none'
    })
  },
  handleSelect(){
    const comps = this.selectComponent()
    console.log('selectComponent:',comps)
  },
  handleToggleInstallComB() {
    this.setData({ showCompB: !this.data.showCompB })
  }
})
