
type IAnyObject = Record<string, any>

interface WxbufInstanceProperties {
  /**
   * [wxbuf]派发一个事件
   * @param eventName 
   * @param value 
   */
  fireEvent(eventName: string, value: any): void
  /**
   * [wxbuf]打开新页面
   * @param option 
   */
  openPage<T = any>(option: object): Promise<T>
  /**
 * [wxbuf]打开新页面替换当前页面栈
 * @param option 
 */
  replacePage(option: object): void
  /**
 * [wxbuf]关闭当前页面
 * @param option 
 */
  finish(value?: any): void
  /**
* [wxbuf]获取全局数据（store）
* @param option 
*/
  getStore(key: string): any
  /**
* [wxbuf]设置全局数据（store）
* @param option 
*/
  setStore(key: string, value: any): void
  /**
* [wxbuf]异步设置storage
* @param option 
*/
  setStorage(option: object): void
  /**
* [wxbuf]异步移除storage
* @param option 
*/
  removeStorage(option: object): void
  /**
* [wxbuf]同步获取storage
* @param option 
*/
  getStorageSync(key: string): any
  /**
* [wxbuf]同步设置storage
* @param option 
*/
  setStorageSync(key: string, value: any): void
  /**
* [wxbuf]同步移除storage
* @param option 
*/
  removeStorageSync(key: string): void
  /**
* [wxbuf]异步批量设置storage
* @param option 
*/
  batchSetStorage(option: object): void
  /**
* [wxbuf]同步批量设置storage
* @param option 
*/
  batchSetStorageSync(kvList: array): void
  /**
* [wxbuf]异步清空storage
* @param option 
*/
  clearStorage(): void
  /**
* [wxbuf]同步清空storage
* @param option 
*/
  clearStorageSync(): void
}

interface PageInstancePrefix {
  <TPrefix extends string = ''>(): {
    [K in keyof WxbufInstanceProperties as `${TPrefix}${Capitalize<string & K>}`]:
    WxbufInstanceProperties[K];
  };
}

declare namespace WechatMiniprogram.Page {
  interface InstanceProperties extends WxbufInstanceProperties {
    /**
     * [wxbuf]尝试调用opener页面的方法
     * @param fnName 
     * @param args 
     */
    invoke<T = any>(fnName: string, ...args: any[]): T
  }
  interface Constructor extends WechatMiniprogram.Page.Constructor {
    <TData extends DataOption, TCustom extends CustomOption>(
      options: Options<TData, TCustom> & {
        /**
         * [wxbuf]定义计算属性
         */
        computed: Record<string, () => any>
        /**
       * [wxbuf]声明字段变化监听器
       */
        observers: Record<string, (val: any, old: any) => any>
        /**
       * [wxbuf]声明全局事件监听器
       */
        listeners: Record<string, (event: IAnyObject) => any>
        /**
         * [wxbuf]非首次onShow时调用
         */
        onWakeup: () => any
        /**
         * [wxbuf]当页面是tabbar时，在第二次及以后切入页面时调用，可接收参数
         */
        onSwitchTab: (options: IAnyObject) => any
        /**
         * [wxbuf]使用响应式的全局数据（store）
         */
        mixinStore: string[]
        /**
         * [wxbuf]使用响应式的storage数据
         */
        mixinStorage: string[]
        /**
         * [wxbuf]监听全局数据（store）变化
         */
        onStoreChange: (kvs: IAnyObject, oldKvs: IAnyObject) => any
        /**
         * [wxbuf]监听storage变化
         */
        onStorageChange: (kvs: IAnyObject, oldKvs: IAnyObject) => any
        /**
         * [wxbuf]向后代组件提供数据
         */
        provide: IAnyObject | (() => IAnyObject)
      }
    ): void
  }
}

declare namespace WechatMiniprogram.Component {
  interface InstanceProperties extends WechatMiniprogram.Page.InstanceProperties {
    /**
     * [wxbuf]获取所在页面的实例
     */
    getPageInstance(): WechatMiniprogram.Page.Instance<IAnyObject, IAnyObject>
    /**
     * [wxbuf]获取所在页面的url参数(同page的onLoad钩子回调参数一致，只能在ready之后调用)
     */
    getUrlParams(): IAnyObject
    /**
     * [wxbuf]获取同胞组件实例列表
     */
    getCognates(): WechatMiniprogram.Component.Instance<IAnyObject, IAnyObject>[]
    /**
    * [wxbuf]父组件实例
    */
    $parent: WechatMiniprogram.Component.Instance<IAnyObject, IAnyObject> | WechatMiniprogram.Page.Instance<IAnyObject, IAnyObject>
    /**
    * [wxbuf]所在page实例
    */
    $page: WechatMiniprogram.Page.Instance<IAnyObject, IAnyObject>
    /**
    * [wxbuf]所在page url路径
    */
    $route: string
  }
}

declare namespace WechatMiniprogram.App {
  interface Option extends WxbufInstanceProperties { }
}
