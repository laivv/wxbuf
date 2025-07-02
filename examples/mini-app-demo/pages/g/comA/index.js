Component({
  properties: {
    count: {
      type: Number,
      observer() {
      }
    },
  },
  data: {
    total: 1
  },
  computed: {
    totalText() {
      return `总数是：${this.data.count + this.data.total}`
    }
  },
  methods: {
    handle() {
      this.setData({ total: this.data.total + 1 })
    }
  }
})