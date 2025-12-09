import {CK,type CanvasKit} from 'src'
import { CKEngine, Circle, Rect,Text, Group, Ellipse, GraphicPath } from "src/index"
import { ExampleBase, ExampleManager } from "../lib/Example"
    
const blends=["color","color-burn","color-dodge","copy","darken","destination-atop","destination-in","destination-out","destination-over","difference","exclusion","hard-light","hue","lighten","lighter","luminosity","multiply","overlay","saturation","screen","soft-light","source-atop","source-in","source-out","source-over","xor"]
class RectExample extends ExampleBase {
        static title: string = '矩形'
        rect: Rect
        rect2:Rect
        stateOptions={
            blend:blends,
        }
        getDefaultState() {
            return {
                blend:'source-over',
            }
        }
        async enter() {
            this.rect = new Rect({
                shape: {
                    width: 100,
                    height: 100,
                },
                style: {
                    fillStyle: '#ff0000'
                },
                position:[100,100]
            })
            const rect2 = new Rect({
                     shape: {
                    width: 100,
                    height: 100,
                },
                style: {
                    fillStyle: '#00ff00'
                },
                position:[150,150]
            })
            this.onChange()
            this.owner.add(this.rect)
            this.owner.add(rect2)
            this.rect2=rect2
        }
        onChange(property?: string, value?: any): void {
            if(property=='blend'){
                this.rect2.setStyle({
                    globalCompositeOperation:this.state.blend,
                })
            }
          
        }
    }
    
  
    ExampleManager.examples = [RectExample]
    ExampleManager.getSignleInstance().init()