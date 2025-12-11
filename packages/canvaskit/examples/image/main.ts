import { CKEngine, Circle, Rect,Image,ImageResource,Paragraph, Group, Ellipse, GraphicPath, CK } from "src/index"
import { ExampleBase, ExampleManager } from "../lib/Example"


class ImageExample extends ExampleBase {
    static title: string = '文本'
    shape: Image
    stateOptions={
        weight:['normal','bold'],
        fontStyle:['normal','italic'],
    }
    getDefaultState() {
        return {
            x: 100,
            y: 100,
            text:'Hello World 你好世界',
            fontSize:16,
            weight:'normal',
            fontStyle:'normal',
            color: '#ff0000',

            ...super.getDefaultState(),
            ...this.createTransformState([100, 100]),
        }
    }
    async enter() {
        this.shape = new Image({
            position:[this.state.x,this.state.y],
            shape:{
                width:100,
                height:100,
                image:ImageResource.fromUrl('https://gips1.baidu.com/it/u=3874647369,3220417986&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280'),
            },
            style: {
            },
        })
        this.onChange()
        this.owner.add(this.shape)
    }
    onChange(property?: string, value?: any): void {
   
        this.updateTransform(this.shape, this.state)
    }
}


ExampleManager.examples = [ImageExample]
ExampleManager.getSignleInstance().init()