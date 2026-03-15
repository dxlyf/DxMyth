import {isPlainObject,isArray,isPrimitive,isUndefined} from './lang'

type MergeContext={
    target:any,
    source:any,
    key:string,
    objValue:any,
    srcValue:any,
    path:string
    merge:(context:MergeContext)=>any
}
const _mergeWith=(target:any,source:any,merge:(context:MergeContext)=>any,parentContext:MergeContext=null)=>{
    if(isArray(source)){
        for(const [name,value] of source){
            const context:MergeContext={
                target:target,
                source,
                key:name,
                objValue:target[name],
                srcValue:value,
                path:parentContext?parentContext.path+`[${name}]`:`[${name}]`,
                merge,
            }
            merge(context)
        }
    }else if(isPlainObject(source)){
        for(const [name,value] of Object.entries(source)){
            const context:MergeContext={
                target:target,
                source,
                key:name,
                objValue:target[name],
                srcValue:value,
                path:parentContext?parentContext.path+`.${name}`:name,
                merge,
            }
           merge(context)
        }
    }
    return target
}
const handleShallowMerge=(context:MergeContext)=>{
    // 如果是undefined不合并
    if(isUndefined(context.srcValue)){
        return
    }
    context.target[context.key]=context.srcValue
}
const handleDeepMerge=(context:MergeContext)=>{
    const {target,source,key,objValue,srcValue,path}=context
     // 如果是undefined不合并
    if(isUndefined(srcValue)){
        return
    }
    if(isPrimitive(srcValue)){
        context.target[context.key]=srcValue
    }
    else if(isArray(srcValue)){
        context.target[context.key]=_mergeWith(isArray(objValue)?objValue:[] ,srcValue,context.merge,context)
    }
    else if(isPlainObject(srcValue)){
        context.target[context.key]=_mergeWith(isPlainObject(objValue)?objValue:{} ,srcValue,context.merge,context)
    }
}
const handleDeepMergeConfig=(context:MergeContext)=>{
    const {target,source,key,objValue,srcValue,path}=context
     // 如果是undefined不合并
    if(isUndefined(srcValue)){
        return
    }
    if(isPrimitive(srcValue)){
        context.target[context.key]=srcValue
    }
    else if(isArray(srcValue)){
        context.target[context.key]=(isArray(objValue)?objValue:[]).concat(srcValue)
        //context.target[context.key]=_mergeWith(isArray(objValue)?objValue:[] ,srcValue,context.merge,context)
    }
    else if(isPlainObject(srcValue)){
        context.target[context.key]=_mergeWith(isPlainObject(objValue)?objValue:{} ,srcValue,context.merge,context)
    }
}
const handleDefault=(context:MergeContext)=>{
    // 如果是objValue存在值不合并
    if(!isUndefined(context.objValue)){
        return
    }
    context.target[context.key]=context.srcValue
}
const handleDeepDefaults=(context:MergeContext)=>{
    const {target,source,key,objValue,srcValue,path}=context
     // 如果是objValue存在值不合并
    if(isPrimitive(objValue)&&!isUndefined(objValue)){
        return
    }
    if(isPrimitive(srcValue)){
        context.target[context.key]=srcValue
    }
    else if(isArray(srcValue)){
        context.target[context.key]=_mergeWith(isArray(objValue)?objValue:[] ,srcValue,context.merge,context)
    }
    else if(isPlainObject(srcValue)){
        context.target[context.key]=_mergeWith(isPlainObject(objValue)?objValue:{} ,srcValue,context.merge,context)
    }
}
const defaults=(target:any,...sources:any[])=>{
    for(const source of sources){
        _mergeWith(target,source,handleDefault)
    }
    return target
}
const defaultsDeep=(target:any,...sources:any[])=>{
    for(const source of sources){
        _mergeWith(target,source,handleDeepDefaults)
    }
    return target
}
const merge=(target:any,...sources:any[])=>{
    const lastReducer=sources[0] 
    let length=sources.length
    let handle=handleShallowMerge
    if(typeof lastReducer==='function'){
        handle=(lastReducer as ReducerType)(handleShallowMerge)
        length--
    }
    for(let i=0;i<length;i++){
        _mergeWith(target,sources[i],handle)
    }
    return target
}
type ReducerType=(fn:(context:MergeContext)=>void)=>(context:MergeContext)=>void
const mergeDeep=(target:any,...sources:any[])=>{
    const lastReducer=sources[0] 
    let length=sources.length
    let handle=handleDeepMerge
    if(typeof lastReducer==='function'){
        handle=(lastReducer as ReducerType)(handleDeepMerge)
        length--
    }
    for(let i=0;i<length;i++){
        _mergeWith(target,sources[i],handle)
    }
    return target
}

const mergeConfig=(target:any,...sources:any[])=>{
    const lastReducer=sources[0] 
    let length=sources.length
    let handle=handleDeepMergeConfig
    if(typeof lastReducer==='function'){
        handle=(lastReducer as ReducerType)(handleDeepMergeConfig)
        length--
    }
    for(let i=0;i<length;i++){
        _mergeWith(target,sources[i],handle)
    }
    return target
}
export {
    mergeConfig,
    merge,
    mergeDeep,
    defaults,
    defaultsDeep,
}