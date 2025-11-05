import type {DisplayObjectOptions,DisplayObjectEvents} from 'src/types/DisplayObject'
import { Node } from "./Node";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { BoundingRect } from 'src/math/BoundingRect';
/** 
 * 显示对象基类
*/

abstract class DisplayObject<Options extends DisplayObjectOptions=DisplayObjectOptions> extends Node<Options,DisplayObjectEvents>{
     type='DisplayObject'
     constructor(options?:Options){
          super(options)
     }
     getDefaultProps(){
          return [...super.getDefaultProps(),{
          
          }] as Options[]
     }
     get shape():Options['shape']{
          return this.props.shape
     }
     get style():Options['style']{
          return this.props.style
     }
     abstract innerCalcLocalBounds(): void
     abstract render(renderer: CanvaskitRenderer): void 
}
export {
     DisplayObject
}