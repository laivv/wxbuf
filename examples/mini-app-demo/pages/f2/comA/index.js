Component({
  data: {
    number: 100,
  },
  provide() {
    return {
      comNumber: this.data.number
    }
  },
  methods: {
    handle() {
      this.setData({ number: this.data.number + 1 })
    }
  }
})