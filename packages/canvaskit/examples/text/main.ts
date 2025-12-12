import { CKEngine, Circle, Rect,Text,Paragraph, Group, Ellipse, GraphicPath, CK } from "src/index"
import { ExampleBase, ExampleManager } from "../lib/Example"


class TextExample extends ExampleBase {
    static title: string = '文本'
    shape: Text
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
        this.shape = new Text({
            position:[this.state.x,this.state.y],
            shape:{},
            style: {
                 text:this.state.text,
                 fillStyle: this.state.color,
                 fontSize:14,
            },
        })
        this.onChange()
        this.owner.add(this.shape)
    }
    onChange(property?: string, value?: any): void {
        this.shape.setStyle({
            text:this.state.text,
            fillStyle: this.state.color,
            fontWeight:this.state.weight,
            fontStyle:this.state.fontStyle,
            fontSize:this.state.fontSize,
        })
        this.updateTransform(this.shape, this.state)
    }
}


class ParagraphExample extends ExampleBase {
    static title: string = '段落文本'
    shape: Paragraph
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
        this.shape = new Paragraph({
            shape: {
               // x: this.state.x,
              //  y: this.state.y
            },
            style: {
                 text:[this.state.text],
                 fillStyle: this.state.color,
                 fontSize:14,
            },
            position:[this.state.x,this.state.y]
        })
        this.onChange()
        this.owner.add(this.shape)
    }
    onChange(property?: string, value?: any): void {
        
        this.shape.setStyle({
            fillStyle: this.state.color,
            content:[{
                text:this.state.text
            },{
                text:'開外挂發放大',
                textStyle:{
                    color:[0,0,1,1]
                }
            }],
            textStyle:{
                fontStyle:{
                    weight:this.state.weight=='bold'?CK.FontWeight.Bold:CK.FontWeight.Normal,
                    slant:this.state.fontStyle=='italic'?CK.FontSlant.Italic:CK.FontSlant.Upright,
                },
                fontSize:this.state.fontSize,
            }
        })
        this.updateTransform(this.shape, this.state)
    }
}
ExampleManager.examples = [ParagraphExample,TextExample]
ExampleManager.getSignleInstance().init()