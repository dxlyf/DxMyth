
const valueStack:any[]=[]
let index=-1
export type StackCursor<T>={
    current:T
}
export const createCursor=<T>(defaultValue:T):StackCursor<T>=>{
    return {
        current:defaultValue
    }
}
export const push=<T>(cursor:StackCursor<T>,value:T)=>{
    valueStack[++index]=cursor.current
    cursor.current=value
}
export const pop=<T>(cursor:StackCursor<T>)=>{
    if(index<0){
        return
    }
    cursor.current=valueStack[index]
    valueStack[index]=null
    index--
}