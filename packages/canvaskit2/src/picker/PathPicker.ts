import { Picker } from './Picker'
import { Shape } from 'src/core/Shape'
import { Element } from 'src/core/Element'
import { Engine } from 'src/core/Engine'

/**
 * 基于 Shape.hitTest 的精确几何拾取器
 *
 * 将世界坐标转换为 shape 本地坐标后调用 shape.hitTest，
 * 内部通过 CKPath2D 的 isPointInPath / isPointInStrokePath 实现像素级精确命中。
 */
export class PathPicker extends Picker {
    constructor(engine: Engine) {
        super(engine)
    }
    pick(x: number, y: number): Element | null {
          const elements=this.engine.scene.getRenderElements(this.engine.renderer.viewport)
        for(let i=elements.length-1;i>=0;i--){
            const element=elements[i]
            if(element.isGroup||!element.shouldInteractive()){
                continue
            }
            const local=element.transform.worldToLocal({x:x,y:y},{x:0,y:0})
            if(element.hitTest(local.x,local.y)){
                return element
            }
        }
        return null
    }
}
