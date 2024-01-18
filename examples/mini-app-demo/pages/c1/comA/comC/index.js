Component({
  methods: {
    handle() {
      this.fireEvent('dataChange', '收到组件C发出的事件')
    }
  }
})