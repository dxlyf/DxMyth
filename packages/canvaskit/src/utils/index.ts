export * from './lang'
export * from './clazz'
export * from './logger'
export * from './dom'
export function allIsFinite(...values:any[]){
    return values.every(v=>Number.isFinite(v))
}
export function isValidPaintValue(value:any){
    return (value===null||value===undefined||value==='none')===false
}

