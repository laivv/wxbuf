Page({
  onLoad({ id, name, author, jsonData  }) {
    this.setData({ 
      id, 
      name, 
      author, 
      jsonData: JSON.stringify(jsonData)
    })
  },
})