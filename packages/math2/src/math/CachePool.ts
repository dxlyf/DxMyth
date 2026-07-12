
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
    options: Partial<CachePoolPoolOptions<T, P>>
    constructor(options: CachePoolPoolOptions<T, P>) {
        this.options = { maxSize: 100, initSize: 0, ...(options || {}) }
        this.pools = []
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
        if (this.pools.length > 0) {
            const item = this.pools.pop() as T
            this.options.init?.(item,...args)
            return item
        }
        return this.options.create!(...args)
    }
    release(item: T) {
        if (this.pools.length < this.options.maxSize) {
            this.options.release?.(item)
            this.pools.push(item)
        }
    }
}