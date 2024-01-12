
Page({
  mixinGlobalData: ['globalNumber', 'appVersion'],
  mixinStorage: ['number', 'token'],
  listeners: {
    bbbaaa(event) {
      console.log('fireEvent:', event)
    }
  },

  observers: {
    ccc(val, oldV) {
      console.log('index.js--observers, newVal:' + val + ';oldVal:' + oldV)
    },
    number() {
      console.log('index.js--obersers: number')
    },
    globalNumber() {
      console.log('index.js--obersers: globalNumber')
    }
  },
  computed: {
    fff() {
      console.log('index.js--computed: fff')
      return this.data.globalNumber + 'years'
    },
  },
  data: {
    ccc: 1
  },
  handleChangeData() {
    this.setData({ ccc: this.data.ccc + 1 })
  },
  onShow(option) {
    console.log('wxbuf:', wxbuf)
    console.log('index-page-show:', option)
  },
  onLoad: function () {
    wx2.hello()
    this.say()
    console.log('appversion:', this.data.appVersion)
    // wx.setNavigateBarTitle({ title: '了了了' })
    // console.log('wxbuf.getNavigateBarTitle():', wxbuf.getNavigateBarTitle())
  },
  onGlobalDataChange(newVal, oldVal) {
    console.log('来自index页的消息,全局数据改变了, 旧值:', oldVal)
    console.log('来自index页的消息,全局数据改变了, 新值:', newVal)
  },
  onReachTop() {
    console.log('到顶了')
  },
  onStorageChange(newVal, oldVal) {
    console.log('来自index页的消息,storage数据改变了, 旧值:', oldVal)
    console.log('来自index页的消息,storage数据改变了, 新值:', newVal)
  },
  async handleJump() {
    const receivedValue = await wx.openPage({
      name: "日志",
      // url: '/pages/detail/index',
      params: {
        a: '1111111111111111111111111111111111',
        b: { ccc: 1, ddd: 2 },
        c: [1, 2, 3, 4, 5],
        d: null,
        e: undefined,
        f: '',
        g: '1'
      },
      body: {
        ffff: { name: '这是body数据' }
      },
      success(page) {
        console.log('打开新页面成功：', page)
        // var n = 0
        // setInterval(() => {
        //   page.showTips(`${n++}`)
        // }, 1000)
      }

    })
    if (receivedValue) {
      wx.showModal({
        title: '接收的值',
        content: receivedValue
      })
    }
  },
  handleRemoveStorage() {
    wx.removeStorageSync('number')
  },
  handleFire() {
    this.fireEvent('bbbaaa', 123)
  },
  // onShareAppMessage(){

  // },
  async longtap() {
    const selected = await this.showPicker({
      title: '请选择',
      items: [{ text: '1栋', value: 1 }, { text: '2栋', value: 2 }],
      async onOk(value) {
        wx.showLoading()
        return new Promise(resolve => setTimeout(() => {
          console.log('onOk-selected:', value)
          wx.hideLoading()
          resolve()
        }, 3000))
      }
    })
    console.log('promise-selected:', selected)

  },
  handleToggleInstall() {
    this.setData({ installed: !this.data.installed })
  },
  handler(e, data) {
    console.log('dataset:', data)
  },
  handleSwitchTab() {
    wx.switchTab({
      url: '/pages/my/index?tab=' + parseInt(Math.random() * 100),
    })
  }


})
