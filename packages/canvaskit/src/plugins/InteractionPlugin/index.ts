import { CKEngine } from 'src/core/CKEngine';
import type { IPlugin } from 'src/core/PluginService'
import type { CKEnginePluginHooks, CKEnginePluginMethods } from 'src/types/CKEngine';
import {PointerInteraction,type PointerInteractionEvent} from './PointerInteraction'
import {Node} from 'src/scene/Node'
function getEmitterListenerEvents(emitter:any,evt:string) {
    var handlers = emitter._events[evt],ee:any[];
    if (!handlers) return [];
    if (handlers.fn) return [handlers];

    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i];
    }
    return ee;
}
function dispatchNodeEvent(engine:CKEngine,e:PointerInteractionEvent){
        const type=e.type,x=e.x,y=e.y;
        const container=engine.container
        let target=container.findTarget(x,y)
        if(target){
            e.target=target
            const targetPaths=e.composedPath() as Node[]
            while(targetPaths.length){
                const el=targetPaths.shift()
                const listenrCount=el.listenerCount(type as any)
                if(listenrCount>0){
                    e.currentTarget=el
                    const listeners = getEmitterListenerEvents(el,type)
                    for(let j=0,len=listeners.length;j<len;j++){
                        const event=listeners[j]
                        // 如果是一次性就删除
                        if(event.once){
                            el.off(type as any,event.fn,event.context,event.once)
                        }
                        event.fn(e)
                        // 如果用户执行了立即停止冒泡，就直接结束
                        if(e.immediateCancelBubble){
                            break
                        }
                    }
                }
                // 如果取消冒泡，就停止向上
                if(e.cancelBubble){
                    break
                }
            }
        }
}

export default {
    name: 'InteractionPlugin',
    apply(api) {

        api.ctx.on('init', (engine) => {
            let pointerInteraction = new PointerInteraction()
            pointerInteraction.init({
                domElement: engine.renderer.domElment!,
                emit:(e)=>{
                    dispatchNodeEvent(engine,e)
                }
            })
            engine.renderer.on('resize', () => {
                pointerInteraction.resize()
            })
            engine.on('dispose', () => {
                pointerInteraction.dispose()
                pointerInteraction=null
            })
        })
      


    }
} as IPlugin<CKEngine, CKEnginePluginHooks, CKEnginePluginMethods>
