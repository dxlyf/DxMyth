
import Hook from "./Hook"
import { HookAsyncCallback } from "./types";

 class AsyncParallelHook<T extends any[],Result> extends Hook<T,Result|undefined> {
	maxParallel:number=10
	constructor(name?: string) {
		super(name);
	}
	call(..._args:T):Result|undefined {
		throw new Error("call is not supported on a AsyncSeriesBailHook");
	}
	callAsync(..._args: [...T, HookAsyncCallback<Result|undefined>]): void {
		 let cb=_args.pop()!
		 this.callTapsParallel('Normal',this.maxParallel,_args as any,cb)
	}
	promise(..._args: T): Promise<Result|undefined> {
		return new Promise((resolve,reject)=>{
			this.callTapsParallel('Normal',this.maxParallel,_args,(err,res:Result|undefined)=>{
				if(err){
					reject(err)
					return
				}
				resolve(res)
			})
		})
	}
}
export default AsyncParallelHook;
