interface WxbufPlugin {

}

type PluginOptions = {
  options: {
    target: 'app' | 'page' | 'component' | 'behavior'
  },
  data?: Record<string, unknown>
  lifetimes: Record<string, () => any>,
  methods?: Record<string, () => any>
}

declare function definePlugin(options: PluginOptions): WxbufPlugin