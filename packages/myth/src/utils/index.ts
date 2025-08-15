export function defaults(obj: any, ...defaults: any[]) {
    for (let i = 0; i < defaults.length; i++) {
        const def = defaults[i]
        Object.keys(def).forEach((key) => {
            if (!obj.hasOwnProperty(key)) {
                obj[key] = def[key]
            }
        })
    }
    return obj
}
export function assign(obj: any, ...sources: any[]): any {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i]
        Object.keys(source).forEach((key) => {
            obj[key] = source[key]
        })
    }
    return obj
}
const primitiveMap = new Set(['string', 'undefined', 'boolean', 'number', 'bigint', 'symbol'])
export function isPrimitive(value: any): boolean {
    // return !(value!==null&&typeof value==='object')
    const type = typeof value
    return type === null || primitiveMap.has(type)
}
export function getType(value: any): string {
    return Object.prototype.toString.call(value).slice(8, -1)
}
export function isObjectLike(value: any): boolean {
    return value !== null && (typeof value === 'object' || typeof value === 'function')
}
export function isArray(value: any): boolean {
    return Array.isArray(value)
}

export function assignDeep(obj: any, ...sources: any[]): any {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i]
        Object.keys(source).forEach((key) => {
            let objValue = obj[key]
            let srcValue = source[key]
            if (srcValue === undefined || srcValue === obj[key]) {
                return
            }
            if (!obj.hasOwnProperty(key) || isPrimitive(srcValue)) {
                obj[key] = srcValue
            } else if (isArray(srcValue)) {
                obj[key] = assignDeep(isArray(objValue) ? objValue : [], srcValue)
            } else if (isObjectLike(srcValue)) {
                obj[key] = assignDeep(isObjectLike(objValue) ? objValue : {}, srcValue)
            }
        })
    }
    return obj
}
type AssignDeepCallback = (objValue: any, srcValue: any, key: string,keyPath:string[], obj: any, source: any) => any;

export function assignDeepWith(obj: any, sources: any[], callback?: AssignDeepCallback,keyPath?:string[]): any {

    keyPath=keyPath||[]
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i]
        Object.keys(source).forEach((key) => {
            let objValue = obj[key]
            keyPath.push(key)
            let srcValue = callback ? callback(objValue, source[key], key,keyPath, obj, source) : source[key]
            keyPath.pop()
            if (srcValue === undefined || srcValue === obj[key]) {
                return
            }
            if (!obj.hasOwnProperty(key) || isPrimitive(srcValue)) {
                obj[key] = srcValue
            } else if (isArray(srcValue)) {
                obj[key] = assignDeepWith(isArray(objValue) ? objValue : [], [srcValue],callback,keyPath)
            } else if (isObjectLike(srcValue)) {
                obj[key] = assignDeepWith(isObjectLike(objValue) ? objValue : {}, [srcValue],callback,keyPath)
            }
        })
    }
    return obj
}
export function merge(obj: any, ...sources: any[]): any {
    return assignDeepWith(obj, sources)
}
type Constructor<T = {}> = new (...args: any[]) => T;
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== "constructor") {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
