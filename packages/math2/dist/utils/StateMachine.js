class StateMachine {
  currentState;
  context;
  config;
  listeners = [];
  constructor(config) {
    this.config = config;
    this.currentState = config.initial;
    this.context = config.context;
  }
  // 获取当前状态
  getState() {
    return this.currentState;
  }
  // 获取当前上下文
  getContext() {
    return this.context;
  }
  // 发送事件
  send(eventType, payload) {
    const currentStateConfig = this.config.states[this.currentState];
    const transition = currentStateConfig.on?.[eventType];
    if (!transition) {
      console.warn(
        `事件 "${eventType}" 在当前状态 "${this.currentState}" 下无效`
      );
      return false;
    }
    currentStateConfig.onExit?.(this.context, this);
    const oldState = this.currentState;
    if (transition.action) {
      this.context = transition.action(this.context, {
        type: eventType,
        prevState: oldState,
        payload
      }, this);
    }
    this.currentState = transition.target;
    this.config.states[this.currentState].onEnter?.(this.context, this);
    this.listeners.forEach(
      (listener) => listener(this.currentState, this.context)
    );
    return true;
  }
  // 监听状态变化
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  // 重置到初始状态
  reset() {
    this.currentState = this.config.initial;
    this.context = this.config.context;
    this.listeners.forEach(
      (listener) => listener(this.currentState, this.context)
    );
  }
}
export {
  StateMachine
};
