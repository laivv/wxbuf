Component({
  data: {
    total: 1
  },
  computed: {
    totalText() {
      return `总数是：${this.data.total}`
    }
  },
  methods: {
    handle() {
      this.setData({ total: this.data.total + 1 })
    }
  }
})