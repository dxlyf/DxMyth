function push(heap, node) {
  let index = heap.length;
  heap.push(node);
  a: for (; 0 < index; ) {
    let parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
    if (0 < compare(parent, node))
      heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
    else break a;
  }
}
function peek(heap) {
  return 0 === heap.length ? null : heap[0];
}
function pop(heap) {
  if (0 === heap.length) {
    return null;
  }
  let first = heap[0], last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    a: for (let index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength; ) {
      let leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
      if (0 > compare(left, last)) {
        if (rightIndex < length && 0 > compare(right, left)) {
          heap[index] = right;
          heap[rightIndex] = last;
          index = rightIndex;
        } else {
          heap[index] = left;
          heap[leftIndex] = last;
          index = leftIndex;
        }
      } else if (rightIndex < length && 0 > compare(right, last)) {
        heap[index] = right;
        heap[rightIndex] = last;
        index = rightIndex;
      } else {
        break a;
      }
    }
  }
  return first;
}
function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex;
  return 0 !== diff ? diff : a.id - b.id;
}
const NoPriority = 0;
const ImmediatePriority = 1;
const UserBlockingPriority = 2;
const NormalPriority = 3;
const LowPriority = 4;
const IdlePriority = 5;
const enableProfiling = false;
const frameYieldMs = 5;
const userBlockingPriorityTimeout = 250;
const normalPriorityTimeout = 5e3;
const lowPriorityTimeout = 1e4;
const enableRequestPaint = true;
const enableAlwaysYieldScheduler = true;
let getCurrentTime;
const hasPerformanceNow = (
  // $FlowFixMe[method-unbinding]
  typeof performance === "object" && typeof performance.now === "function"
);
if (hasPerformanceNow) {
  const localPerformance = performance;
  getCurrentTime = () => localPerformance.now();
} else {
  const localDate = Date;
  const initialTime = localDate.now();
  getCurrentTime = () => localDate.now() - initialTime;
}
let maxSigned31BitInt = 1073741823;
let taskQueue = [];
let timerQueue = [];
let taskIdCounter = 1;
let currentTask = null;
let currentPriorityLevel = NormalPriority;
let isPerformingWork = false;
let isHostCallbackScheduled = false;
let isHostTimeoutScheduled = false;
const localSetTimeout = typeof setTimeout === "function" ? setTimeout : null;
const localClearTimeout = typeof clearTimeout === "function" ? clearTimeout : null;
const localSetImmediate = typeof globalThis.setImmediate !== "undefined" ? globalThis.setImmediate : null;
function advanceTimers(currentTime) {
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    } else {
      return;
    }
    timer = peek(timerQueue);
  }
}
function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);
  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback();
    } else {
      const firstTimer = peek(timerQueue);
      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}
function flushWork(initialTime) {
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }
  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) ;
    else {
      return workLoop(initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}
function workLoop(initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;
        advanceTimers(currentTime);
        return true;
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
        advanceTimers(currentTime);
      }
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
    {
      if (currentTask === null || currentTask.expirationTime > currentTime) {
        break;
      }
    }
  }
  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}
function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }
  let previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;
  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}
function unstable_next(eventHandler) {
  let priorityLevel;
  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      priorityLevel = NormalPriority;
      break;
    default:
      priorityLevel = currentPriorityLevel;
      break;
  }
  let previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;
  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}
function unstable_wrapCallback(callback) {
  let parentPriorityLevel = currentPriorityLevel;
  return function(...args) {
    let previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;
    try {
      return callback.apply(this, args);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}
function unstable_scheduleCallback(priorityLevel, callback, options) {
  let currentTime = getCurrentTime();
  let startTime2;
  if (typeof options === "object" && options !== null) {
    let delay = options.delay;
    if (typeof delay === "number" && delay > 0) {
      startTime2 = currentTime + delay;
    } else {
      startTime2 = currentTime;
    }
  } else {
    startTime2 = currentTime;
  }
  let timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = -1;
      break;
    case UserBlockingPriority:
      timeout = userBlockingPriorityTimeout;
      break;
    case IdlePriority:
      timeout = maxSigned31BitInt;
      break;
    case LowPriority:
      timeout = lowPriorityTimeout;
      break;
    case NormalPriority:
    default:
      timeout = normalPriorityTimeout;
      break;
  }
  let expirationTime = startTime2 + timeout;
  let newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime: startTime2,
    expirationTime,
    sortIndex: -1
  };
  if (startTime2 > currentTime) {
    newTask.sortIndex = startTime2;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      if (isHostTimeoutScheduled) {
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      requestHostTimeout(handleTimeout, startTime2 - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback();
    }
  }
  return newTask;
}
function unstable_cancelCallback(task) {
  task.callback = null;
}
function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}
let isMessageLoopRunning = false;
let taskTimeoutID = -1;
let frameInterval = frameYieldMs;
let startTime = -1;
function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    return false;
  }
  return true;
}
function requestPaint() {
}
function forceFrameRate(fps) {
  if (fps < 0 || fps > 125) {
    console["error"](
      "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
    );
    return;
  }
  if (fps > 0) {
    frameInterval = Math.floor(1e3 / fps);
  } else {
    frameInterval = frameYieldMs;
  }
}
const performWorkUntilDeadline = () => {
  if (isMessageLoopRunning) {
    const currentTime = getCurrentTime();
    startTime = currentTime;
    let hasMoreWork = true;
    try {
      hasMoreWork = flushWork(currentTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
      }
    }
  }
};
let schedulePerformWorkUntilDeadline;
if (typeof localSetImmediate === "function") {
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== "undefined") {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}
function requestHostCallback() {
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}
function requestHostTimeout(callback, ms) {
  taskTimeoutID = localSetTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}
function cancelHostTimeout() {
  localClearTimeout(taskTimeoutID);
  taskTimeoutID = -1;
}
export {
  IdlePriority,
  ImmediatePriority,
  LowPriority,
  NoPriority,
  NormalPriority,
  UserBlockingPriority,
  enableAlwaysYieldScheduler,
  enableProfiling,
  enableRequestPaint,
  frameYieldMs,
  lowPriorityTimeout,
  normalPriorityTimeout,
  IdlePriority as unstable_IdlePriority,
  ImmediatePriority as unstable_ImmediatePriority,
  LowPriority as unstable_LowPriority,
  NormalPriority as unstable_NormalPriority,
  UserBlockingPriority as unstable_UserBlockingPriority,
  unstable_cancelCallback,
  forceFrameRate as unstable_forceFrameRate,
  unstable_getCurrentPriorityLevel,
  unstable_next,
  getCurrentTime as unstable_now,
  requestPaint as unstable_requestPaint,
  unstable_runWithPriority,
  unstable_scheduleCallback,
  shouldYieldToHost as unstable_shouldYield,
  unstable_wrapCallback,
  userBlockingPriorityTimeout
};
