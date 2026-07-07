
import { BoundingRect } from 'src/math/BoundingRect'
import { Element, type ElementProps } from './Element'
import { Renderer, type RenderStyle } from 'src/core/Renderer'
import type { Paintolor, Gradient, Pattern, ColorValue } from 'src/core/Renderer'
import { ElementFlag } from './ElementFlags'
import { Color } from 'src/math/Color'
import { CKPath2D } from 'src/ck/CKPath2D'

type FillStyle = ColorValue | Gradient | Pattern
type StrokeStyle = ColorValue | Gradient | Pattern
export type ShapeStyle = Omit<RenderStyle, 'fillStyle' | 'strokeStyle' | 'shadowColor'> & {
    fillStyle?: FillStyle
    strokeStyle?: StrokeStyle
    shadowColor?: ColorValue
}
export type ShapeProps<ShapeExtraProps extends Record<string, any> = {}> = ElementProps & {
    shape?: ShapeExtraProps
    style?: ShapeStyle
}

export abstract class Shape<Props extends ShapeProps = ShapeProps> extends Element<Props> {
    type = "DisplayObject"
    path:CKPath2D
    constructor(props: Props) {
        super(props)
        this.setStyles(this.props.style || {})
        this.setShapes(this.props.shape || {})
    }
    get style(): RenderStyle {
        return this.props.style as RenderStyle
    }
    get shape(): Props['shape'] {
        return this.props.shape
    }

    getDefaultProps(): Partial<Props>[] {
        return [
            ...super.getDefaultProps(),
            {
                style: {
                    fillStyle: '#000',
                    strokeStyle: 'none',
                    strokeAlign:'center',
                    firstStroke: false,
                    lineWidth: 1,
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    miterLimit: 10,
                    fillRule: 'nonzero',
                    lineDashOffset: 0,
                    closePath:false,
                    // shadow
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    blend:'source-over',
                    opacity:1
                }
            }
        ] as Partial<Props>[]
    }
    setStyle<K extends keyof ShapeStyle>(name: K, value: ShapeStyle[K],forceUpdate=false) {
        const oldValue = (this.props.style as any)[name]
        let newValue: any = value
        if (name === 'fillStyle' || name === 'strokeStyle' || name === 'shadowColor') {     
            if (value === 'none') {
                newValue = null
            }
            else if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
                newValue = name === 'shadowColor' ? Color.fromInput(value) : {
                    type: 'color',
                    value: Color.fromInput(value as any)
                } as Paintolor
            }
        }
        if (forceUpdate||oldValue !== newValue) {
            (this.props.style as any)[name] = newValue
            this.dirtyStyle()
        }
    }
    setStyles(styles: Props['style'],forceUpdate=false) {
        Object.keys(styles).forEach((key:any) => {
            this.setStyle(key, (styles as any)[key],forceUpdate)
        })
    }
    setShape<K extends keyof Props['shape']>(name: K, value: Props['shape'][K],forceUpdate=false) {
        const oldValue = (this.props.shape as any)[name]
        if (forceUpdate||oldValue !== value) {
            (this.props.shape as any)[name] = value
            this.dirtyShape()
        }
    }
    setShapes(shape: Props['shape'],forceUpdate=false) {
        Object.keys(shape).forEach((key:any) => {
            this.setShape(key, (shape as any)[key],forceUpdate)
        })
    }
    shouldRender(): boolean {
        return super.shouldRender()&&this.style.opacity>0
    }
    hasFill(){
        return !!this.style.fillStyle
    }
    hasStroke(){
        return !!this.style.strokeStyle
    }
    hitTest(x:number,y:number):boolean{
        this.builtinBuildPath()
        const bounds=this.path.getBounds()
        // if(!bounds.contains(x,y)){
        //     return false
        // }
        if(this.hasFill()&&this.path.isPointInPath(x,y)){
            return true
        }
        if(this.hasStroke()){
            const style=this.style
            return this.path.isPointInStrokePath(x,y,{
                lineWith:style.lineWidth,
                lineJoin:style.lineJoin,
                lineCap:style.lineCap,
                miterLimit:style.miterLimit,
            })
        }
        return false
    }
    builtinBuildPath(){
        if(!this.path||this.flags.has(ElementFlag.SHAPE)){
            this.flags.remove(ElementFlag.SHAPE)
            this.path=new CKPath2D()
            this.buildPath(this.path)
        }
    }
    abstract buildPath(path:CKPath2D):void
    abstract draw(renderer: Renderer):void 
    abstract render(renderer: Renderer): void
}