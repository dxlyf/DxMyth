export * from './lang'
export function allIsFinite(...values:any[]){
    return values.every(v=>Number.isFinite(v))
}