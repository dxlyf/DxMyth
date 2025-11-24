export class Cache<TData=any>{
    declare cache:Map<string,TData>
    enabled=true
    constructor(){
        this.cache=new Map()
    }
    /**
     * Adds a resource to the cache.
     *
     * @param {string} key - The key to identify the resource.
     * @param {TData} data - The resource to be cached.
     */
    add(key:string,data:TData){
        if(!this.enabled){
            return
        }
        this.cache.set(key,data)
    }
    /**
     * Retrieves a resource from the cache.
     *
     * @param {string} key - The key to identify the resource.
     * @return {TData|undefined} The cached resource if available.
     */
    get(key:string):TData|undefined{
        if(!this.enabled){
            return undefined
        }
        return this.cache.get(key)
    }
    /**
     * Checks if a resource exists in the cache.
     *
     * @param {string} key - The key to identify the resource.
     * @return {boolean} True if the resource exists in the cache, false otherwise.
     */
    has(key:string):boolean{
        return this.cache.has(key)
    }
    /**
     * Removes a resource from the cache.
     *
     * @param {string} key - The key to identify the resource.
     */
    remove(key:string){
        this.cache.delete(key)
    }
    /**
     * Removes all resources from the cache.
     */
    clear(){
        this.cache.clear()
    }
    /**
     * Returns the number of resources in the cache.
     *
     * @return {number} The number of resources in the cache.
     */
    get size():number{
        return this.cache.size
    }
}

const DefaultCache=new Cache()
export default DefaultCache