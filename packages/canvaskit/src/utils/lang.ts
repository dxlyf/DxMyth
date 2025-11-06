const callBind = Function.prototype.bind.bind(Function.prototype.call)

const primativeType = new Set(['string', 'bigint', 'number', 'boolean', 'symbol', 'undefined'])
export const toFunctionString = callBind(Function.prototype.toString)
export const hasOwnProperty = callBind(Object.prototype.hasOwnProperty);
export const toObjectType = callBind(Object.prototype.toString)
export const ObjectNativeFunctionString = toFunctionString(Object)
export const keys = Object.keys
export const isArray = Array.isArray
export const fromArray = Array.from
export const entries = Object.entries
export const assign = Object.assign

export const getType = (value: any) => {
    return toObjectType(value).slice(8, -1)
}
export const isObjectLike = (value: any) => {
    return value !== null && typeof value === 'object'
}
export const isObject = (value: any) => {
    return getType(value) === 'Object'
}
export const isPlainObject = (value: any) => {
    if (!isObject(value)) {
        return false
    }
    const proto = Object.getPrototypeOf(value)
    if (!proto) {
        return true // 如果为null,应该是Object.create(null)
    }
    const constructor = proto.constructor
    if (!constructor) {
        return true
    }
    return toFunctionString(constructor) === ObjectNativeFunctionString
}
export const isBoolean = (value: any) => {
    return typeof value === 'boolean'
}
export const isString = (value: any) => {
    return typeof value === 'string'
}
export const isNumber = (value: any) => {
    return typeof value === 'number' || typeof value === 'bigint'
}
export const isSymbol = (value: any) => {
    return typeof value === 'symbol'
}
export const isBigint = (value: any) => {
    return typeof value === 'bigint'
}
export const isFunction = (value: any) => {
    return typeof value === 'function'
}
export const isGeneratorFunction = (value: any) => {
    return getType(value) === 'GeneratorFunction'
}
export const isAsyncFunction = (value: any) => {
    return getType(value) === 'AsyncFunction'
}
export const isNull = (value: any) => {
    //return getType(value)==='Null'
    return value === null
}
export const isUndefined = (value: any) => {
    return typeof value === 'undefined'
}
export const isNullOrUndefined = (value: any) => {
    return value === null || value === undefined
}
export const isPromise = (value: any) => {
    return getType(value) === 'Promise'
}
export const isPromiseLike = (value: any) => {
    return getType(value) === 'Promise' || isFunction(value.then)
}
export const isRegExp = (value: any) => {
    return getType(value) === 'RegExp'
}
// 原始值类型
export const isPrimitive = (value: any) => {
    const type = typeof value
    return value === null || type !== 'object' && type !== 'function'
}
export const isArrayLike = (value: any) => {
    return typeof value.length === 'number'
}
export const has = (target: any, key: any) => {
    return Reflect.has(target, key)
}
export const defaults = (target: any, ...sources: any[]) => {
    for (let source of sources) {
        const keys = Object.keys(source)
        for (let key of keys) {
            const srcValue = source[key]
            const objValue = target[key]
            const objValueType = getType(objValue)
            const srcValueType = getType(srcValue)
            if (objValueType === 'Null' || objValueType === 'undefined') {
                if (srcValueType === 'Object') {
                    target[key] = merge({}, srcValue)
                } else if (srcValueType === 'Array') {
                    target[key] = merge([], srcValue)
                } else {
                    target[key] = srcValue
                }
            }
        }
    }
    return target
}
export const merge = (target: any, ...sources: any[]) => {
    for (let source of sources) {
        if(!isObjectLike(source)){
            continue;
        }
        const keys = Object.keys(source)
        for (let key of keys) {
            const srcValue = source[key]
            const objValue = target[key]
            if (isPlainObject(srcValue)) {
                target[key] = merge(isObject(objValue)? objValue : {}, srcValue)
            } else if (isArray(srcValue)) {
                target[key] = merge(Array.isArray(objValue)? objValue : [], srcValue)
            } else {
                target[key] = srcValue
            }
        }
    }
    return target
}