import type {DisplayObjectOptions,DisplayObjectEvents} from 'src/types/DisplayObject'
import { Node } from "./Node";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { BoundingRect } from 'src/math/BoundingRect';
import { merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
/** 
 * 显示对象基类
*/

abstract class DisplayObject<Options extends DisplayObjectOptions=DisplayObjectOptions> extends Node<Options,DisplayObjectEvents>{
     type='DisplayObject'
     constructor(options?:Options){
          super(options)
     }
     init(){}
     getDefaultProps(){
          return [...super.getDefaultProps(),{
               style:{
                    opacity:1
               }
          }] as Options[]
     }
     get style():Options['style']{
          return this.props.style
     }
     setStyle(style:Options['style']){
          merge(this.props.style,style)
          this.dirtyStyle()
     }
     dirtyStyle(){
           this.effectFlag |= NodeEffectFlags.Repaint|NodeEffectFlags.Style
     }
     shouldRender(){
          return super.shouldRender()&&this.props.style.opacity>0
     }
     hit(x:number,y:number):boolean{
          // 如果开启了只命中包围合就行
          if(this.props.hitRect){
               return this.bounds.containsXY(x,y)
          }
          return false
     }
     abstract innerCalcBounds(): void
     abstract renderBefore(renderer:CanvaskitRenderer): void 
     abstract render(renderer: CanvaskitRenderer): void 
     abstract renderAfter(renderer:CanvaskitRenderer): void 
}
export {
     DisplayObject
}