import { CKEngine, Circle, Rect,Text, Group, Ellipse, GraphicPath } from "src/index"
import { ExampleBase, ExampleManager } from "../lib/Example"


class RectExample extends ExampleBase {
    static title: string = '矩形'
    rect: Rect
    getDefaultState() {
        return {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            color: '#ff0000',
            radius:[0,0,0,0],
            ...super.getDefaultState(),
            ...this.createTransformState([100, 100]),
        }
    }
    async enter() {
        this.rect = new Rect({
            shape: {
                x: this.state.x,
                y: this.state.y,
                width: this.state.width,
                height: this.state.height,
                radius:this.state.radius,
            },
            style: {
                fillStyle: this.state.color
            },
        })
        this.onChange()
        this.owner.add(this.rect)
    }
    onChange(property?: string, value?: any): void {
        this.rect.setShape({
            x: this.state.x,
            y: this.state.y,
            width: this.state.width,
            height: this.state.height,
            radius:this.state.radius,
        })
        this.rect.setStyle({
            fillStyle: this.state.color
        })
        this.updateTransform(this.rect, this.state)
    }
}


class RingExample extends ExampleBase {
    static title: string = '环形'
        active=true
    shape: GraphicPath       
    getDefaultState() {
        return {
            cx: 0,
            cy: 0,
            innerR: 20,
            outerR: 50,
            color:'#ff0000',
            ...super.getDefaultState(),
            ...this.createTransformState([100, 100]),
        }
    }
    async enter() {
        this.shape = new GraphicPath()
 
        this.onChange()
        this.owner.add(this.shape)
    }
    onChange(property?: string, value?: any): void {
        this.shape.clearPath()
        this.shape.beginPath()
        this.shape.arc(this.state.cx,this.state.cy,this.state.innerR,0,Math.PI * 2,false)
        this.shape.arc(this.state.cx,this.state.cy,this.state.outerR,0,Math.PI * 2,true)

        this.shape.drawPaint({
            fillStyle: this.state.color,
        })
        
        this.updateTransform(this.shape, this.state)
    }
}
class TextExample extends ExampleBase {
    static title: string = '文本'
    shape: Text
    getDefaultState() {
        return {
            x: 100,
            y: 100,
            text:'Hello World',
            color: '#ff0000',
            ...super.getDefaultState(),
            ...this.createTransformState([100, 100]),
        }
    }
    async enter() {
        this.shape = new Text({
            shape: {
                x: this.state.x,
                y: this.state.y
            },
            style: {
                 text:this.state.text,
                 fillStyle: this.state.color,
                 fontFamily:'Noto Sans SC',
                 fontSize:14,
            },
        })
        this.onChange()
        this.owner.add(this.shape)
    }
    onChange(property?: string, value?: any): void {
        this.shape.setShape({
            x: this.state.x,
            y: this.state.y,
        })
        this.shape.setStyle({
            text:this.state.text,
            fillStyle: this.state.color
        })
        this.updateTransform(this.shape, this.state)
    }
}
ExampleManager.examples = [RectExample,TextExample,RingExample]
ExampleManager.getSignleInstance().init()