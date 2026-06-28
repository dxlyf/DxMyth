
export const isObject = (value: any): value is Record<string, any> => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export const isObjectLike = (value: any): value is Record<string, any> => {
    return value !== null && typeof value === 'object'
}

export const isPlainObject = (value: any): value is Record<string, any> => {
    if (typeof value !== 'object' || value === null) return false
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}

export const isArray = Array.isArray

export const isPrimitive = (value: any): value is string | number | boolean | null | undefined | symbol | bigint => {
    if (value === null) return true
    const type = typeof value
    return type !== 'object' && type !== 'function'
}

export const isString = (value: any): value is string => {
    return typeof value === 'string'
}

export const isNumber = (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value)
}

export const isInteger = (value: any): value is number => {
    return typeof value === 'number' && Number.isInteger(value)
}

export const isFunction = (value: any): value is Function => {
    return typeof value === 'function'
}

export const isDate = (value: any): value is Date => {
    return value instanceof Date && !isNaN(value.getTime())
}

export const isRegex = (value: any): value is RegExp => {
    return value instanceof RegExp
}

export const isNull = (value: any): value is null => {
    return value === null
}

export const isUndefined = (value: any): value is undefined => {
    return value === undefined
}

/** @alias isUndefined */
export const isUndef = isUndefined

export const isNullOrUndefined = (value: any): value is null | undefined => {
    return value == null
}

/** 将路径字符串或数组规范化为键名数组 */
const toPath = (path: string | string[]): string[] => {
    if (Array.isArray(path)) return path
    // 支持 a.b.c 和 a[0].b 两种写法
    return path.replace(/\[(\d+)\]/g, '.$1').split('.')
}

/**
 * 按路径深度获取嵌套对象的值，路径上的中间节点不存在时返回 defaultValue。
 * 类似 lodash.get。
 *
 * @example
 * get({ a: { b: [{ c: 1 }] } }, 'a.b.0.c') // 1
 * get({ a: { b: 1 } }, 'a.c', 'fallback')  // 'fallback'
 */
export const get = (obj: any, path: string | string[], defaultValue?: any): any => {
    const keys = toPath(path)
    let current = obj
    for (let i = 0; i < keys.length; i++) {
        if (current == null || typeof current !== 'object') return defaultValue
        current = current[keys[i]]
    }
    return current !== undefined ? current : defaultValue
}

/**
 * 按路径深度设置嵌套对象的值，路径上的中间节点会自动创建。
 * 类似 lodash.set。
 *
 * @example
 * const obj = {}
 * set(obj, 'a.b.0.c', 1)
 * // obj -> { a: { b: [{ c: 1 }] } }
 */
const isNumericRegex = /^\d+$/
export const set = (obj: any, path: string | string[], value: any): void => {
    const keys = toPath(path)
    let current = obj
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        const nextKey = keys[i + 1]
        const isNextNumeric =isNumericRegex.test(nextKey)
        if (current[key] == null) {
            // 当下一个键是数字索引时创建数组，否则创建对象
            current[key] = isNextNumeric ? [] : {}
        } else if (typeof current[key] !== 'object') {
            current[key] = isNextNumeric ? [] : {}
        }
        current = current[key]
    }
    current[keys[keys.length - 1]] = value
}
