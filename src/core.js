const _Page = Page;
const _App = App;
const _Component = Component;
const _Behavior = Behavior;

class WxbufPlugin {
  constructor({ lifetime }) {
    this.lifetime = lifetime;
  }
  onBefore({ context, params, options }) {}
  onAfter({ context, params, options, res }) {}
}

const noop = function () {};

const installedPlugins = {
  app: {
    construct: [],
  },
  page: {
    construct: [],
  },
  component: {
    construct: [],
  },
  behavior: {
    construct: [],
  },
};

const overwrite = function (target, name, options) {
  const fn = options[name] || noop;
  options[name] = function () {
    const plugins = installedPlugins[target][name] || [];
    let args = [].slice.call(arguments, 1);
    args = args.length > 1 ? args : args.length === 1 ? args[0] : undefined;
    plugins.forEach((plugin) => plugin.onBefore({ context: this, params: args, options: options }));
    const res = fn.apply(this, arguments);
    plugins.forEach((plugin) => plugin.onAfter({ context: this, params: args, options: options, res }));
    return res;
  };
};

const initConstructor = function (target, options) {
  const plugins = installedPlugins[target]["construct"];
  plugins.forEach((plugin) => plugin.onBefore(options));
};

const fixOptions = function (options) {
  if (!options) options = {};
  if (!options.lifetimes) options.lifetimes = {};
  if (!options.methods) options.methods = {};
  if (!options.pageLifetimes) options.pageLifetimes = {};
  [("created", "attached", "ready", "moved", "detached", "error")].forEach(
    (name) => {
      if (options[name] && !options.lifetimes[name]) {
        options.lifetimes[name] = options[name];
      }
    }
  );
};

App = function (options) {
  initConstructor("app", options);
  overwrite("app", "onLaunch", options);
  overwrite("app", "onShow", options);
  overwrite("app", "onHide", options);
  overwrite("app", "onError", options);
  overwrite("app", "onPageNotFound", options);
  overwrite("app", "onUnhandledRejection", options);
  overwrite("app", "onThemeChange", options);
  return _App(options);
};

Page = function (options) {
  initConstructor("page", options);
  overwrite("page", "onLoad", options);
  overwrite("page", "onShow", options);
  overwrite("page", "onReady", options);
  overwrite("page", "onHide", options);
  overwrite("page", "onUnload", options);
  overwrite("page", "onRouteDone", options);
  overwrite("page", "onPullDownRefresh", options);
  overwrite("page", "onReachBottom", options);
  overwrite("page", "onShareAppMessage", options);
  overwrite("page", "onShareTimeline", options);
  overwrite("page", "onAddToFavorites", options);
  overwrite("page", "onPageScroll", options);
  overwrite("page", "onResize", options);
  overwrite("page", "onTabItemTap", options);
  overwrite("page", "onSaveExitState", options);
  return _Page(options);
};

Component = function (options) {
  fixOptions(options);
  initConstructor("component", options);
  overwrite("component", "created", options);
  overwrite("component", "attached", options);
  overwrite("component", "ready", options);
  overwrite("component", "moved", options);
  overwrite("component", "detached", options);
  overwrite("component", "created", options.lifetimes);
  overwrite("component", "attached", options.lifetimes);
  overwrite("component", "ready", options.lifetimes);
  overwrite("component", "moved", options.lifetimes);
  overwrite("component", "detached", options.lifetimes);
  overwrite("component", "show", options.pageLifetimes);
  overwrite("component", "hide", options.pageLifetimes);
  overwrite("component", "resize", options.pageLifetimes);
  overwrite("component", "routeDone", options.pageLifetimes);
  return _Component(options);
};

Behavior = function (options) {
  fixOptions(options);
  initConstructor("behavior", options);
  overwrite("behavior", "created", options);
  overwrite("behavior", "attached", options);
  overwrite("behavior", "ready", options);
  overwrite("behavior", "moved", options);
  overwrite("behavior", "detached", options);
  overwrite("behavior", "created", options.lifetimes);
  overwrite("behavior", "attached", options.lifetimes);
  overwrite("behavior", "ready", options.lifetimes);
  overwrite("behavior", "moved", options.lifetimes);
  overwrite("behavior", "detached", options.lifetimes);
  overwrite("behavior", "show", options.pageLifetimes);
  overwrite("behavior", "hide", options.pageLifetimes);
  overwrite("behavior", "resize", options.pageLifetimes);
  overwrite("behavior", "routeDone", options.pageLifetimes);
  return _Behavior(options);
};

const installPlugin = function (target, plugin) {
  const { lifetime } = plugin;
  lifetime = lifetime === "new" ? "construct" : lifetime;
  const plugins = installedPlugins[target][lifetime] || [];
  if (!installedPlugins[target][lifetime]) {
    installedPlugins[target][lifetime] = plugins;
  }
  plugins.push(plugin);
};

App.use = function (plugin) {
  installPlugin("app", plugin);
};

Page.use = function (plugin) {
  installPlugin("page", plugin);
};

Component.use = function (plugin) {
  installPlugin("component", plugin);
};

Behavior.use = function (plugin) {
  installPlugin("behavior", plugin);
};

class SetDataPlugin extends Plugin {
  constructor({ lifetime, target }) {
    super({ lifetime });
    this.target = target;
  }
  onBefore({ context }) {
    overwrite(this.target, "setData", context);
  }
}

Page.use(new SetDataPlugin({ target: "page", lifetime: "onLoad" }));
Component.use(new SetDataPlugin({ target: "component", lifetime: "created" }));
Behavior.use(new SetDataPlugin({ target: "behavior", lifetime: "created" }));

export const app = App;
export const page = Page;
export const component = Component;
export const behavior = Behavior;
export const Plugin = WxbufPlugin;
