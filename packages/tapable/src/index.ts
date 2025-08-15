/**
 * 钩子类型
每个钩子都可以被一个或多个函数触发。函数的执行方式取决于钩子的类型：

基本钩子（名称中没有“Waterfall”、“Bail”或“Loop”）。此钩子只是连续调用它所触及的每个函数。

瀑布式钩子(Waterfall)。瀑布式钩子也会连续调用每个被分接的函数。与基本钩子不同，它会将每个函数的返回值传递给下一个函数。

保释 (Bail )。保释钩子 (Bail hook) 允许提前退出。当任何一个被调用的函数返回任何值时，保释钩子就会停止执行剩余的函数。

循环。当循环钩子中的一个插件返回非 undefined 值时，钩子将从第一个插件重新开始。它会一直循环，直到所有插件都返回 undefined。

此外，钩子可以是同步的，也可以是异步的。为了体现这一点，钩子类有“Sync”、“AsyncSeries”和“AsyncParallel”三种：

同步。同步钩子只能通过同步函数来调用（使用myHook.tap()）。

AsyncSeries。异步系列钩子可以与同步、基于回调和基于 Promise 的函数（使用myHook.tap()、myHook.tapAsync()和myHook.tapPromise()）配合使用。它们会依次调用每个异步方法。

异步并行钩子(AsyncParallelmyHook.tap() ) 也可以与同步函数、基于回调的函数和基于 Promise 的函数（使用、myHook.tapAsync()和myHook.tapPromise()）配合使用。但是，它们会并行运行每个异步方法。

钩子类型反映在其类名中。例如，AsyncSeriesWaterfallHook允许异步函数并按顺序运行它们，并将每个函数的返回值传递给下一个函数。
 */

import SyncHook from "./SyncHook"
import SyncBailHook from "./SyncBailHook"
import SyncWaterfallHook from "./SyncWaterfallHook"
import SyncLoopHook from "./SyncLoopHook"
import AsyncParallelHook from "./AsyncParallelHook"
import AsyncParallelBailHook from "./AsyncParallelBailHook"
import AsyncSeriesHook from "./AsyncSeriesHook"
import AsyncSeriesBailHook from "./AsyncSeriesBailHook"
import AsyncSeriesLoopHook from "./AsyncSeriesLoopHook"
import AsyncSeriesWaterfallHook from "./AsyncSeriesWaterfallHook"
import HookMap from "./HookMap"
import MultiHook from "./MultiHook"
import Hook from "./Hook"
export type * from './types'

export {
    Hook,
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesLoopHook,
    AsyncSeriesWaterfallHook,
    HookMap,
    MultiHook,
    // Hook,
}