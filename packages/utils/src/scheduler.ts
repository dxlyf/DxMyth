/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


type Heap<T extends Node> = Array<T>;
type Node = {
    id: number,
    sortIndex: number,
    [key: string]: any,
};
function push<T extends Node>(heap: Heap<T>, node: T) {
    var index = heap.length;
    heap.push(node);
    a: for (; 0 < index;) {
        var parentIndex = (index - 1) >>> 1,
            parent = heap[parentIndex];
        if (0 < compare(parent, node))
            (heap[parentIndex] = node), (heap[index] = parent), (index = parentIndex);
        else break a;
    }
}
function peek<T extends Node>(heap: Heap<T>): T | null {
    return 0 === heap.length ? null : heap[0];
}
function pop<T extends Node>(heap: Heap<T>): T | null {
    if (0 === heap.length) {
        return null;
    }
    let first = heap[0],
        last = heap.pop();
    if (last !== first) {
        heap[0] = last;
        a: for (let index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength;) {
            let leftIndex = 2 * (index + 1) - 1,
                left = heap[leftIndex],
                rightIndex = leftIndex + 1,
                right = heap[rightIndex];
            if (0 > compare(left, last)) {
                if (rightIndex < length && 0 > compare(right, left)) {
                    heap[index] = right
                    heap[rightIndex] = last
                    index = rightIndex
                } else {
                    heap[index] = left
                    heap[leftIndex] = last
                    index = leftIndex
                }
            } else if (rightIndex < length && 0 > compare(right, last)) {
                heap[index] = right
                heap[rightIndex] = last
                index = rightIndex
            }
            else {
                break a;
            }
        }
    }
    return first;
}
function compare(a: Node, b: Node) {
    const diff = a.sortIndex - b.sortIndex;
    return 0 !== diff ? diff : a.id - b.id;
}
let now: () => number = void 0;
if ("object" === typeof performance && "function" === typeof performance.now) {
    let localPerformance = performance;
    now = function () {
        return localPerformance.now();
    };
} else {
    var localDate = Date,
        initialTime = localDate.now();
    now = function () {
        return localDate.now() - initialTime;
    };
}
type Callback = (didUserCallbackTimeout: boolean) => Callback | void
type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

type Task = {
    id: number,
    callback: Callback | null,
    priorityLevel: PriorityLevel,
    startTime: number,
    expirationTime: number,
    sortIndex: number,
    isQueued?: boolean,
}
let taskQueue: Array<Task> = [],
    timerQueue: Array<Task> = [],
    taskIdCounter = 1,
    currentTask = null,
    currentPriorityLevel = 3,
    isPerformingWork = !1,
    isHostCallbackScheduled = !1,
    isHostTimeoutScheduled = !1,
    needsPaint = !1,
    localSetTimeout = "function" === typeof setTimeout ? setTimeout : null,
    localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null,
    localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
function advanceTimers(currentTime: number) {
    for (let timer = peek(timerQueue); null !== timer;) {
        if (null === timer.callback) {
            pop(timerQueue);
        }
        else if (timer.startTime <= currentTime) {
            pop(timerQueue)
            timer.sortIndex = timer.expirationTime
            push(taskQueue, timer);
        }
        else {
            break
        };
        timer = peek(timerQueue);
    }
}
function handleTimeout(currentTime: number) {
    isHostTimeoutScheduled = !1;
    advanceTimers(currentTime);
    if (!isHostCallbackScheduled) {
        if (null !== peek(taskQueue)) {
            isHostCallbackScheduled = true,
                isMessageLoopRunning = true
            schedulePerformWorkUntilDeadline()
        }
        else {
            var firstTimer = peek(timerQueue);
            null !== firstTimer &&
                requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
    }
}
var isMessageLoopRunning = !1,
    taskTimeoutID: any = -1,
    frameInterval = 5,
    startTime = -1;
function shouldYieldToHost() {
    return needsPaint
        ? !0
        : now() - startTime < frameInterval
            ? !1
            : !0;
}
function performWorkUntilDeadline() {
    needsPaint = !1;
    if (isMessageLoopRunning) {
        var currentTime = now();
        startTime = currentTime;
        var hasMoreWork = !0;
        try {
            a: {
                isHostCallbackScheduled = !1;
                isHostTimeoutScheduled &&
                    ((isHostTimeoutScheduled = !1),
                        localClearTimeout(taskTimeoutID),
                        (taskTimeoutID = -1));
                isPerformingWork = !0;
                var previousPriorityLevel = currentPriorityLevel;
                try {
                    b: {
                        advanceTimers(currentTime);
                        for (
                            currentTask = peek(taskQueue);
                            null !== currentTask &&
                            !(
                                currentTask.expirationTime > currentTime && shouldYieldToHost()
                            );

                        ) {
                            var callback = currentTask.callback;
                            if ("function" === typeof callback) {
                                currentTask.callback = null;
                                currentPriorityLevel = currentTask.priorityLevel;
                                var continuationCallback = callback(
                                    currentTask.expirationTime <= currentTime
                                );
                                currentTime = now();
                                if ("function" === typeof continuationCallback) {
                                    currentTask.callback = continuationCallback;
                                    advanceTimers(currentTime);
                                    hasMoreWork = !0;
                                    break b;
                                }
                                currentTask === peek(taskQueue) && pop(taskQueue);
                                advanceTimers(currentTime);
                            } else pop(taskQueue);
                            currentTask = peek(taskQueue);
                        }
                        if (null !== currentTask) hasMoreWork = !0;
                        else {
                            var firstTimer = peek(timerQueue);
                            null !== firstTimer &&
                                requestHostTimeout(
                                    handleTimeout,
                                    firstTimer.startTime - currentTime
                                );
                            hasMoreWork = !1;
                        }
                    }
                    break a;
                } finally {
                    (currentTask = null),
                        (currentPriorityLevel = previousPriorityLevel),
                        (isPerformingWork = !1);
                }
                hasMoreWork = void 0;
            }
        } finally {
            hasMoreWork
                ? schedulePerformWorkUntilDeadline()
                : (isMessageLoopRunning = !1);
        }
    }
}
var schedulePerformWorkUntilDeadline: () => void;
if ("function" === typeof localSetImmediate)
    schedulePerformWorkUntilDeadline = function () {
        localSetImmediate(performWorkUntilDeadline);
    };
else if ("undefined" !== typeof MessageChannel) {
    var channel = new MessageChannel(),
        port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;
    schedulePerformWorkUntilDeadline = function () {
        port.postMessage(null);
    };
} else
    schedulePerformWorkUntilDeadline = function () {
        localSetTimeout(performWorkUntilDeadline, 0);
    };
function requestHostTimeout(callback: (time: number) => void, ms: number) {
    taskTimeoutID = localSetTimeout(function () {
        callback(now());
    }, ms);
}
export const IdlePriority = 5;
export const ImmediatePriority = 1;
export const LowPriority = 4;
export const NormalPriority = 3;
export const Profiling: any = null;
export const UserBlockingPriority = 2;
export const cancelCallback = function (task: Task) {
    task.callback = null;
};
export const forceFrameRate = function (fps: number) {
    0 > fps || 125 < fps
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
        )
        : (frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5);
};
export const getCurrentPriorityLevel = function () {
    return currentPriorityLevel;
};
export const next = function (eventHandler: () => any) {
    switch (currentPriorityLevel) {
        case 1:
        case 2:
        case 3:
            var priorityLevel = 3;
            break;
        default:
            priorityLevel = currentPriorityLevel;
    }
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;
    try {
        return eventHandler();
    } finally {
        currentPriorityLevel = previousPriorityLevel;
    }
};
export const requestPaint = function () {
    needsPaint = !0;
};
export const runWithPriority = function (priorityLevel: PriorityLevel, eventHandler: () => any) {
    switch (priorityLevel) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            break;
        default:
            priorityLevel = 3;
    }
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;
    try {
        return eventHandler();
    } finally {
        currentPriorityLevel = previousPriorityLevel;
    }
};
export const scheduleCallback = function (
    priorityLevel: PriorityLevel,
    callback: Callback,
    options: { delay?: number } | number
) {
    var currentTime = now();
    "object" === typeof options && null !== options
        ? ((options = options.delay),
            (options =
                "number" === typeof options && 0 < options
                    ? currentTime + options
                    : currentTime))
        : (options = currentTime);
    switch (priorityLevel) {
        case 1:
            var timeout = -1;
            break;
        case 2:
            timeout = 250;
            break;
        case 5:
            timeout = 1073741823;
            break;
        case 4:
            timeout = 1e4;
            break;
        default:
            timeout = 5e3;
    }
    timeout = options + timeout;
    let newTask = {
        id: taskIdCounter++,
        callback: callback,
        priorityLevel: priorityLevel,
        startTime: options,
        expirationTime: timeout,
        sortIndex: -1
    };
    if (options > currentTime) {
        newTask.sortIndex = options;
        push(timerQueue, newTask)
        if (null === peek(taskQueue) && newTask === peek(timerQueue)) {
            if (isHostTimeoutScheduled) {
                localClearTimeout(taskTimeoutID)
                taskTimeoutID = -1
            } else {
                isHostTimeoutScheduled = true
                requestHostTimeout(handleTimeout, options - currentTime)
            }
        }
    } else {
        newTask.sortIndex = timeout
        push(taskQueue, newTask)
        if (isHostCallbackScheduled || isPerformingWork) {
            isHostCallbackScheduled = true
            isMessageLoopRunning = true
            schedulePerformWorkUntilDeadline()
        }
    }
    options > currentTime
    return newTask;
};
export const shouldYield = shouldYieldToHost;
export const wrapCallback = function (callback: (this: any, ...args: any[]) => any) {
    var parentPriorityLevel = currentPriorityLevel;
    return function (this: any, ...args: any[]) {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        try {
            return callback.apply(this, args);
        } finally {
            currentPriorityLevel = previousPriorityLevel;
        }
    };
};