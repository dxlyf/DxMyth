
import Hook from "./Hook"
import { HookAsyncCallback } from "./types";

class SyncHook<T extends any[]> extends Hook<T, void> {
	constructor(name?: string) {
		super(name);
	}
	call(..._args: T) {
		this.callTapsSeries('Normal',_args,(err)=>{
			if(err){
				throw err;
			}
		})
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
	tapAsync(): void {
		throw new Error("tapAsync is not supported on a SyncHook");
	}
	tapPromise(): void {
		throw new Error("tapPromise is not supported on a SyncHook");
	}
}
export default SyncHook;
