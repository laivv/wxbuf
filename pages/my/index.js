Page({
  data: {
    a: 1
  },
  observers: {
    a(v, ov){
      console.log('v', v)
      console.log('ov', ov)
    }
  },
  onLoad(option) {
    console.log('my-onLoad', option)
  },
  onWakeup(option){
    console.log('my-onWakeup', option)
    console.log('this.getPageId()', this.getPageId())
  },
  handleChangeData() {
    this.setData({ a: this.data.a + 1 })
  }
})