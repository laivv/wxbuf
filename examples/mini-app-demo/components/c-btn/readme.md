# c-button
一个能防重复点击的button 



## 用法    
wxml:
```xml
<c-btn onClick="handleTap" loading-text="提交中...，点击已禁用">提交表单</c-btn>

```
js: 

```js
Page({
  async handleTap() {
    await fetch('/form/add')
  }
})
```
可以看到，绑定点击事件使用的是`onClick`而非原生的`bindtap`，当执行`handleTap`事件处理函数时，按钮自动`disabled`，执行完毕时自动解除`disabled`