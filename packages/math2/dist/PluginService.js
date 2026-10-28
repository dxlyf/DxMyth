class PluginService {
  constructor(context, config) {
    this.config = config;
    this.context = context;
    if (this.config) {
      this.initPresetsAndPlugins(this.config);
    }
  }
  hooks = /* @__PURE__ */ new Map();
  methods = /* @__PURE__ */ new Map();
  plugins = /* @__PURE__ */ new Map();
  extraPresets = [];
  extraPlugins = [];
  context;
  initPresetsAndPlugins(config) {
    this.extraPlugins = [];
    this.extraPresets = [];
    this.resolvePresets(config.presets ?? []);
    this.resolvePlugins(config.plugins ?? []);
  }
  resolvePresets(presets) {
    if (Array.isArray(presets)) {
      presets.forEach((preset) => {
        this.initPreset(preset);
      });
    }
    const extraPresets = this.extraPresets;
    while (extraPresets.length) {
      this.initPreset(extraPresets.shift());
    }
  }
  resolvePlugins(plugins) {
    if (Array.isArray(plugins)) {
      plugins.forEach((plugin) => {
        this.initPlugin(plugin);
      });
    }
    const extraPlugins = this.extraPlugins;
    while (extraPlugins.length) {
      this.initPlugin(extraPlugins.shift());
    }
  }
  getApplyMethods(name) {
    const methods = this.methods.get(name) ?? [];
    return (...args) => {
      if (methods.length === 1) {
        return methods[0](...args);
      }
      return methods.reduceRight((a, b) => {
        return (...args2) => {
          return b(a(...args2));
        };
      })(...args);
    };
  }
  applyMethods(name, ...args) {
    const methods = this.methods.get(name) ?? [];
    if (methods.length === 1) {
      return methods[0](...args);
    }
    return methods.reduceRight((a, b) => {
      return (...args2) => {
        return b(a(...args2));
      };
    })(...args);
  }
  getPluginContext(plugin) {
    const pluginContext = {
      pluginName: plugin.name,
      ctx: this.context,
      registerMethod: this.registerMethod.bind(this),
      register: this.register.bind(this)
    };
    return new Proxy(pluginContext, {
      get: (target, key, receiver) => {
        if (this.methods.has(key)) {
          return this.getApplyMethods(key);
        }
        return Reflect.get(target, key, receiver);
      }
    });
  }
  initPreset(preset) {
    this.registerPlugin(preset);
    const ctx = this.getPluginContext(preset);
    const { plugins, presets } = preset.apply(ctx, preset.config);
    if (presets) {
      this.extraPresets.push(...presets);
    }
    if (plugins) {
      this.extraPlugins.push(...plugins);
    }
  }
  initPlugin(plugin) {
    this.registerPlugin(plugin);
    const ctx = this.getPluginContext(plugin);
    plugin.apply(ctx, plugin.config);
  }
  registerPlugin(plugin) {
    if (this.plugins.has(plugin.name)) {
      throw `${plugin.name}:已存在`;
    }
    this.plugins.set(plugin.name, plugin);
  }
  register(hook) {
    const hooks = this.hooks.get(hook.name) ?? [];
    hooks.push(hook);
    this.hooks.set(hook.name, hooks);
  }
  registerMethod(name, fn) {
    const methods = this.methods.get(name) ?? [];
    methods.push(fn || ((fn2) => {
      this.register({ name, fn: fn2 });
    }));
    this.methods.set(name, methods);
  }
  async applyPlugins(inOpts) {
    const opts = typeof inOpts === "string" ? { name: inOpts, type: void 0 } : inOpts;
    let { name, type } = opts;
    if (!type) {
      if (name.startsWith("modify")) {
        type = "modify";
      }
      if (name.startsWith("add")) {
        type = "add";
      }
      if (name.startsWith("on")) {
        type = "event";
      }
      if (name.startsWith("create")) {
        type = "create";
      }
    }
    const hooks = (this.hooks.get(name) ?? []).slice();
    hooks.sort((a, b) => {
      let _a = a.order ?? 0, _b = b.order ?? 0;
      return _a - _b;
    });
    switch (type) {
      case "create": {
        let initialValue = opts.initalValue;
        for (let hook of hooks) {
          let ret = await Promise.resolve().then(() => hook.fn(opts.args));
          if (ret !== void 0 && ret !== null) {
            return ret;
          }
        }
        return initialValue;
      }
      case "add": {
        let initialValue = opts.initalValue ?? [];
        for (let hook of hooks) {
          let ret = await Promise.resolve().then(() => hook.fn(opts.args));
          if (ret !== void 0 && ret !== null) {
            initialValue.push(ret);
          }
        }
        return initialValue;
      }
      case "modify": {
        let initialValue = opts.initalValue ?? {};
        for (let hook of hooks) {
          let ret = await Promise.resolve().then(() => hook.fn(initialValue, opts.args));
          if (ret !== void 0 && ret !== null) {
            initialValue = ret;
          }
        }
        return initialValue;
      }
      case "event": {
        if (opts.sync) {
          for (let hook of hooks) {
            hook.fn(opts.args);
          }
        } else {
          let p = Promise.resolve();
          for (let hook of hooks) {
            p = p.then(() => {
              hook.fn(opts.args);
            });
          }
        }
        break;
      }
    }
  }
  uninstallPlugin(plugin) {
    if (this.plugins.has(plugin.name)) {
      const ctx = this.getPluginContext(plugin);
      plugin.dispose?.(ctx);
      this.plugins.delete(plugin.name);
    }
  }
  dispose() {
    this.plugins.forEach((plugin) => {
      plugin?.dispose?.(this.getPluginContext(plugin));
    });
    this.extraPlugins = [];
    this.extraPresets = [];
    this.plugins.clear();
    this.hooks.clear();
    this.methods.clear();
  }
}
export {
  PluginService
};
