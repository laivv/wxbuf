Page({
  data: {
    obj: {
      name: '',
      phone: ''
    }
  },
  handle() {
    this.setData({ obj: { name: 'wxbuf', phone: 13000000000 } })
  }
})