function mixinDestroyable(target) {
  const oldDestroy = target.prototype.destroy;
  target.prototype.isDestroyed = false;
  target.prototype.destroy = function() {
    if (this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;
    oldDestroy?.call(target);
  };
}
class Disposable {
  isDisposed = false;
  onDispose() {
  }
  dispose() {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    this.onDispose();
  }
}
function mixinDisposable(target) {
  const oldDispose = target.prototype.dispose;
  target.prototype.isDisposed = false;
  target.prototype.dispose = function() {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    oldDispose?.call(target);
  };
}
const pushDisposableManager = (manager) => {
  prevActiveDisposableManager = activeDisposableManager;
  activeDisposableManager = manager;
  return activeDisposableManager;
};
const popDisposableManager = () => {
  activeDisposableManager = prevActiveDisposableManager;
};
const addDisposable = (target) => {
  if (activeDisposableManager) {
    activeDisposableManager.add(target);
  }
};
let prevActiveDisposableManager = null;
let activeDisposableManager = null;
class DisposableManager {
  static add = addDisposable;
  static mixin(target, options = {}) {
    const oldDispose = target.prototype.dispose;
    target.prototype.isDisposed = false;
    target.prototype.dispose = function() {
      if (this.isDisposed) {
        return;
      }
      this.isDisposed = true;
      options.dispose?.(this);
      oldDispose?.call(target);
    };
    target.prototype.disposeLater = function() {
      if (activeDisposableManager && !this.__isDisposed) {
        activeDisposableManager.add(this);
      }
    };
  }
  disposables = [];
  persistentDisposables = [];
  add(disposable) {
    this.disposables.push(disposable);
  }
  addPersistent(disposable) {
    this.persistentDisposables.push(disposable);
  }
  destroy() {
    this.dispose();
    for (let i = 0; i < this.persistentDisposables.length; i++) {
      const disposable = this.persistentDisposables[i];
      disposable.dispose();
    }
    this.persistentDisposables.length = 0;
  }
  dispose() {
    for (let i = 0; i < this.disposables.length; i++) {
      const disposable = this.disposables[i];
      disposable.dispose();
    }
    this.disposables.length = 0;
  }
  run(fn) {
    try {
      activeDisposableManager = pushDisposableManager(this);
      return fn();
    } finally {
      this.dispose();
      popDisposableManager();
    }
  }
}
export {
  Disposable,
  DisposableManager,
  addDisposable,
  mixinDestroyable,
  mixinDisposable,
  popDisposableManager,
  pushDisposableManager
};
