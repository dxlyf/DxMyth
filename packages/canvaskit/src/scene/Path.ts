

import type { DisplayObjectOptions, DisplayObjectEvents } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import type { PathShapeConfig, PathStyleConfig } from 'src/types/Path';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { BoundingRect } from 'src/math/BoundingRect';
import { LineCap, LineJoin, BorderSide } from 'src/enum';
import { CK,type CanvasKit } from 'src/canvaskit';
import { ProxyPath } from 'src/core/ProxyPath';
import { isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
import type {PaintBrushStyle} from 'src/types/Renderer'


export interface PathOptions<Shape extends PathShapeConfig=PathShapeConfig,Style extends PathStyleConfig=PathStyleConfig> extends DisplayObjectOptions<Style> {
    shape:Shape
}

export class Path<Options extends PathOptions=PathOptions> extends DisplayObject<Options> {
    type = 'Rect'
    _ckPath:CanvasKit.Path
    _proxyPath:ProxyPath
    constructor(options?: Options) {
        super(options)
    }
    get shape():Options['shape']{
          return this.props.shape
    }
    setShape(shape:Options['shape']){
        merge(this.props.shape,shape)
        this.effectFlag |= NodeEffectFlags.Repaint|NodeEffectFlags.Shape
    }
    getDefaultProps() {
        return [...super.getDefaultProps(), {
            style: {
                lineWidth: 1,
                lineJoin: LineJoin.Miter,
                lineCap: LineCap.Butt,
                miterLimit: 10,
                borderSide: BorderSide.Middle
            }
        }] as Options[]
    }
    innerCalcLocalBounds(): void {
        this.buildInnerPath()
        let bounds=this._ckPath.computeTightBounds()
        this._localBounds.fromRect(bounds[0],bounds[1],bounds[2],bounds[3])
    }
    buildInnerPath(){
        let needUpdatePath=!!(this.effectFlag&NodeEffectFlags.Shape)
        if(!this._ckPath){
            this._ckPath=new CK.Path()
            needUpdatePath=true
        }
        if(needUpdatePath){
            this.effectFlag &= ~NodeEffectFlags.Shape
            this._ckPath.rewind()
            this.buildPath(this._ckPath)
        }
    }
    buildPath(path:CanvasKit.Path){
        this.shape.buildPath?.(path)
    }
    hasFill(){
        const fillStyle=this.style.fillStyle
        return (fillStyle===null||fillStyle===undefined||fillStyle==='none')
    }
    hasStroke(){
        const strokeStyle=this.style.strokeStyle
        return (strokeStyle===null||strokeStyle===undefined||strokeStyle==='none')
    }
    render(renderer: CanvaskitRenderer): void {
        this.buildInnerPath()       
        renderer._currentPath.addPath(this._ckPath)
    }
    dispose(): void {
        if(this._ckPath){
            this._ckPath.dispose()
            this._ckPath=null
        }
        super.dispose()
    }
}

