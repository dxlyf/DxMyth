class Callbacks {
  // 标志要知道列表当前是否正在触发
  firing = false;
  // 非遗忘列表的最后火值
  memory;
  // 标志要知道清单是否已经被解雇
  fired = false;
  // 标志以防止射击
  locked = false;
  // 实际回调列表
  list = [];
  // 可重复列表的执行数据队列
  queue = [];
  // 当前发射回调的索引（根据需要通过add/删除修改）
  firingIndex = -1;
  destroyedList = false;
  options = { once: false, memory: true, unique: true, stopOnFalse: false };
  constructor(options) {
    this.options = Object.assign(this.options, options ?? {});
  }
  // Fire callbacks
  _fire() {
    const queue = this.queue;
    this.locked = this.locked || this.options.once;
    this.fired = this.firing = true;
    for (; queue.length; this.firingIndex = -1) {
      this.memory = queue.shift();
      while (++this.firingIndex < this.list.length) {
        if (this.list[this.firingIndex].apply(this.memory[0], this.memory[1]) === false && this.options.stopOnFalse) {
          this.firingIndex = this.list.length;
          this.memory = false;
        }
      }
    }
    if (!this.options.memory) {
      this.memory = false;
    }
    this.firing = false;
    if (this.locked) {
      if (this.memory) {
        this.list = [];
      } else {
        this.list = [];
        this.destroyedList = true;
      }
    }
  }
  add(...args) {
    if (!this.destroyedList) {
      if (this.memory && !this.firing) {
        this.firingIndex = this.list.length - 1;
        this.queue.push(this.memory);
      }
      args.forEach((arg) => {
        if (typeof arg === "function") {
          if (!this.options.unique || !this.has(arg)) {
            this.list.push(arg);
          }
        } else if (arg && arg.length && Array.isArray(arg)) {
          this.add(...arg);
        }
      });
      if (this.memory && !this.firing) {
        this._fire();
      }
    }
    return this;
  }
  // Remove a callback from the list
  remove(...args) {
    args.forEach((arg) => {
      var index = 0;
      while ((index = this.list.indexOf(arg, index)) > -1) {
        this.list.splice(index, 1);
        if (index <= this.firingIndex) {
          this.firingIndex--;
        }
      }
    });
    return this;
  }
  // Check if a given callback is in the list.
  // If no argument is given, return whether or not list has callbacks attached.
  has(fn) {
    return fn ? this.list.indexOf(fn) > -1 : this.list.length > 0;
  }
  // Remove all callbacks from the list
  empty() {
    if (this.list) {
      this.list = [];
    }
    return this;
  }
  //禁用.fire和.add
  //流产任何当前/待处理的执行
  //清除所有回调和值
  disable() {
    this.locked = true;
    this.queue = [];
    this.list = [];
    this.destroyedList = true;
    this.memory = null;
    return this;
  }
  disabled() {
    return this.destroyedList;
  }
  //禁用.fire
  //也禁用.ADD，除非我们有内存（因为它没有效果）
  //中止任何待处理的执行
  lock() {
    this.locked = true;
    this.queue = [];
    if (!this.memory && !this.firing) {
      this.list = [];
      this.memory = null;
      this.destroyedList = true;
    }
    return this;
  }
  // 用给定上下文和参数调用所有回调    
  fireWith(context, args) {
    if (!this.locked) {
      args = args || [];
      args = [context, args.slice ? args.slice() : args];
      this.queue.push(args);
      if (!this.firing) {
        this._fire();
      }
    }
    return this;
  }
  // 用给定参数调用所有回调   
  fire(...args) {
    this.fireWith(this, args);
    return this;
  }
}
export {
  Callbacks
};
