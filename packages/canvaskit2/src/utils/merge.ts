/**
 * 深度合并对象。
 *
 * 将 sources 中的可枚举属性递归合并到 target 上。
 *
 * 合并规则：
 * - 普通对象（plain object）与数组递归深度合并；
 * - 其他类型（Date、RegExp、原始值等）直接赋值替换；
 * - source 中值为 undefined 的属性不覆盖 target。
 *
 * @param target - 目标对象
 * @param sources - 来源对象列表（后面的优先级更高）
 * @returns 合并后的 target
 */
export function merge<T extends Record<string, any>>(target: T, ...sources: any[]): T {
    
    for (const source of sources) {
        deepMerge(target, source)
    }
    return target
}

function deepMerge(target: any, source: any): void {
    if (source == null || typeof source !== 'object') {
        return target
    }
    for (const key of Object.keys(source)) {
        const val = source[key]
        const targetVal = target[key]
        if (Array.isArray(targetVal) && Array.isArray(val)) {
            target[key] = deepMerge(targetVal, val)
        } if (isPlainObject(targetVal) && isPlainObject(val)) {
            target[key] = deepMerge(targetVal, val)
        } else if (Array.isArray(val)) {
            target[key] = deepMerge([], val)
        } else if (isPlainObject(val)) {
            target[key] = deepMerge({}, val)
        } else if (val !== undefined) {
            // 原始值、TypedArray（Color/Matrix2D）、Date、RegExp、类实例等直接引用赋值
            // 注意：undefined 不覆盖 target（保持 "source 中值为 undefined 的属性不覆盖" 语义）
            target[key] = val
        }
    }
    return target
}

export function isPrimitive(value: any): boolean {
    // return !(value!==null&&typeof value==='object')
    const type = typeof value
    return value!==null&&(type!=='object'&&type!=='undefined')
}
function isPlainObject(value: unknown): value is Record<string, any> {
    return Object.prototype.toString.call(value)==='[object Object]'
}
