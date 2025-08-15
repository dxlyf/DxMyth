/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

import Hook from "./Hook";
import { HookInterceptor,Tap } from "./types";

export class MultiHook {
	hooks:Hook<any>[];
	name?:string;
	constructor(hooks:Hook<any>[], name?:string) {
		this.hooks = hooks;
		this.name = name;
	}

	tap(options:Tap, fn:Parameters<Hook<any>['tap']>[1]) {
		for (const hook of this.hooks) {
			hook.tap(options, fn);
		}
	}

	tapAsync(options:Tap, fn:Parameters<Hook<any>['tapAsync']>[1]) {
		for (const hook of this.hooks) {
			hook.tapAsync(options, fn);
		}
	}

	tapPromise(options:Tap, fn:Parameters<Hook<any>['tapPromise']>[1]) {
		for (const hook of this.hooks) {
			hook.tapPromise(options, fn);
		}
	}

	isUsed() {
		for (const hook of this.hooks) {
			if (hook.isUsed()) return true;
		}
		return false;
	}

	intercept(interceptor:HookInterceptor) {
		for (const hook of this.hooks) {
			hook.intercept(interceptor);
		}
	}

	withOptions(options:Partial<Tap>|string) {
		return new MultiHook(
			this.hooks.map(h => h.withOptions(options) as Hook<any>),
			this.name
		);
	}
}

export default MultiHook;
