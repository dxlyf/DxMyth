
import {fastDeepEqual} from '@dxyl/utils'
import {StatePropOptions,IStateProp} from 'src/types/core/StateProps.ts'

export class StateProp<T,Context=any> implements IStateProp<T,Context>{
    name:string
    current:T
    options:StatePropOptions<T,Context>
    context:Context
    constructor(context:Context,options:StatePropOptions<T,Context>){
        this.context=context
        this.name=options.name||''
        this.options=options
        this.current=this.getDefault()
    
    }
   
    getDefault(): T {
        return this.options.getDefault.call(this)
    }
    equals(a: T, b: T): boolean {
        if(this.options.equals){
            return this.options.equals(a,b)
        }
        return fastDeepEqual(a,b)
    }
    shouldUpdate(a:T,b:T):boolean{
        if(this.options.shouldUpdate){
            return this.options.shouldUpdate(a,b)
        }
        return !this.equals(a,b)
    }
    get(){
        return this.current
    }
    set(value:T){
        if(this.shouldUpdate(this.current,value)){
            this.options.set?.call(this,value)
            this.current=value
            return true
        }
        return false
    }
}
export type StatePropsOptions<T extends Record<string,unknown>,Context>={
    [P in keyof T]:StatePropOptions<T[P],Context>
}
type IStateProps<T extends Record<string,unknown>,Context>={
    [Key in keyof T]:StateProp<T[Key],Context>
}

export function createStateProps<T extends Record<string,unknown>,Context=any>(context:Context,options:StatePropsOptions<T,Context>):IStateProps<T,Context>{
    const result={} as IStateProps<T,Context>
    for(const key in options){
        result[key]=new StateProp(context,options[key])
    }
    return  result 
}
var a=createStateProps<{age:number}>({},{
    age:{
        getDefault(){
            return 10
        }
    }
} as const)

