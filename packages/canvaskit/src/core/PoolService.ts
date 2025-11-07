import type { GetArgs } from "src/types/Util"


export type PoolServiceOptions<T>={
    maxSize?:number /** 最大缓存数量 */
    initialSize?:number /** 初始缓存数量 */
    create:(...args:any[])=>T /** 创建缓存项 */
    init:(...args:any[])=>void /** 初始化缓存项 */
    reset?:(item:T)=>void /** 重置缓存项 */
    dispose?:(item:T)=>void /** 释放缓存项 */
}
export interface IPoolService<T,P=any>{
    _poolService:PoolService<T,P>
    getPool(...args:GetArgs<P>):T
    releasePool():void
    destroyPool():void
}

export const poolServiceSymbol='_poolService'
export const getPoolService=<T,P=any>(target:any)=>target[poolServiceSymbol] as PoolService<T,P>
/**
 * 为类添加缓存池服务
 * @param target 类构造函数
 * @param options 缓存池服务选项
 */
function mixinPoolService<T>(target:{new(...args:any[]):T},options:PoolServiceOptions<T>){
    const pool=new PoolService<T>(options);
    (target as any)[poolServiceSymbol]=pool;
    (target as any).getPool=pool.acquire.bind(pool)
    Object.assign(target.prototype,{
        releasePool:function(this:T){
            pool.release(this)
        },
        destroyPool:function(this:T){
            pool.disposeItem(this)
        }
    })
}
/**
 * 缓存池服务
 */
export class PoolService<T,P=any>{
    static mixin=mixinPoolService
    private options:PoolServiceOptions<T>
    private pools:T[]
    private createdCount:number=0
    private usedPool=new Set<T>()
    constructor(options:PoolServiceOptions<T>){
        this.options=Object.assign({
            maxSize:100,
            initialSize:0
        },options)
        this.pools=[]
        this.init()
    }
    init(){
        const initialSize=this.options.initialSize??0
        this.prepopulate(initialSize)
    }
    prepopulate(total: number): void
    {
        for (let i = 0; i < total&&this.createdCount<this.options.maxSize; i++)
        {
            this.pools.push(this.options.create())
            this.createdCount++
        }
    }
    acquire(...args:GetArgs<P>):T{
        let item:T;
        if(this.pools.length>0){
             item=this.pools.pop()
        }else{
           if(this.createdCount<this.options.maxSize){
             item=this.options.create(...args)
             this.createdCount++
           }else{
             console.log('超最大缓存数量,当前不会添加到usedPool')
             return this.options.create(...args)
           }
        }
        this.options.init(item,...args)
        this.usedPool.add(item)
        return item;
    }
    release(item:T){
        if(!this.usedPool.has(item)){
            console.warn('item,不在usedPool中,无法释放')
            return
        }
        this.options.reset?.(item)
        this.usedPool.delete(item)
        this.pools.push(item)
    }
    disposeItem(item:T){
        if(this.usedPool.has(item)){
            this.options.dispose?.(item)
            this.usedPool.delete(item)
            this.createdCount--
        }
    }
    [Symbol.dispose](){
        this.dispose()
    }
    dispose(){
        for(let item of this.usedPool){
            this.options.dispose?.(item)
        }
        this.usedPool.clear()   
        this.createdCount=this.pools.length
    }
    destroy(){
        this.dispose()
        for(let item of this.pools){
            this.options.dispose(item)
        }
        this.pools.length=0
        this.createdCount=0
    }
}