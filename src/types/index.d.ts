

type PluginOptions = {
  options: {
    target: 'app' | 'page' | 'component' | 'behavior'
  },
  data?: Record<string, unknown>
  lifetimes: Record<string, () => any>,
  methods?: Record<string, () => any>
}

interface WxbufPlugin {
  new(options: PluginOptions)
  $target: null
  getConfig(key: string): any
  callWatcher(name: string, ...args: any[])
}

declare module 'wxbuf' {
  function definePlugin(options: PluginOptions): WxbufPlugin
  function usePlugin(plugin: WxbufPlugin): void 
  const page: { extend: (options: Record<string, any>) => void }
}




