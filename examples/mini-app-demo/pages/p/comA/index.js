Component({
  methods: {
    handle() {
      this.showPicker({
        title: '请选择',
        items: [{ text: '选项1', value: 1 }, { text: '选项2', value: 2 }]
      })
    }
  }
})