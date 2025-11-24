
interface LRUCacheOptions{
    maxSize?:number; // 最大缓存大小
    maxAge?:number; // 最大缓存时间
}
type CacheItem<T> = {
    value:T; // 缓存值
    expirationTime:number; // 过期时间
}
export class LRUCache<T=any>{
    private cache = new Map<string,CacheItem<T>>();
    declare private maxAge:number;
    declare private maxSize:number;
    constructor(options?:LRUCacheOptions){
        this.maxSize = options?.maxSize || 100;
        this.maxAge = options?.maxAge || 1000 * 60 * 60;// 60分钟
    }
    get(key:string){
        const item = this.cache.get(key);
        if(item){
            if(item.expirationTime > Date.now()){
                return item.value;
            }
            this.cache.delete(key);
        }
        return undefined;
    }
    getOrSet(key:string,value:T,opts?:{maxAge?:number}){
        const item = this.get(key);
        if(item){
            return item;
        }
        this.set(key,value,opts);
        return value;
    }
    set(key:string,value:T,opts?:{maxAge?:number}){
        const item:CacheItem<T> = {
            value,
            expirationTime:Date.now() + (opts?.maxAge || this.maxAge),
        }
        this.cache.set(key,item);
        if(this.cache.size > this.maxSize){
            this.cache.delete(this.cache.keys().next().value);
        }
    }
    has(key:string){
        return this.cache.has(key);
    }
    remove(key:string){
        this.cache.delete(key);
    }
    clear(){
        this.cache.clear();
    }
    hasNotExpired(key:string){
        const item = this.cache.get(key);
        if(item){
            return this.isNotExpired(item);
        }
        return true        
    }
    isExpired(item:CacheItem<T>){
        return item.expirationTime < Date.now();
    }
    // 未过期
    isNotExpired(item:CacheItem<T>){
        return !this.isExpired(item);
    }

}
