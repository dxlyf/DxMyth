class g {
  id;
  opts;
  service;
  constructor(s, e) {
    this.service = s, this.id = e.id, this.opts = e.opts;
  }
  register(s) {
    const e = this.service.hooks.get(s.name) ?? [];
    s.pluginId = this.id, this.service.hooks.set(s.name, e.concat(s));
  }
  registerMethod(s, e) {
    const t = this.service.methods.get(s) ?? [];
    t.push(e || ((i) => {
      this.register({ name: s, handle: i });
    })), this.service.methods.set(s, t);
  }
  registerCommand(s) {
    if (this.service.commands.has(s.name))
      throw `${s.name}:命令已注册`;
    this.service.commands.set(s.name, s);
  }
}
var n = /* @__PURE__ */ ((a) => (a.modify = "modify", a.add = "add", a.event = "event", a))(n || {});
class d {
  config;
  hooks;
  methods;
  commands;
  plugins;
  presets;
  extraPlugins;
  extraPresets;
  constructor(s) {
    this.config = s, this.hooks = /* @__PURE__ */ new Map(), this.methods = /* @__PURE__ */ new Map(), this.commands = /* @__PURE__ */ new Map(), this.plugins = /* @__PURE__ */ new Map(), this.presets = /* @__PURE__ */ new Map();
  }
  initPresetsAndPlugins() {
    this.plugins.clear(), this.presets.clear(), this.extraPlugins = [], this.extraPresets = [], this.resolvePresets(this.config.presets ?? [], !1), this.resolvePlugins(this.config.plugins ?? [], !1);
  }
  getSortPlugins(s) {
    const e = [], t = [], i = [];
    return s.forEach((o) => {
      switch (o.order) {
        case "pre":
          t.push(o);
          break;
        case "post":
          i.push(o);
          break;
        default:
          e.push(o);
          break;
      }
    }), [...t, ...e, ...i].filter(Boolean);
  }
  resolvePresets(s, e) {
    for (let i = 0; i < s.length; i++)
      this.initPreset(s[i]);
    let t = this.extraPresets;
    for (; t.length; )
      this.initPreset(t.shift());
    this.extraPresets = [];
  }
  resolvePlugins(s, e) {
    let t = this.getSortPlugins(s.concat(this.extraPlugins));
    for (this.extraPlugins = []; t.length; )
      this.initPlugin(t.shift()), this.extraPlugins.length && (t = this.getSortPlugins(t.concat(this.extraPlugins)), this.extraPlugins = []);
    this.extraPlugins = [];
  }
  registerPlugin(s) {
    if (!this.plugins.has(s.id))
      throw `${s.id}:插件已注册`;
    this.extraPlugins.push(s), this.plugins.set(s.id, s);
  }
  registerPreset(s) {
    if (this.presets.has(s.id))
      throw `${s.id}:预设已注册`;
    this.extraPresets.push(s), this.presets.set(s.id, s);
  }
  applyMethods(s) {
    return (...e) => {
      s.forEach((t) => {
        t(...e);
      });
    };
  }
  initPluginCtx(s) {
    const e = new g(this, s);
    return new Proxy(e, {
      get: (t, i, o) => {
        if (this.methods.has(i)) {
          const h = this.methods.get(i);
          return this.applyMethods(h);
        }
        return Reflect.get(t, i, o);
      }
    });
  }
  initPlugin(s) {
    if (this.plugins.has(s.id))
      return;
    this.plugins.set(s.id, s);
    const e = this.initPluginCtx(s);
    s.handle(e, s.opts);
  }
  initPreset(s) {
    if (this.presets.has(s.id))
      return;
    this.presets.set(s.id, s);
    const e = this.initPluginCtx(s), { presets: t, plugins: i } = s.handle(e, s.opts);
    t && this.extraPresets.push(...t), i && this.extraPlugins.push(...i);
  }
  async hookFirst(s, ...e) {
    const t = this.hooks.get(s) ?? [];
    for (let i of t) {
      let o = await Promise.resolve().then(() => i.handle(...e));
      if (o != null)
        return o;
    }
    return null;
  }
  hookFirstSync(s, ...e) {
    const t = this.hooks.get(s) ?? [];
    for (let i of t) {
      let o = i.handle(...e);
      if (o != null)
        return o;
    }
    return null;
  }
  async hookParallel(s, ...e) {
    const t = this.hooks.get(s) ?? [], i = [];
    for (const o of t)
      i.push(Promise.resolve().then(() => o.handle(...e)));
    return Promise.all(i);
  }
  runHookSync(s, ...e) {
    const t = this.hooks.get(s) ?? [];
    for (const i of t)
      i.handle(...e);
  }
  async runHook(s, ...e) {
    const t = this.hooks.get(s) ?? [];
    for (const i of t)
      await Promise.resolve().then(() => i.handle(...e));
  }
  async applyPlugins(s) {
    let { name: e, type: t, args: i, initalValue: o = [] } = s;
    const h = (this.hooks.get(e) ?? []).slice();
    if (h.sort((r, l) => {
      let c = r.stage ?? 0, u = l.stage ?? 0;
      return c - u;
    }), h)
      switch (t || (e.startsWith("add") ? t = n.add : e.startsWith("modify") ? t = n.modify : e.startsWith("on") && (t = n.event)), t) {
        case n.add:
          for (let r of h) {
            const l = await Promise.resolve().then(() => r.handle(i));
            l != null && (o = o.concat(l));
          }
          return o;
        case n.modify:
          for (let r of h)
            o = await Promise.resolve().then(() => r.handle(o, i));
          return o;
        case n.event:
          if (s.sync)
            for (let r of h)
              r.handle(s.args);
          else
            for (let r of h)
              await Promise.resolve().then(() => r.handle(i));
      }
  }
  reset() {
    this.hooks.clear(), this.commands.clear(), this.methods.clear(), this.extraPlugins = [], this.extraPresets = [], this.plugins.clear(), this.presets.clear();
  }
  async run(s, ...e) {
    if (!this.commands.has(s))
      throw `${s}:命令不存在`;
    const t = this.config.getConfig?.(...e) ?? {};
    this.initPresetsAndPlugins(), await this.applyPlugins({ name: "onRunBefore" });
    let i = await this.commands.get(s).handle(t);
    return await this.applyPlugins({ name: "onRunAfter" }), i;
  }
}
export {
  n as AppplyPluginHookType,
  g as PluginContext,
  d as PluginService
};
