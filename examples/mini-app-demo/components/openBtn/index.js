Component({
  properties:{
    openType:String
  },
  data:{
    event: null,
  },
  methods: {
    onTap(e){
      this.data.event = { ...e }
      console.log('this.getContextData()', this.getContextData())
      
    },
    onOpenTypeCallback(e){
      wx.showModal({
        title: '获取手机号成功',
        success:() => {
          this.triggerEvent('ok', this.data.event)
        }
      })
    }
  }
})