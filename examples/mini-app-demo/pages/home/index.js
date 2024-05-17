Page({
  data: { n: 1 },
  computed: {
    an(){
      return this.data.n + 1
    }
  },
  observers: {
    n(){
    }
  },
  onLoad(){
  }
})
