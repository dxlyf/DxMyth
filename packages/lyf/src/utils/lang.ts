const emptyObject={}
// const bindPrototypeFunction=Function.prototype.bind.bind(Function.prototype.call)
//什么时候该用 Object.prototype.toString？
//跨源/跨领域（Cross-realm）检测
const getType=Function.prototype.call.bind(Object.prototype.toString)

const isString=(value:any)=>{
  return typeof value==='string'
}
const isNumber=(value:any)=>{
  return typeof value==='number'
}
const isBigInt=(value:any)=>{
  return typeof value==='bigint'
}
const isBoolean=(value:any)=>{
  return typeof value==='boolean'
}
const isSymbol=(value:any)=>{
  return typeof value==='symbol'
}
const isNull=(value:any)=>{
  return value===null
}
const isUndefined=(value:any)=>{
  return value===undefined
}
const isNullOrUndefined=(value:any)=>{
  return value===null||value===undefined
}
const isNaN=(value:any)=>{
  return Number.isNaN(value)
}
const isArray=(value:any)=>{
  return Array.isArray(value)
}
const isRegExp=(value:any)=>{
  return value instanceof RegExp
}
const isDate=(value:any)=>{
  return value instanceof Date
}
const isError=(value:any)=>{
  return value instanceof Error
}
const isMap=(value:any)=>{
  return value instanceof Map
}
const isSet=(value:any)=>{
  return value instanceof Set
}
const isWeakMap=(value:any)=>{
  return value instanceof WeakMap
}
const isWeakSet=(value:any)=>{
  return value instanceof WeakSet
}
const isFunction=(value:any)=>{
  return typeof value==='function'
}
const isObjectLike=(value:any)=>{
  return value!==null&&typeof value==='object'
}
const isObject=(value:any)=>{
  return getType(value)==='[object Object]'
}
const isPlainObject=(value:any)=>{
  if(!isObject(value)){
    return false
  }
  const proto=Object.getPrototypeOf(value)
  if(proto===null){
    return true
  }
  return proto===Object.prototype
}
const isPromise=(value:any)=>{
  return value instanceof Promise
}
const isPrimitive=(value:any)=>{
  if (value === null){
    return true;
  }
  const type = typeof value;
  return type !== 'object' && type !== 'function';
 // return isString(value)||isNumber(value)||isBoolean(value)||isNull(value)||isUndefined(value)||isSymbol(value)||isBigInt(value)
}
const isFiniteNumber=(value:any)=>{
    return Number.isFinite(value)
}


export {
    isFiniteNumber,
    isBigInt,
    isPromise,
    isPrimitive,
    isString,
    isNumber,
    isBoolean,
    isSymbol,
    isNull,
    isUndefined,
    isNullOrUndefined,
    isNaN,
    isArray,
    isRegExp,
    isDate,
    isError,
    isMap,
    isSet,
    isWeakMap,
    isWeakSet,
    isFunction,
    isObjectLike,
    isObject,
    isPlainObject,
}