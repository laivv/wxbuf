## 1.1.0-release(2025-7-2)


### 新增特性:

* 新增异步onLaunch支持，在app.js中的onLaunch钩子中返回promise可以推迟整个app生命周期调用以及页面和组件的加载
* app中新增onPageInit钩子，在此钩子中可以返回promise来推迟页面及组件的加载
* page中新增onInit钩子，先于onLoad执行，在此钩子中可以返回promise来推迟页面及组件的加载

### 特性更新:
* 组件的parentLifetimes.setData钩子改为父组件发生setData并且视图渲染完毕后才调用

### 修复:

* 组件computed计算属性依赖自身的properties字段数据时，计算不响应的问题

---     

## 1.0.0-release（2024）     
1.0.0版本发布
