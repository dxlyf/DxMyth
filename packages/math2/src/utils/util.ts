
type Path = (string | number)[]
export const isObject = (obj: any) => {
    return typeof obj === 'object' && obj !== null
}
export const isArray = (arr: any) => {
    return Array.isArray(arr)
}
export const isNullOrUndefined = (val: any) => {
    return val === null || val === undefined
}
export const isPrimitive = (val: any) => {
    return typeof val !== 'object' && typeof val !== 'function'
}
export const hasOwn = (obj: any, key: string) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
}
export const setPathValue = (obj: any, path: Path, value: any) => {
    if(!isObject(obj) || path.length === 0){
        return
    }
    let current = obj, len = path.length - 1
    for (let i = 0; i < len; i++) {
        const key = path[i]
        if (!isObject(current[key])) {
            current[key] = typeof path[i + 1] === 'number' ? [] : {}
        }
        current = current[key]
    }
    current[path[len]] = value
}
export const getPathValue = (obj: any, path: Path,defaultValue?:any) => {
    if(!isObject(obj) || path.length === 0){
        return defaultValue
    }
    let current = obj, len = path.length - 1
    for (let i = 0; i < len; i++) {
        const key = path[i]
        if (!isObject(current[key])) {
            return defaultValue
        }
        current = current[key]
    }
    return current[path[len]]??defaultValue
}