import type {DisplayObjectOptions,DisplayObjectEvents} from 'src/types/DisplayObject'
import { Node } from "./Node";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { BoundingRect } from 'src/math/BoundingRect';
import { LineCap, LineJoin, PaintBorderSide } from 'src/core/Paint';
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
                lineWidth:1,
                lineJoin:LineJoin.Miter,
                lineCap:LineCap.Butt,
                miterLimit:10,
                borderSide:PaintBorderSide.Middle
             }
          }] as Options[]
     }
     get style():Options['style']{
          return this.props.style
     }
     setStyle(style:Options['style']){
          merge(this.props.style,style)
          this.effectFlag |= NodeEffectFlags.Repaint|NodeEffectFlags.Style
     }
     abstract innerCalcLocalBounds(): void
     abstract render(renderer: CanvaskitRenderer): void 
}
export {
     DisplayObject
}