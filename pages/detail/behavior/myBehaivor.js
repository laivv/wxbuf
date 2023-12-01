 export default Behavior({
  mixinGlobalData:['globalNumber->behaviorA'],
  mixinStorage: ['number->behaviorB'],
  onStorageChange(){
    console.log('behavior-onStorageChange:', this.getStorageSync('number'))
  },
  onGlobalDataChange(){
    console.log('behavior-onGlobalDataChange:', this.getGlobalData('globalNumber'))
  },
  created: function(){
    console.log('Behavior.created:', this.data.behaviorB)
  },
  methods: {
    
  }
})