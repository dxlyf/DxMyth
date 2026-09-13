
type CachePoolPoolOptions<T, P extends any[]> = {
    maxSize?: number
    initSize?: number
    add?: () => T
    create?: (...args: P) => T
    init?: (item: T,...args:P) => void
    release?: (item: T) => void

}
export class CachePool<T, P extends any[] = any[]> {
    static create<T, P extends any[] = any[]>(options: CachePoolPoolOptions<T, P>) {
        return new CachePool<T, P>(options)
    }
    pools: T[]
    /** 待释放区：已获取但尚未释放的对象 */
    actives: T[]
    options: Partial<CachePoolPoolOptions<T, P>>
    constructor(options: CachePoolPoolOptions<T, P>) {
        this.options = { maxSize: 100, initSize: 0, ...(options || {}) }
        this.pools = []
        this.actives = []
        if (this.options.initSize > 0) {
            this.initPoolSize(this.options.initSize)
        }
    }
    private initPoolSize(size: number) {
        for (let i = 0; i < size; i++) {
            if (this.options.add) {
                this.pools.push(this.options.add())

            } else {
                this.pools.push((this.options.create as any)())
            }
        }
    }
    get(...args: P) {
        let item: T
        if (this.pools.length > 0) {
            item = this.pools.pop() as T
            this.options.init?.(item, ...args)
        } else {
            item = this.options.create!(...args)
        }
        // 获取到的对象放入待释放区
        this.actives.push(item)
        return item
    }
    release(item: T) {
        const index = this.actives.indexOf(item)
        if (index !== -1) {
            this.actives.splice(index, 1)
        }
        this.recycle(item)
    }
    /** 一次性释放待释放区中的所有对象 */
    releaseAll() {
        for (let i = 0; i < this.actives.length; i++) {
            this.recycle(this.actives[i])
        }
        this.actives.length = 0
    }
    private recycle(item: T) {
        if (this.pools.length < this.options.maxSize) {
            this.options.release?.(item)
            this.pools.push(item)
        }
    }
    
}