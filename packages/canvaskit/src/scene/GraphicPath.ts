

import type { DisplayObjectOptions } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
import { BorderSide } from 'src/enum';
import { Matrix2D, Vector2 } from 'src/math';
import { CanvasDrawStyle } from 'src/types/Renderer';
import { applyCKPath } from 'src/core/ProxyPath';

export interface GraphicPathOptions extends DisplayObjectOptions {
}

type GraphicPathCammandParameters = {
    beginPath: []
    drawPaint: CanvasDrawStyle
    moveTo: [number, number]
    lineTo: [number, number]
    quadraticCurveTo: [number, number, number, number]
    bezierCurveTo: [number, number, number, number, number, number]
    conicTo: [number, number, number, number, number]
    arcTo: [number, number, number, number, number]
    rect: [number, number, number, number]
    roundRect: [number, number, number, number, number | [number, number]]
    arc: [number, number, number, number, number, boolean]
    ellipse: [number, number, number, number, number, number, number, boolean]
    closePath: []
}
type GraphicPathCommandType = keyof GraphicPathCammandParameters
type GraphicPathCommandData = {
    type: GraphicPathCommandType
    params?: GraphicPathCammandParameters[GraphicPathCommandType]
}

export class GraphicPath<Options extends GraphicPathOptions = GraphicPathOptions> extends DisplayObject<Options> {
    type = 'GraphicPath'
    _ckPath: CanvasKit.Path
    _pathMatrix:Matrix2D|null=null
    pathCmdData: GraphicPathCommandData[] = []
    lastPathPoint: Vector2 = Vector2.default()
    constructor(options?: Options) {
        super(options)
    }
    get ckPath() {
        if (!this._ckPath) {
            this._ckPath = new CK.Path()
        }
        return this._ckPath
    }
    getDefaultProps() {
        return [...super.getDefaultProps(), {
            style: {
            }
        }] as Options[]
    }
    innerCalcBounds(): void {
        let bounds = this.ckPath.computeTightBounds()
        this._bounds.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
    }
    addPathCommand(command: GraphicPathCommandData) {
        this.pathCmdData.push(command)
        applyCKPath(this.ckPath, command.type, command.params as any)
        
    }
    clearPath(){
        this.pathCmdData.length = 0
        this.effectFlag |=NodeEffectFlags.Shape
        this.ckPath.reset()
    }
    beginPath() {
        this.addPathCommand({
            type: 'beginPath',
        })
    }
    setLastPathPoint(x: number, y: number) {
        this.lastPathPoint.set(x, y)
    }
    setPathMatrix(matrix:Matrix2D|null) {
        this._pathMatrix=matrix
    }
    moveTo(x: number, y: number) {
        this.addPathCommand({
            type: 'moveTo',
            params: [x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |=NodeEffectFlags.Shape
    }
    lineTo(x: number, y: number) {
        this.addPathCommand({
            type: 'lineTo',
            params: [x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |=NodeEffectFlags.Shape
    }
    quadraticCurveTo(cpX: number, cpY: number, x: number, y: number) {
        this.addPathCommand({
            type: 'quadraticCurveTo',
            params: [cpX, cpY, x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |=NodeEffectFlags.Shape
    }
    bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number) {
        this.addPathCommand({
            type: 'bezierCurveTo',
            params: [cp1X, cp1Y, cp2X, cp2Y, x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |=NodeEffectFlags.Shape
    }
    conicTo(cpX: number, cpY: number, x: number, y: number, w: number) {
        this.addPathCommand({
            type: 'conicTo',
            params: [cpX, cpY, x, y, w]
        })
        this.setLastPathPoint(x, y)
          this.effectFlag |=NodeEffectFlags.Shape
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number) {
        this.addPathCommand({
            type: 'arcTo',
            params: [x1, y1, x2, y2, r]
        })
        this.setLastPathPoint(x2, y2)
          this.effectFlag |=NodeEffectFlags.Shape
    }
    rect(x: number, y: number, w: number, h: number) {
        this.addPathCommand({
            type: 'rect',
            params: [x, y, w, h]
        })
        this.setLastPathPoint(x + w, y + h)
          this.effectFlag |=NodeEffectFlags.Shape
    }
    roundRect(x: number, y: number, w: number, h: number, r: number) {
        this.addPathCommand({
            type: 'roundRect',
            params: [x, y, w, h, r]
        })
        this.setLastPathPoint(x + w, y + h)
          this.effectFlag |=NodeEffectFlags.Shape
    }
    arc(x: number, y: number, r: number, startAngle: number, endAngle: number, clockwise: boolean=true) {
        this.addPathCommand({
            type: 'arc',
            params: [x, y, r, startAngle, endAngle, clockwise]
        })
        this.setLastPathPoint(x + r * Math.cos(endAngle), y + r * Math.sin(endAngle))
          this.effectFlag |=NodeEffectFlags.Shape
    }
    ellipse(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, clockwise: boolean=true) {
        this.addPathCommand({
            type: 'ellipse',
            params: [x, y, rx, ry, rotation, startAngle, endAngle, clockwise]
        })
        this.setLastPathPoint(x + rx * Math.cos(endAngle), y + ry * Math.sin(endAngle))
          this.effectFlag |=NodeEffectFlags.Shape
    }

    closePath() {
        this.addPathCommand({
            type: 'closePath',
        })
          this.effectFlag |=NodeEffectFlags.Shape
    }
    drawPaint(drawStyle: CanvasDrawStyle) {
        this.addPathCommand({
            type: 'drawPaint',
            params: drawStyle
        })
    }
    
    draw(renderer: CanvaskitRenderer): void {
        const pathCmdData = this.pathCmdData
        if(pathCmdData.length === 0){
            return
        }
        for (let command of pathCmdData) {
            let { type, params } = command
            switch (type) {
                case 'beginPath':
                    renderer.beginPath()
                    break
                case 'moveTo':
                case 'lineTo':
                case 'quadraticCurveTo':
                case 'bezierCurveTo':
                case 'conicTo':
                case 'arcTo':
                case 'rect':
                case 'roundRect':
                case 'arc':
                case 'ellipse':
                    (renderer as any)[type](...(params as number[]))
                    break
                case 'drawPaint':
                    let drawStyle = params as CanvasDrawStyle
                    if(this._pathMatrix){
                        renderer._currentPath.transform(this._pathMatrix.toRowMajorOrderMatrix3x3())
                    }
                    renderer.drawPathPaint(renderer._currentPath, drawStyle)
                    break
                case 'closePath':
                    renderer.closePath()
                    break

            }
        }

    }
    hit(x: number, y: number) {
        if (super.hit(x, y)) {
            return true
        }
        return this.ckPath.contains(x, y)
    }
    dispose(): void {
        if (this._ckPath) {
            this._ckPath.dispose()
            this._ckPath = null
        }
        super.dispose()
    }
}

