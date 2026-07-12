/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare const NoPriority = 0;
export declare const ImmediatePriority = 1;
export declare const UserBlockingPriority = 2;
export declare const NormalPriority = 3;
export declare const LowPriority = 4;
export declare const IdlePriority = 5;
type Callback = (didUserCallbackTimeout: boolean) => Callback | void;
type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type Task = {
    id: number;
    callback: Callback | null;
    priorityLevel: PriorityLevel;
    startTime: number;
    expirationTime: number;
    sortIndex: number;
    isQueued?: boolean;
};
export declare const enableProfiling = false;
export declare const frameYieldMs = 5;
export declare const userBlockingPriorityTimeout = 250;
export declare const normalPriorityTimeout = 5000;
export declare const lowPriorityTimeout = 10000;
export declare const enableRequestPaint = true;
export declare const enableAlwaysYieldScheduler = true;
declare let getCurrentTime: () => number | DOMHighResTimeStamp;
declare function unstable_runWithPriority<T>(priorityLevel: PriorityLevel, eventHandler: () => T): T;
declare function unstable_next<T>(eventHandler: () => T): T;
declare function unstable_wrapCallback(callback: (this: any, ...args: any[]) => any): (this: any, ...args: any[]) => any;
declare function unstable_scheduleCallback(priorityLevel: PriorityLevel, callback: Callback, options?: {
    delay: number;
}): Task;
declare function unstable_cancelCallback(task: Task): void;
declare function unstable_getCurrentPriorityLevel(): PriorityLevel;
declare function shouldYieldToHost(): boolean;
declare function requestPaint(): void;
declare function forceFrameRate(fps: number): void;
export { ImmediatePriority as unstable_ImmediatePriority, UserBlockingPriority as unstable_UserBlockingPriority, NormalPriority as unstable_NormalPriority, IdlePriority as unstable_IdlePriority, LowPriority as unstable_LowPriority, unstable_runWithPriority, unstable_next, unstable_scheduleCallback, unstable_cancelCallback, unstable_wrapCallback, unstable_getCurrentPriorityLevel, shouldYieldToHost as unstable_shouldYield, requestPaint as unstable_requestPaint, getCurrentTime as unstable_now, forceFrameRate as unstable_forceFrameRate, };
