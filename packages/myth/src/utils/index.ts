export function defaults(obj:any, ...defaults:any[]) {
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
export function assign(obj:any, ...sources:any[]): any {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i]
        Object.keys(source).forEach((key) => {
            obj[key] = source[key]
        })
    }
    return obj
}
const primitiveMap=new Set(['string','undefined','boolean','number','bigint','symbol'])
export function isPrimitive(value:any): boolean {
   // return !(value!==null&&typeof value==='object')
    const type=typeof value
    return type===null||primitiveMap.has(type)
}
export function getType(value:any): string {
    return Object.prototype.toString.call(value).slice(8, -1)
}
export function isObjectLike(value:any): boolean {
    return value!==null&&typeof value==='object'
}
export function isArray(value:any): boolean {
    return Array.isArray(value)
}
export function merge(obj:any, ...sources:any[]): any {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i]
        Object.keys(source).forEach((key) => {
            let srcValue=source[key]
            if(srcValue===undefined){
                return
            }
            if (!obj.hasOwnProperty(key)||isPrimitive(srcValue)) {
                obj[key] = srcValue
            } else if(isArray(srcValue)){
                obj[key]=merge(isArray(obj[key])?obj[key]:[], srcValue)
            }else if(isObjectLike(srcValue)){
                obj[key]=merge(isObjectLike(obj[key])?obj[key]:{}, srcValue)
            }
        })
    }
    return obj
}
type Constructor<T = {}> = new (...args: any[]) => T;
export function applyMixins(derivedCtor:any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        if (name !== "constructor") {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });
}
