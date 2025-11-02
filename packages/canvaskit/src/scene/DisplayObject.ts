import type {DisplayObjectOptions,DisplayObjectEvents,IDisplayObject} from 'src/interface/DisplayObject'
import { Node } from "./Node";
import { ICanvaskitRenderer } from "src/interface/Renderer";

/** 
 * 显示对象基类
*/

abstract class DisplayObject<Options extends DisplayObjectOptions=DisplayObjectOptions> extends Node<Options,DisplayObjectEvents> implements IDisplayObject<Options>{
     type='DisplayObject'
     constructor(options?:Options){
          super(options)
     }
     getDefaultProps(){
          return [...super.getDefaultProps(),{
          
          }] as Options[]
     }
     abstract onDraw(renderer: ICanvaskitRenderer): void 
}
export {
     DisplayObject
}