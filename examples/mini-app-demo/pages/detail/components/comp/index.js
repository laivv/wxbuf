Component({
  mixinGlobalData:['globalNumber->gnum'],
  mixinStorage: ['number->storageNumber'],
  pageLifetimes: {
    reachBottom(e){
      console.log('reachBottom', e)
    },
    pageScroll(e){
      console.log('pageScroll', e)
    },
  },
  computed: {
    ss() {
      return this.data.gnum + '哈哈'
    }
  },
  lifetimes:{
    created(){
      console.log('component.lifetimes.created', this.data.storageNumber)
    },
    attached(){
      console.log(this.data.ss, '------comp-computed')
      console.log('component.lifetimes.attached', this.data.storageNumber)
    },
    ready(){
      console.log('component.lifetimes.ready', this.data.storageNumber)
    }
  },
  onStorageChange(nv, ov){
    console.log('component-onStorageChange:', nv, ov)
  },
  onGlobalDataChange(nv, ov){
    console.log('component-onGlobalDataChange:', nv, ov)
  },
  methods: {
    changeGlobalData(){
      this.setGlobalData('globalNumber', this.data.gnum + 1)
    },
    changeStorage() {
      this.setStorageSync('number', this.data.storageNumber + 1)
    },
    removeStorage(){
      this.removeStorageSync('number')
    },
    handleFinish(){
      this.finish('Component-111222')
    },
    handleFire(){
      this.fireEvent('bbbaaa', 123)
    }
  }
})