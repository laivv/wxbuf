# c-input 双向绑定输入框
像用vue的双向绑定一样方便，支持字段路径 

## 用法    
wxml:
```xml
<c-input v-model="form.name" placeholder="请输入姓名" />

<c-input v-model="form.phone" placeholder="请输入手机号" />
```
js: 

```js
Page({
  data: {
    form: {
      name: '',
      phone: ''
    }
  }
})
```