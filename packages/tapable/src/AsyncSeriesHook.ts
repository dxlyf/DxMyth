
import Hook from "./Hook"
import { HookAsyncCallback } from "./types";

class AsyncSeriesHook<T extends any[]> extends Hook<T, void> {
	constructor(name?: string) {
		super(name);
	}
	call(..._args: T) {
		throw new Error("call is not supported on a AsyncSeriesHook");
	}
	callAsync(..._args: [...T, HookAsyncCallback<void>]): void {
		 let cb=_args.pop()!
		 this.callTapsSeries('Normal',_args as any,cb)
	}
	promise(..._args: T): Promise<void> {
		return new Promise((resolve,reject)=>{
			this.callTapsSeries('Normal',_args,(err,res)=>{
				if(err){
					reject(err)
					return
				}
				resolve(res)
			})
		})
	}
}
export default AsyncSeriesHook;
