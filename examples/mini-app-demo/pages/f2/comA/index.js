Component({
  data: {
    count: 100,
  },
  provide() {
    return {
      count: this.data.count
    }
  },
  methods: {
    handle() {
      this.setData({ count: this.data.count + 1 })
    }
  }
})