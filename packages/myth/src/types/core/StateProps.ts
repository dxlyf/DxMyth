export type IStateProp<T,Context=any>={
    name:string
    context:Context
    getDefault():T
    equals(a:T,b:T):boolean
    shouldUpdate(a:T,b:T):boolean
    set(value:T):boolean
    get():T
}
export type StatePropOptions<T,Context=any>={
    name?:string
    getDefault(this:IStateProp<T,Context>):T
    equals?(a:T,b:T):boolean
    shouldUpdate?(a:T,b:T):boolean
    set?(this:IStateProp<T,Context>,value:T):void
    get():T
}