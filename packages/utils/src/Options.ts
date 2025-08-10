
import deepEqual from './fast-deep-equal'


// type onEvent={
//     click:()=>void
//     mouseDown:()=>void
// }
// type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
//     ? `${T extends Capitalize<T> ? "-" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
//     : S;

// type KeysToSnakeCase<T extends { [K: string]: any }> = {
//     [Key in keyof T as CamelToSnakeCase<string & Key>]: T[Key];
// };
// type FirstUpper<T extends string>=T extends `${infer First}${string}`?Uppercase<First>:never
// type FirstUpperStr<T extends string>=T extends `${infer First}${infer S}`?`${Uppercase<First>}${S}`:never
// type MapEvent={
//     [Key in keyof onEvent as `on${FirstUpperStr<Key>}`]:onEvent[Key]
// }
// type MapEvent2=KeysToSnakeCase<onEvent>

export type OptionConfig<Context,Value>={
    overrideMethods?:Partial<IOption<Context,Value>>
    init?(this:IOption<Context,Value>):void
    default:Value|((ctx:Context)=>Value);
    set?(this:IOption<Context,Value>,v:Value,ctx:Context):void
    equal?(a:Value,b:Value):boolean
    dispose?(this:IOption<Context,Value>):void
    [key: string]: any
}
export interface IOption<Context,Value> {
    name:string
    fields?:{[key:string]:any}
    parent:Options<Context,any>
    context:Context
    current:Value
    dirty: boolean
    options:OptionConfig<Context,Value>
    equal(a:Value,b:Value):boolean
    default():Value
    reset():void
    set(v:Value):boolean
    get():Value
    dispose():void

}


export class Option<Context,Value> implements IOption<Context,Value> {
    name!:string
    fields?:{[key:string]:any}
    parent!:Options<Context,any>
    context:Context
    options!:OptionConfig<Context,Value>
    current!:Value
    dirty: boolean
    constructor(context:Context,options:OptionConfig<Context,Value>){
        this.context = context
        this.options=options
        this.current =this.default()
        this.dirty=true
        if(options.overrideMethods){
            Object.assign(this,options.overrideMethods)
        }
        this.options.init?.call(this)
    }
    equal(a:Value,b: Value): boolean {
        return deepEqual(a, b)
    }
    default():Value{
        return typeof this.options.default==='function'?(this.options.default as (ctx:Context)=>Value)(this.context):this.options.default
    }
    reset() { 
        this.set(this.default())
    }
    shouldUpdate(v:Value):boolean { 
        if(!this.dirty&&this.equal(this.current,v)){
            return false
        }
        return true
    }
    set(v:Value):boolean { 
        if(this.shouldUpdate(v)){
            this.options.set?.call(this,v,this.context)
            this.current = this.options.map
            this.dirty =false
            return true
        }
        return false
    }
    get():Value { return this.current }
    dispose(): void {
        this.options.dispose?.call(this)
    }
}

export type OptionsProperties<Context,Props>={
    [key in keyof Props]: OptionConfig<Context,Props[key]>
}
export type OptionsPropertiesInstance<Context,Props>={
    [key in keyof Props]: IOption<Context,Props[key]>
}
type OptionMap<Context,Props extends {}>=Map<keyof Props,IOption<Context,Props[keyof Props]>>
type OptionConstructor<Context,Props extends {}>=typeof Option<Context,Props[keyof Props]>
type OptionClassMap<Context,Props extends {}>=Map<keyof Props,OptionConstructor<Context,Props>>
export type OptionsInstance<Context,Props extends {}>=Options<Context,Props> & OptionsPropertiesInstance<Context,Props>
export class Options<Context, Props extends {}>  {
    static create<Context, Props extends {}>(
        context: Context,
        props: OptionsProperties<Context, Props>
      ): OptionsInstance<Context, Props>{
        return new Options(context, props) as any;
    }

    context:Context
    options:OptionMap<Context,Props> = new Map()
    optionClass:OptionClassMap<Context,Props> = new Map()
    constructor(context:Context,props?:OptionsProperties<Context,Props>) {
        this.context=context
        if(props){
            this.initOptions(props)
        }
        return new Proxy(this,{
            get(target,prop){
                if(target.options.has(prop as keyof Props)){
                    return target.getOption(prop as keyof Props)
                }
                return Reflect.get(target,prop)
            }
        })
    }
    
    register<K extends keyof Props>(name:K,optionClass:OptionConstructor<Context,Props>){
        this.optionClass.set(name,optionClass)
    }
    private defineGetter<K extends keyof Props>(key: K) {
        Object.defineProperty(this, key, {
          get: () => this.getOption(key),
          enumerable: true
        });
    }
    initOptions(props:OptionsProperties<Context,Props>){
        for(let key in props){
            if(this.optionClass.has(key)){
                const OptionClass=this.optionClass.get(key)!
                const option=new OptionClass(this.context,props[key])
                this.addOptionFromInstance(key,option)
            }else{
              this.addOptionFromConfig(key,props[key])    
            }
        }
    }
    getOption<K extends keyof Props>(key: K){
        return this.options.get(key) as IOption<Context,Props[K]>;
    }
    removeOption(key: keyof Props) {
        if(this.options.has(key)){
            this.options.get(key)!.dispose()
            this.options.delete(key)
        }
    }
    addOptionFromInstance(key: keyof Props, option:IOption<Context,Props[keyof Props]>) {
       if(!this.options.has(key)){
        option.parent=this
        option.name=key as string
        this.options.set(key, option);
       }

      //  this.defineGetter(key)
    }
    addOptionFromConfig(key: keyof Props, option: OptionConfig<Context,Props[Extract<keyof Props,string>]>) {
        this.addOptionFromInstance(key, new Option(this.context,option));
    }
}
// class GLContext{
//     gl:WebGL2RenderingContext
//     constructor(){
//         const canvas = document.createElement('canvas')
//         this.gl=canvas.getContext('webgl2')!
//     }
// }

// type GLOptions={
//     clearColor:[number,number,number,number]
// }
// let o= Options.create<GLContext,GLOptions>(new GLContext(),{
//     clearColor:{
//         default(){
//             return [0,0,0,1]
//         },
//         set(v){
//             const gl=this.context.gl
//             const parent=this.parent as OptionsInstance<GLContext,GLOptions>
 
//         }
//     }

// })
