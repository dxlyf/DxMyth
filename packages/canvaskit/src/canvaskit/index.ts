export * from './canvaskit'
import {DisposableManager,type IDisposable } from 'src/core/Disposable'
import {getCanvasKit} from './canvaskit'
import {PoolService,getPoolService,type IPoolService} from 'src/core/PoolService'

// 扩展
declare module 'canvaskit-wasm'{
    interface Paint extends IDisposable{
        clone():Paint
    }
    interface PathConstructorAndFactory{
        getPool():Path
    }
    interface Path extends IDisposable,IPoolService<Path>{
      
    }

}
getCanvasKit().then(CK=>{
    CK.Paint.prototype.clone=function(this:InstanceType<typeof CK.Paint>){
        return this.copy()
    }

    DisposableManager.mixin(CK.Paint,{
        dispose(obj){
            obj.delete()
        }
    });
    DisposableManager.mixin(CK.Path,{
        dispose(obj){
           obj.delete()
        }
    })

    PoolService.mixin(CK.Path,{
        maxSize:10,
        initialSize:10,
        create(){
            return new CK.Path()
        },
        init(obj){
            obj.rewind()
        },
        dispose(obj){
            obj.dispose()
        }
    })
})
