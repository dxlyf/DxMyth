
type Options<T,Args extends any[]>={
    maxSize:number
    create(...args:Args):T
    init(obj:T,...args:Args):void
}
export class Pool<T,Args extends any[]>{
    pools:T[]=[]
    options:Options<T,Args>
    currentIndex=0
    constructor(options:Options<T,Args>){
        this.options=options
        this.reset()
    }
    pool(...args:Args):T|undefined{

        if(this.currentIndex>0)
        {
            let obj= this.pools[--this.currentIndex]
            this.options.init(obj,...args)
            return obj
        }else
        {
            const obj= this.options.create(...args)
            return obj
        }
    }
    release(){
        if(this.currentIndex<this.options.maxSize){
           this.currentIndex++
        }
        return this
    }
    releaseAll(){
        this.currentIndex=this.options.maxSize
        return this
    }
    reset(){
        this.currentIndex=0
        while(this.currentIndex<this.options.maxSize){
            this.pools[this.currentIndex]=this.options.create()
            this.currentIndex++
        }
        return this
    }
}