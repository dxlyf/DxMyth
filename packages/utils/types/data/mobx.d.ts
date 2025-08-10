export var $mobx: symbol;
export function FlowCancellationError(): void;
export class FlowCancellationError {
    message: string;
}
export var ObservableMap: any;
export var ObservableSet: any;
export var Reaction: any;
declare function allowStateChanges(allowStateChanges: any, func: any): any;
export function runInAction(fn: any): any;
declare function allowStateReadsEnd(prev: any): void;
declare function allowStateReadsStart(allowStateReads: any): any;
declare function autoAction(arg1: any, arg2: any): any;
declare namespace autoAction {
    let bound: any;
}
export function _endAction(runInfo: any): void;
declare function getAdministration(thing: any, property: any): any;
declare function getGlobalState(): any;
declare function interceptReads(thing: any, propOrHandler: any, handler: any): void | (() => void);
declare function isComputingDerivation(): boolean;
/**
 * For testing purposes only; this will break the internal state of existing observables,
 * but can be used to get back at a stable state after throwing errors
 */
declare function resetGlobalState(): void;
export function _startAction(actionName: any, canRunAsDerivation: any, scope: any, args: any): {
    runAsAction_: boolean;
    prevDerivation_: any;
    prevAllowStateChanges_: any;
    prevAllowStateReads_: any;
    notifySpy_: boolean;
    startTime_: number;
    actionId_: number;
    parentActionId_: number;
};
export function action(arg1: any, arg2: any): any;
export namespace action {
    let bound_1: any;
    export { bound_1 as bound };
}
/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */
export function autorun(view: any, opts: any): any;
export namespace comparer {
    export { identityComparer as identity };
    export { structuralComparer as structural };
    export { defaultComparer as default };
    export { shallowComparer as shallow };
}
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
export function computed(arg1: any, arg2: any): any;
export namespace computed {
    let struct: any;
}
export function configure(options: any): void;
export function createAtom(name: any, onBecomeObservedHandler: any, onBecomeUnobservedHandler: any): any;
declare function apiDefineProperty(obj: any, key: any, descriptor: any): any;
export function entries(obj: any): any;
export function extendObservable(target: any, properties: any, annotations: any, options: any, ...args: any[]): any;
export var flow: ((arg1: any, arg2: any, ...args: any[]) => any) & {
    annotationType_: any;
    options_: any;
    make_: typeof make_$2;
    extend_: typeof extend_$2;
    decorate_20223_: typeof decorate_20223_$2;
};
export function flowResult(result: any): any;
export function get(obj: any, key: any): any;
export function getAtom(thing: any, property: any): any;
export function getDebugName(thing: any, property: any): any;
export function getDependencyTree(thing: any, property: any): {
    name: any;
};
export function getObserverTree(thing: any, property: any): {
    name: any;
};
export function has(obj: any, key: any): any;
export function intercept(thing: any, propOrHandler: any, handler: any): any;
export function isAction(thing: any): boolean;
declare function isObservableValue(x: any): boolean;
export function isComputed(value: any, ...args: any[]): boolean | void;
export function isComputedProp(value: any, propName: any): boolean | void;
export function isFlow(fn: any): boolean;
export function isFlowCancellationError(error: any): error is FlowCancellationError;
export function isObservable(value: any, ...args: any[]): any;
export function isObservableArray(thing: any): boolean;
export function isObservableMap(x: any): boolean;
export function isObservableObject(thing: any): boolean;
export function isObservableProp(value: any, propName: any): any;
export function isObservableSet(x: any): boolean;
export function keys(obj: any): any;
export function makeAutoObservable(target: any, overrides: any, options: any): any;
export function makeObservable(target: any, annotations: any, options: any): any;
export var observable: typeof createObservable & {
    box: (value: any, options: any) => any;
    array: (initialValues: any, options: any) => any;
    map: (initialValues: any, options: any) => any;
    set: (initialValues: any, options: any) => any;
    object: (props: any, decorators: any, options: any) => any;
    ref: any;
    shallow: any;
    deep: any;
    struct: any;
};
export function observe(thing: any, propOrCb: any, cbOrFire: any, fireImmediately: any): any;
export function onBecomeObserved(thing: any, arg2: any, arg3: any): () => void;
export function onBecomeUnobserved(thing: any, arg2: any, arg3: any): () => void;
export function onReactionError(handler: any): () => void;
export var override: any;
declare function apiOwnKeys(obj: any): any;
export function reaction(expression: any, effect: any, opts: any): any;
export function remove(obj: any, key: any): void;
export function set(obj: any, key: any, value: any, ...args: any[]): void;
export function spy(listener: any): (...args: any[]) => any;
/**
 * Recursively converts an observable to it's non-observable native counterpart.
 * It does NOT recurse into non-observables, these are left as they are, even if they contain observables.
 * Computed and other non-enumerable properties are completely ignored.
 * Complex scenarios require custom solution, eg implementing `toJSON` or using `serializr` lib.
 */
export function toJS(source: any, options: any): any;
export function trace(...args: any[]): void;
/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */
export function transaction(action: any, thisArg: any): any;
export function untracked(action: any): any;
export function values(obj: any): any;
export function when(predicate: any, arg1: any, arg2: any, ...args: any[]): any;
declare function identityComparer(a: any, b: any): boolean;
declare function structuralComparer(a: any, b: any): boolean;
declare function defaultComparer(a: any, b: any): boolean;
declare function shallowComparer(a: any, b: any): boolean;
declare function make_$2(adm: any, key: any, descriptor: any, source: any): 0 | 1 | 2;
declare function extend_$2(adm: any, key: any, descriptor: any, proxyTrap: any): any;
declare function decorate_20223_$2(mthd: any, context: any): any;
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */
declare function createObservable(v: any, arg2: any, arg3: any): any;
export { allowStateChanges as _allowStateChanges, runInAction as _allowStateChangesInsideComputed, allowStateReadsEnd as _allowStateReadsEnd, allowStateReadsStart as _allowStateReadsStart, autoAction as _autoAction, getAdministration as _getAdministration, getGlobalState as _getGlobalState, interceptReads as _interceptReads, isComputingDerivation as _isComputingDerivation, resetGlobalState as _resetGlobalState, apiDefineProperty as defineProperty, isObservableValue as isBoxedObservable, apiOwnKeys as ownKeys };
