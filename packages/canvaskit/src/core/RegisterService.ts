


export type RegisterServiceType={
    register:(name:string,fn:()=>void)=>void
}


export function mixinRegisterService<T>(target:T){
    let classList=Object.create(null)
    // target.registerClass=function(name:string,clz:new(...args:any[])=>any){
    // target.register=function(name:string,clz){
        
    // }
    return ()=>{
        classList=null
    }
}