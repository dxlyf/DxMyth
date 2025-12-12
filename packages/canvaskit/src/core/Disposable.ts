
interface IDispose{
    dispose:()=>void // 立即释放资源
}

export interface IDisposable extends IDispose{
    isDisposed():boolean // 是否已释放
   // dispose():void // 立即释放资源
    disposeLater():void // 添加到可释放管理器，延迟释放资源
}
type DPRegisterOptions<T>={
    dispose?:(obj:T)=>void
}

export const addDisposable=(target:IDispose)=>{
     if(activeDisposableManager){
        activeDisposableManager.add(target)
     }
}
let activeDisposableManager:DisposableManager|null=null
export class DisposableManager{
    static add=addDisposable
    static mixin<T>(target:{new(...args:any[]):T},options:DPRegisterOptions<T>={}){
        const oldDispose=target.prototype.dispose
        target.prototype.__isDisposed=false
        target.prototype.isDisposed=function(){
            if(this.__isDisposed){
                return true
            }
            return false
        }
        target.prototype.dispose=function(){
            if(this.__isDisposed){
                return
            }
            this.__isDisposed=true
            options.dispose?.(this)
            oldDispose?.call(target)
        }
        target.prototype.disposeLater=function(){
            if(activeDisposableManager&&!this.__isDisposed){
                activeDisposableManager.add(this)
            }
        }
    }
    private disposables:IDispose[]=[]
    private persistentDisposables:IDispose[]=[]
    constructor(){
        activeDisposableManager=this
    }
    add(disposable:IDispose){
        this.disposables.push(disposable)
    }
    addPersistent(disposable:IDispose){
        this.persistentDisposables.push(disposable)
    }
    destroy(){
        this.dispose()
        for(let i=0;i<this.persistentDisposables.length;i++){
            const disposable=this.persistentDisposables[i]
            disposable.dispose()
        }
        this.persistentDisposables.length=0
    }
    dispose(){
        for(let i=0;i<this.disposables.length;i++){
            const disposable=this.disposables[i]
            disposable.dispose()
        }
        this.disposables.length=0
    }
    run(fn:()=>void){
            let prev=activeDisposableManager
            try{
                activeDisposableManager=this
                return fn()
            }finally{
                this.dispose()
                activeDisposableManager=prev
            }
    }
}