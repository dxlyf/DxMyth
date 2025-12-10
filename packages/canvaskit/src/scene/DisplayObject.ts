import type { DisplayObjectOptions, DisplayObjectEvents } from 'src/types/DisplayObject'
import { Node } from "./Node";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { BoundingRect } from 'src/math/BoundingRect';
import { merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
/** 
 * 显示对象基类
*/

abstract class DisplayObject<Options extends DisplayObjectOptions = DisplayObjectOptions> extends Node<Options, DisplayObjectEvents> {
     type = 'DisplayObject'
     constructor(options?: Options) {
          super(options)
     }
     init() { }
     getDefaultProps() {
          return [...super.getDefaultProps(), {
               style: {
                    opacity: 1
               }
          }] as Options[]
     }
     get style(): Options['style'] {
          return this.props.style
     }
     setStyle(style: Options['style']) {
          merge(this.props.style, style)
          this.dirtyStyle()
     }
     dirtyStyle() {
          this.effectFlag |= NodeEffectFlags.Repaint | NodeEffectFlags.Style
     }
     shouldRender() {
          return super.shouldRender() && this.props.style.opacity > 0
     }
     hitPath(x: number, y: number): boolean {
          return false
     }
     hit(x: number, y: number): boolean {
          // 如果开启了只命中包围合就行
          if (this.props.hitRect) {
               return this.bounds.containsXY(x, y)
          }
          if(!this.bounds.containsXY(x, y)){
               return false
          }
          return this.hitPath(x, y)
     }
     abstract innerCalcBounds(): void
     renderBefore(renderer: CanvaskitRenderer) { }
     /**
      * renderer.render
      *   object.render
      * renderer.renderObject
      *   object.renderBefore
      *   object.startDraw
      *   object.draw
      *   object.endDraw
      *   object.renderAfter
      * 
      * 渲染对象
      * @param renderer 渲染器
      */
     render(renderer: CanvaskitRenderer) {
          renderer.renderObject(this)
     }
     startDraw(renderer: CanvaskitRenderer) { }
     draw(renderer: CanvaskitRenderer) { }
     endDraw(renderer: CanvaskitRenderer) { }
     // internalRender(renderer: CanvaskitRenderer){}
     renderAfter(renderer: CanvaskitRenderer) { }
}
export {
     DisplayObject
}