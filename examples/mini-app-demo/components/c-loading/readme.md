# c-loading
一个loading组件   

其实你并不需要单独用一个字段来控制一个loading组件的显示与隐藏

## 用法    
wxml:
```xml
<c-loading loadData="getData" text="加载中" />

```
js: 

```js
Page({
  async getData() {
    await fetch('/user/list')
  }
})
```
当页面滚动到底时，自动触发`loadData`回调并显示loading组件；当`loadData`回调执行完毕时，loading组件消失