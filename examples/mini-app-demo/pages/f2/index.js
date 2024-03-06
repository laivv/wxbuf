const text = '这是page'
Page({
  data: {
    text,
    count: 1,
    number: 10,
    total: 123
  },
  // 要传递给后代的数据
  provide(){
    return {
      text,
      count: this.data.count,
      number: this.data.number,
      total: this.data.total,
      updatePageData() {
        this.setData({ number: this.data.number + 1 })
      }
    }
  },
  handleA() {
    this.setData({ count: this.data.count + 1 })
  },
  handleB() {
    this.setData({ total: this.data.total + 1 })
  }
})