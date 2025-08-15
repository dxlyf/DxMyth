
import Hook from "./Hook"
import { HookAsyncCallback } from "./types";

 class SyncLoopHook<T extends any[],Result> extends Hook<T,Result|undefined> {
	constructor(name?: string) {
		super(name);
	}
	call(..._args:T):Result|undefined {
		let result;
		this.callTapsLooping(_args,(err,res)=>{
			if(err) throw err
			result = res
		})
		return result
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
	tapAsync(): void {
		throw new Error("tapAsync is not supported on a SyncHook");
	}
	tapPromise(): void {
		throw new Error("tapPromise is not supported on a SyncHook");
	}
}
export default SyncLoopHook;
