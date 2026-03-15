import invariant from "src/react16/shared/invariant";
import { computeUniqueAsyncExpiration, createContainer, flushRoot, getPublicRootInstance, unbatchedUpdates, updateContainer, updateContainerAtExpirationTime } from "../../react-reconciler/ReactFiberReconciler";
import { ROOT_ATTRIBUTE_NAME } from "../shared/DOMProperty";
import { DOCUMENT_NODE, ELEMENT_NODE } from "../shared/HTMLNodeType";
import { createPortal as createPortalImpl } from '../../shared/ReactPortal';
import {
  getInstanceFromNode,
  getNodeFromInstance,
  getFiberCurrentPropsFromNode,
  getClosestInstanceFromNode,
} from './ReactDOMComponentTree';

import { setBatchingImplementation } from '../../events/ReactGenericBatching';
import {
  setRestoreImplementation,
  enqueueStateRestore,
  restoreStateIfNeeded,
} from '../../events/ReactControlledComponent';
import './ReactDOMClientInjection'
import {
  injection as EventPluginHubInjection,
  runEventsInBatch,
} from '../../events/EventPluginHub';
import { eventNameDispatchConfigs } from '../../events/EventPluginRegistry';
import {
  accumulateTwoPhaseDispatches,
  accumulateDirectDispatches,
} from '../../events/EventPropagators';
import { restoreControlledState } from './ReactDOMComponent';
import { dispatchEvent } from '../events/ReactDOMEventListener';
import { batchedUpdates, interactiveUpdates, flushInteractiveUpdates, flushSync, flushControlled } from '../../react-reconciler/ReactFiberScheduler'
import { enableStableConcurrentModeAPIs } from "../../shared/ReactFeatureFlags";
setRestoreImplementation(restoreControlledState);
setBatchingImplementation(
  batchedUpdates,
  interactiveUpdates,
  flushInteractiveUpdates,
);

function ReactRoot(
  container: any,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  const root = createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
}
ReactRoot.prototype.render = function (
  children: any,
  callback?: () => mixed,
): any {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(children, root, null, work._onCommit);
  return work;
};
ReactRoot.prototype.unmount = function (callback?: () => mixed): any {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(null, root, null, work._onCommit);
  return work;
};

ReactRoot.prototype.legacy_renderSubtreeIntoContainer = function (
  parentComponent: any,
  children: any,
  callback?: () => mixed,
): any {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(children, root, parentComponent, work._onCommit);
  return work;
};
ReactRoot.prototype.createBatch = function (): any {
  const batch = new ReactBatch(this);
  const expirationTime = batch._expirationTime;

  const internalRoot = this._internalRoot;
  const firstBatch = internalRoot.firstBatch;
  if (firstBatch === null) {
    internalRoot.firstBatch = batch;
    batch._next = null;
  } else {
    // Insert sorted by expiration time then insertion order
    let insertAfter = null;
    let insertBefore = firstBatch;
    while (
      insertBefore !== null &&
      insertBefore._expirationTime >= expirationTime
    ) {
      insertAfter = insertBefore;
      insertBefore = insertBefore._next;
    }
    batch._next = insertBefore;
    if (insertAfter !== null) {
      insertAfter._next = batch;
    }
  }

  return batch;
};

function ReactBatch(root: any) {
  const expirationTime = computeUniqueAsyncExpiration();
  this._expirationTime = expirationTime;
  this._root = root;
  this._next = null;
  this._callbacks = null;
  this._didComplete = false;
  this._hasChildren = false;
  this._children = null;
  this._defer = true;
}
ReactBatch.prototype.render = function (children: any) {
  invariant(
    this._defer,
    'batch.render: Cannot render a batch that already committed.',
  );
  this._hasChildren = true;
  this._children = children;
  const internalRoot = this._root._internalRoot;
  const expirationTime = this._expirationTime;
  const work = new ReactWork();
  updateContainerAtExpirationTime(
    children,
    internalRoot,
    null,
    expirationTime,
    work._onCommit,
  );
  return work;
};
ReactBatch.prototype.then = function (onComplete: () => mixed) {
  if (this._didComplete) {
    onComplete();
    return;
  }
  let callbacks = this._callbacks;
  if (callbacks === null) {
    callbacks = this._callbacks = [];
  }
  callbacks.push(onComplete);
};
ReactBatch.prototype.commit = function () {
  const internalRoot = this._root._internalRoot;
  let firstBatch = internalRoot.firstBatch;
  invariant(
    this._defer && firstBatch !== null,
    'batch.commit: Cannot commit a batch multiple times.',
  );

  if (!this._hasChildren) {
    // This batch is empty. Return.
    this._next = null;
    this._defer = false;
    return;
  }

  let expirationTime = this._expirationTime;

  // Ensure this is the first batch in the list.
  if (firstBatch !== this) {
    // This batch is not the earliest batch. We need to move it to the front.
    // Update its expiration time to be the expiration time of the earliest
    // batch, so that we can flush it without flushing the other batches.
    if (this._hasChildren) {
      expirationTime = this._expirationTime = firstBatch._expirationTime;
      // Rendering this batch again ensures its children will be the final state
      // when we flush (updates are processed in insertion order: last
      // update wins).
      // TODO: This forces a restart. Should we print a warning?
      this.render(this._children);
    }

    // Remove the batch from the list.
    let previous = null;
    let batch = firstBatch;
    while (batch !== this) {
      previous = batch;
      batch = batch._next;
    }
    invariant(
      previous !== null,
      'batch.commit: Cannot commit a batch multiple times.',
    );
    previous._next = batch._next;

    // Add it to the front.
    this._next = firstBatch;
    firstBatch = internalRoot.firstBatch = this;
  }

  // Synchronously flush all the work up to this batch's expiration time.
  this._defer = false;
  flushRoot(internalRoot, expirationTime);

  // Pop the batch from the list.
  const next = this._next;
  this._next = null;
  firstBatch = internalRoot.firstBatch = next;

  // Append the next earliest batch's children to the update queue.
  if (firstBatch !== null && firstBatch._hasChildren) {
    firstBatch.render(firstBatch._children);
  }
};
ReactBatch.prototype._onComplete = function () {
  if (this._didComplete) {
    return;
  }
  this._didComplete = true;
  const callbacks = this._callbacks;
  if (callbacks === null) {
    return;
  }
  // TODO: Error handling.
  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];
    callback();
  }
};

function ReactWork() {
  this._callbacks = null;
  this._didCommit = false;
  // TODO: Avoid need to bind by replacing callbacks in the update queue with
  // list of Work objects.
  this._onCommit = this._onCommit.bind(this);
}
ReactWork.prototype.then = function (onCommit: () => mixed): void {
  if (this._didCommit) {
    onCommit();
    return;
  }
  let callbacks = this._callbacks;
  if (callbacks === null) {
    callbacks = this._callbacks = [];
  }
  callbacks.push(onCommit);
};
ReactWork.prototype._onCommit = function (): void {
  if (this._didCommit) {
    return;
  }
  this._didCommit = true;
  const callbacks = this._callbacks;
  if (callbacks === null) {
    return;
  }
  // TODO: Error handling.
  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];
    invariant(
      typeof callback === 'function',
      'Invalid argument passed as callback. Expected a function. Instead ' +
      'received: %s',
      callback,
    );
    callback();
  }
};


function getReactRootElementInContainer(container: any) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}
function shouldHydrateDueToLegacyHeuristic(container) {
  const rootElement = getReactRootElementInContainer(container);
  return !!(
    rootElement &&
    rootElement.nodeType === ELEMENT_NODE &&
    rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)
  );
}
function legacyCreateRootFromDOMContainer(
  container: any,
  forceHydrate: boolean,
): any {
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  // Legacy roots are not async by default.
  const isConcurrent = false;
  return new ReactRoot(container, isConcurrent, shouldHydrate);
}
function legacyRenderSubtreeIntoContainer(
  parentComponent: any,
  children: any,
  container: any,
  forceHydrate: boolean,
  callback?: Function,
) {

  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.
  let root: any = (container._reactRootContainer as any);
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer(
          parentComponent,
          children,
          callback,
        );
      } else {
        root.render(children, callback);
      }
    });
  } else {
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer(
        parentComponent,
        children,
        callback,
      );
    } else {
      root.render(children, callback);
    }
  }
  return getPublicRootInstance(root._internalRoot);
}


function render(element: any,
  container: any,
  callback?: Function,) {
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}


function createPortal(
  children: any,
  container: any,
  key: string = null,
) {

  // TODO: pass ReactDOM portal implementation as third argument
  return createPortalImpl(children, container, null, key);
}
type RootOptions = {
  hydrate?: boolean,
};

function createRoot(container: any, options?: RootOptions): typeof ReactRoot {
  const functionName = enableStableConcurrentModeAPIs
    ? 'createRoot'
    : 'unstable_createRoot';

  const hydrate = options != null && options.hydrate === true;
  return new ReactRoot(container, true, hydrate);
}

const Events = [
  getInstanceFromNode,
  getNodeFromInstance,
  getFiberCurrentPropsFromNode,
  EventPluginHubInjection.injectEventPluginsByName,
  eventNameDispatchConfigs,
  accumulateTwoPhaseDispatches,
  accumulateDirectDispatches,
  enqueueStateRestore,
  restoreStateIfNeeded,
  dispatchEvent,
  runEventsInBatch,
]
export {
  createPortal,
  render,
  batchedUpdates as unstable_batchedUpdates,

  interactiveUpdates as unstable_interactiveUpdates,
  flushSync,
  createRoot as unstable_createRoot,
  flushControlled as unstable_flushControlled,

  Events,
}