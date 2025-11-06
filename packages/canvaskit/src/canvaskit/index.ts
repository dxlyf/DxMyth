export * from './canvaskit'
export * from './htmlcanvas/htmlcanvas'
import {DisposableManager,type IDisposable } from 'src/core/Disposable'
import {getCanvasKit} from './canvaskit'


// 扩展
declare module 'canvaskit-wasm'{
    interface Paint extends IDisposable{
        clone():Paint
    }
    interface Path extends IDisposable{
      
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
})
