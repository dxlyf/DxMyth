import type { HookInterceptorFnNames, IHook, HookInterceptor, Tap, HookCallType, HookAsyncCallback } from './types'
const deprecateContext = () => {
	console.warn("Hook.context is deprecated and will be removed")
}
type CallActionType = 'Normal' | 'Bail' | 'Waterfall' | 'Loop'

type ComposeMiddle = (next: ComposeNextHandle) => (action: CallAction) => any
type ComposeNextHandle<T extends any = any> = (action: CallAction) => T
type CallAction = { done: boolean, err?: any, callback: HookAsyncCallback<any>, type: CallActionType, context?: any, args: any[], result?: any }

function compose(funcs: ComposeMiddle[]) {
	if (funcs.length === 0) {
		return funcs[0]
	}
	return funcs.reduce((a, b) => (next: ComposeNextHandle) => a(b(next)))
}

abstract class Hook<T extends any[], Result = unknown> implements IHook<T, Result> {

	interceptors: HookInterceptor[]
	taps: Tap[]
	name?: string
	constructor(name?: string) {
		this.name = name;
		this.taps = [];
		this.interceptors = [];
	}
	protected _tap(type: HookCallType, options: Partial<Tap> | string, fn?: Tap['fn']) {
		if (typeof options === "string") {
			options = {
				name: (options as string).trim()
			};
		} else if (typeof options !== "object" || options === null) {
			throw new Error("Invalid tap options");
		}
		if (typeof options.name !== "string" || options.name === "") {
			throw new Error("Missing name for tap");
		}
		if (typeof options.context !== "undefined") {
			deprecateContext();
		}
		options = Object.assign({ type, fn }, options);

		options = this._runRegisterInterceptors(options as Tap);
		this._insert(options as Tap);
	}



	tap<K extends Tap>(options: string | Partial<K>, fn?: (...args:K['context'] extends true?[context:any,...T]:[...T]) => Result) {
		this._tap("sync", options, fn);
	}
	tapAsync<K extends Tap>(
		options: string | Partial<K>,
		fn?: (...args:K['context'] extends true?[context:any,...T,HookAsyncCallback<Result>]:[...T,HookAsyncCallback<Result>]) => void
	){
		this._tap("async", options, fn);
	}

	tapPromise<K extends Tap>(
		options: string | Partial<K>,
		fn?: (...args:K['context'] extends true?[context:any,...T]:[...T]) => Promise<Result>
	){
		this._tap("promise", options, fn);
	}
	abstract call(...args: T): Result;
	abstract promise(...args: T): Promise<Result>;
	abstract callAsync(...args: [...T, HookAsyncCallback<Result>]): void;
	protected _runRegisterInterceptors(options: Tap) {
		for (const interceptor of this.interceptors) {
			if (interceptor.register) {
				const newOptions = interceptor.register(options);
				if (newOptions !== undefined) {
					options = newOptions;
				}
			}
		}
		return options;
	}

	withOptions(options: Partial<Tap> | string) {
		const mergeOptions = (opt: Partial<Tap> | string) =>
			Object.assign({}, options, typeof opt === "string" ? { name: opt } : opt) as Tap;

		return {
			name: this.name,
			tap: (opt: Tap, fn: Parameters<IHook<T, Result>['tap']>[1]) => this.tap(mergeOptions(opt), fn),
			tapAsync: (opt: Tap, fn: Parameters<IHook<T, Result>['tapAsync']>[1]) => this.tapAsync(mergeOptions(opt), fn),
			tapPromise: (opt: Tap, fn: Parameters<IHook<T, Result>['tapPromise']>[1]) => this.tapPromise(mergeOptions(opt), fn),
			intercept: (interceptor: HookInterceptor) => this.intercept(interceptor),
			isUsed: () => this.isUsed(),
			withOptions: (opt: Partial<Tap> | string) => this.withOptions(mergeOptions(opt))
		};
	}

	isUsed() {
		return this.taps.length > 0 || this.interceptors.length > 0;
	}

	intercept(interceptor: HookInterceptor) {
		this.interceptors.push(Object.assign({}, interceptor));
		if (interceptor.register) {
			for (let i = 0; i < this.taps.length; i++) {
				let tap = interceptor.register(this.taps[i]);
				if (tap) {
					this.taps[i] = tap
				}
			}
		}
	}
	callIntercept(type: HookInterceptorFnNames, args: any[] = [], context?: any) {
		if (this.interceptors.length <= 0) {
			return
		}
		for (const interceptor of this.interceptors) {
			if (interceptor[type] && typeof interceptor[type] === 'function') {
				if (interceptor.context && context) {
					(interceptor[type] as any)(context, ...args)
				} else {
					(interceptor[type] as any)(...args)
				}
			}
		}
	}
	protected needContext() {
		return this.taps.some(tap => tap.context !== undefined)
	}
	protected _insert(item: Tap) {
		let before;
		if (typeof item.before === "string") {
			before = new Set([item.before]);
		} else if (Array.isArray(item.before)) {
			before = new Set(item.before);
		}
		let stage = 0;
		if (typeof item.stage === "number") {
			stage = item.stage;
		}
		let i = this.taps.length;
		while (i > 0) {
			i--;
			const x = this.taps[i];
			this.taps[i + 1] = x;
			const xStage = x.stage || 0;
			if (before) {
				if (before.has(x.name!)) {
					before.delete(x.name!);
					continue;
				}
				if (before.size > 0) {
					continue;
				}
			}
			if (xStage > stage) {
				continue;
			}
			i++;
			break;
		}
		this.taps[i] = item;
	}
	callTapsSeries(type: CallActionType, args: T, callback: HookAsyncCallback<Result>) {
		const needContext = this.needContext();
		const context = needContext ? {} : undefined;

		this.callIntercept('call', args, needContext ? context : undefined)

		const taps = this.taps, tapLen = taps.length;
		let currentIndex = 0
		const onError = (err?: any) => {
			if (err) {
				this.callIntercept('error', args, context ? context : undefined)
				callback(err)
				return true
			}
			return false
		}
		const onComplete = (result?: Result) => {
			if (currentIndex >= tapLen || ((type === 'Bail' || type === 'Loop') && result !== undefined)) {
				if (type == 'Waterfall') {
					result = args[0]
				}
				if (result !== undefined) {
					this.callIntercept('result', [result], context ? context : undefined)
				} else {
					this.callIntercept('done')
				}
				callback(null, type == 'Normal' ? undefined : result)
				return true
			}
			return false
		}
		const nextTap = (err: any, result?: Result) => {
			if (onError(err)) {
				return
			}
			if (type == 'Loop' && result !== undefined) {
				currentIndex = 0
				nextTap(null)
				return
			}
			if (type === 'Waterfall' && result !== undefined) {
				args[0] = result
			}
			if (onComplete(result)) {
				return
			}

			const tap = taps[currentIndex]
			if (currentIndex === 0 && type == 'Loop') {
				this.callIntercept('loop', args, needContext ? context : undefined)
			}
			this.callIntercept('tap', [tap], context ? context : undefined)
			currentIndex++
			try {
				switch (tap.type) {
					case 'sync':
						if (tap.context) {
							result = tap.fn(context, ...args)
						} else {
							result = tap.fn(...args)
						}
						break
					case 'async':
						if (tap.context) {
							tap.fn(context, ...[...args, nextTap])
						} else {
							tap.fn(...[...args, nextTap])
						}
						return

					case 'promise':
						let _promise: Promise<Result>
						if (tap.context) {
							_promise = tap.fn(context, ...args)
						} else {
							_promise = tap.fn(...args)
						}
						if (_promise && typeof _promise.then === 'function' && typeof _promise.catch === 'function') {
							_promise.then(result => {
								nextTap(null, result)
							}).catch(e => {
								nextTap(e)
							})
						} else {
							nextTap(`Tap function (tapPromise) did not return promise (returned ' + _promise${currentIndex} + ')');\n`)
						}
						return

				}

			} catch (e) {
				nextTap(e)
				return
			}
			nextTap(null, result)
		}
		nextTap(null)

	}

	callTapsLooping(args: T, callback: HookAsyncCallback<Result>) {
		this.callTapsSeries('Loop', args, (err, result) => {
			if (err) {
				callback(err)
				return
			}
			callback()
		})
	}
	callTapsParallel(type: CallActionType,maxParallel:number, args: T, callback: HookAsyncCallback<Result>) {
		if (this.taps.length <= 1) {
			this.callTapsSeries(type, args, callback)
			return
		}
		let taskCount = this.taps.length, taps = this.taps
		let currentIndex = 0
		let executeTaskCount=taskCount
		let allResult = new Array(taskCount)

		const needContext = this.needContext();
		const context = needContext ? {} : undefined;

		this.callIntercept('call', args, needContext ? context : undefined)

		let executeCompleted=false
		const onError = (err?: any) => {
			if(executeCompleted){
				return
			}
			this.callIntercept('error', args, context ? context : undefined)
			callback(err)
			executeCompleted=true
		}
		const onComplete = (result?: Result) => {
			if(executeCompleted){
				return
			}
			if (type == 'Waterfall') {
				result = args[0]
			}
			if (result !== undefined) {
				this.callIntercept('result', [result], context ? context : undefined)
			} else {
				this.callIntercept('done')
			}
			callback(null, type == 'Normal' ? undefined : result)
			executeCompleted=true
		}
	
		const tapCallbackHandle = (index:number) => {
			return (err?:any,result?:any)=>{
				if(executeCompleted){
					return
				}
				allResult[index]={err,result}
				executeTaskCount--
				if(err){
					onError(err)
					return
				}
			
				if(type=='Bail'&&result!==undefined){
					onComplete(result)
					return
				}
				if(executeTaskCount<=0){
					onComplete(result)
					return
				}
			}
		}
		const onStepTask = (index: number) => {
			let tap = taps[index]
			let result;
				this.callIntercept('tap', [tap], context ? context : undefined)
				try {
					switch (tap.type) {
						case 'sync':
							if (tap.context) {
								result = tap.fn(context, ...args)
							} else {
								result = tap.fn(...args)
							}
							tapCallbackHandle(index)(null,result)
							break
						case 'async':
							if (tap.context) {
								tap.fn(context, ...[...args, tapCallbackHandle(index + 1)])
							} else {
								tap.fn(...[...args, tapCallbackHandle(index)])
							}
							return

						case 'promise':
							let _promise: Promise<Result>
							if (tap.context) {
								_promise = tap.fn(context, ...args)
							} else {
								_promise = tap.fn(...args)
							}
							if (_promise && typeof _promise.then === 'function' && typeof _promise.catch === 'function') {
								_promise.then(result => {
									tapCallbackHandle(index)(null,result)
								}).catch(e => {
									onError(e)
								})
							} else {
								onError(`Tap function (tapPromise) did not return promise (returned ' + _promise${currentIndex} + ')');\n`)
							}
							return

					}

				} catch (e) {
					onError(e)
					return
				}
				tapCallbackHandle(index)(null, result)
		}
		const executeParallelTask = () => {
			let i = 0
			while (i < maxParallel &&taskCount>0) {
				onStepTask(currentIndex + i)
				i++
				taskCount--
			}
			currentIndex += i
		}
		executeParallelTask()

	}
}

export default Hook

