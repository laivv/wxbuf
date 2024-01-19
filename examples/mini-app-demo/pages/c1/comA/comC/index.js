Component({
  listeners: {
    dataChange(e) {
      this.setData({ eventData: e.value })
    }
  },
  methods: {
    handle() {
      this.fireEvent('dataChange', '收到组件C发出的事件')
    }
  }
})