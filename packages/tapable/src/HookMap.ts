/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

import { HookInterceptor, IHook } from "./types";


const defaultFactory = (key:any, hook:IHook<any>) => hook;

class HookMap<T extends any[],R> {
	_map:Map<any,IHook<T,R>>
	name?:string
	_factory:(key:any)=>IHook<T,R>
	_interceptors:HookInterceptor[]
	constructor(factory:(key:any)=>IHook<T,R>, name?:string) {
		this._map = new Map();
		this.name = name;
		this._factory = factory;
		this._interceptors = [];
	}

	get(key:any) {
		return this._map.get(key);
	}

	for(key:any) {
		const hook = this.get(key);
		if (hook !== undefined) {
			return hook;
		}
		let newHook = this._factory(key);
		const interceptors = this._interceptors;
		for (let i = 0; i < interceptors.length; i++) {
			let interceptor = interceptors[i];
			if(interceptor.factory){
				newHook = interceptor.factory(key, newHook as IHook<any>) as IHook<T,R>;
			}
		}
		this._map.set(key, newHook);
		return newHook;
	}

	intercept(interceptor:HookInterceptor) {
		this._interceptors.push(
			Object.assign(
				{
					factory: defaultFactory
				},
				interceptor
			)
		);
	}
}

export default  HookMap;
