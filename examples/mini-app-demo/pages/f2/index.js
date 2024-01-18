Page({
  data: {
    count: 1
  },
  // 要传递给后代的数据
  provide(){
    return {
      pageText: '这是page的静态数据',
      pageCount: this.data.count,
      pageDataUpdate() {
        this.setData({ count: this.data.count + 1 })
      }
    }
  },
  handle() {
    this.setData({ count: this.data.count + 1 })
  }
})