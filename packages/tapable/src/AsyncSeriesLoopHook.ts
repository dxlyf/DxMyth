
import Hook from "./Hook"
import { HookAsyncCallback } from "./types";

 class AsyncSeriesLoopHook<T extends any[],Result> extends Hook<T,Result|undefined> {
	constructor(name?: string) {
		super(name);
	}
	call(..._args:T):Result|undefined {
		throw new Error("Method not implemented.");
	}
	callAsync(..._args: [...T, HookAsyncCallback<Result|undefined>]): void {
		 let cb=_args.pop()!
		 this.callTapsLooping(_args as any,cb)
	}
	promise(..._args: T): Promise<Result|undefined> {
		return new Promise((resolve,reject)=>{
			this.callTapsLooping(_args,(err,res:Result|undefined)=>{
				if(err){
					reject(err)
					return
				}
				resolve(res)
			})
		})
	}

}
export default AsyncSeriesLoopHook;
