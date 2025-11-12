export * from './lang'
export function allIsFinite(...values:any[]){
    return values.every(v=>Number.isFinite(v))
}
export function isValidPaintValue(value:any){
    return (value===null||value===undefined||value==='none')===false
}
