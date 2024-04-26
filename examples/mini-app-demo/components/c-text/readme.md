
# c-text 
一个显示文本的组件，支持使用过滤器    

小程序中不支持类似于vue或ng这种`{{ value | filter }}`过滤器语法，而`wxs`的语法又很鸡肋，通过此组件可以间接达到相同效果 

## 基出用法    
wxml:
```xml
<c-text value="{{timeStamp}}" />
```
```js
  Page({
    data: {
      timeStamp: 1714123672808
    }
  })
```
以上是一个普通的显示，和以下写法没什么区别:
```xml
{{timeStamp}}
```
## 指定过滤器
wxml: 
```xml
<c-text value="{{timeStamp}}" filter="formatDate" />
```
```js
Page({
  data: {
    timeStamp: 1714123672808
  },
  formatDate(value) {
    return dayjs(value).format('YYYY-MM-DD')
  }
})
```
## 指定过滤器的参数 
`params`属性指定传递给过滤器的参数    

wxml: 
```xml
<c-text value="{{timeStamp}}" filter="formatDate" params="YYYY-MM-DD HH:mm:ss" />
```
```js
Page({
  data: {
    timeStamp: 1714123672808
  },
  formatDate(value, format) {
    return dayjs(value).format(format)
  }
})
```
`params`属性也可以是一个数组:  
wxml: 
```xml
<c-text value="{{timeStamp}}" filter="formatDate" params="{{ ['YYYY-MM-DD HH:mm:ss', '-'] }}" />
```
```js
Page({
  data: {
    timeStamp: '',
  },
  formatDate(value, format, defaultValue) {
    return value ? dayjs(value).format(format) : defaultValue
  }
})
```