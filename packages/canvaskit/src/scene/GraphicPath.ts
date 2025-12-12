


import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { NodeEffectFlags } from 'src/consts';
import { Matrix2D, Vector2 } from 'src/math';
import { applyCKPath } from 'src/core/ProxyPath';
import type { ShapeStyleConfig, ShapeConfig } from 'src/types/Shape';
import { Shape, type ShapeOptions } from './Shape';

export interface GraphicPathStyle extends ShapeStyleConfig {

}
export interface GraphicPathShapeConfig extends ShapeConfig {

}
export interface GraphicPathOptions extends ShapeOptions<GraphicPathShapeConfig, GraphicPathStyle> {
}

type GraphicPathCammandParameters = {
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

export class GraphicPath<Options extends GraphicPathOptions = GraphicPathOptions> extends Shape<Options> {
    type = 'GraphicPath'
    pathCmdData: GraphicPathCommandData[] = []
    lastPathPoint: Vector2 = Vector2.default()
    constructor(options?: Options) {
        super(options)
    }
    getDefaultProps() {
        return [...super.getDefaultProps(), {
            style: {
            }
        }] as Options[]
    }
    buildPath(path: CanvasKit.Path) {
        for (let i = 0; i < this.pathCmdData.length; i++) {
            const command = this.pathCmdData[i]
            applyCKPath(path, command.type, command.params as any)
        }
    }
    addPathCommand(command: GraphicPathCommandData) {
        this.pathCmdData.push(command)
        this.effectFlag |= NodeEffectFlags.Shape
    }

    clearPath() {
        this.pathCmdData.length = 0
        this.effectFlag |= NodeEffectFlags.Shape
        this.ckPath.reset()
    }
    setLastPathPoint(x: number, y: number) {
        this.lastPathPoint.set(x, y)
    }
    moveTo(x: number, y: number) {
        this.addPathCommand({
            type: 'moveTo',
            params: [x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    lineTo(x: number, y: number) {
        this.addPathCommand({
            type: 'lineTo',
            params: [x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    quadraticCurveTo(cpX: number, cpY: number, x: number, y: number) {
        this.addPathCommand({
            type: 'quadraticCurveTo',
            params: [cpX, cpY, x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number) {
        this.addPathCommand({
            type: 'bezierCurveTo',
            params: [cp1X, cp1Y, cp2X, cp2Y, x, y]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    conicTo(cpX: number, cpY: number, x: number, y: number, w: number) {
        this.addPathCommand({
            type: 'conicTo',
            params: [cpX, cpY, x, y, w]
        })
        this.setLastPathPoint(x, y)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number) {
        this.addPathCommand({
            type: 'arcTo',
            params: [x1, y1, x2, y2, r]
        })
        this.setLastPathPoint(x2, y2)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    rect(x: number, y: number, w: number, h: number) {
        this.addPathCommand({
            type: 'rect',
            params: [x, y, w, h]
        })
        this.setLastPathPoint(x + w, y + h)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    roundRect(x: number, y: number, w: number, h: number, r: number) {
        this.addPathCommand({
            type: 'roundRect',
            params: [x, y, w, h, r]
        })
        this.setLastPathPoint(x + w, y + h)
        this.effectFlag |= NodeEffectFlags.Shape
    }
    arc(x: number, y: number, r: number, startAngle: number, endAngle: number, clockwise: boolean = true) {
        this.addPathCommand({
            type: 'arc',
            params: [x, y, r, startAngle, endAngle, clockwise]
        })
        this.setLastPathPoint(x + r * Math.cos(endAngle), y + r * Math.sin(endAngle))
        this.effectFlag |= NodeEffectFlags.Shape
    }
    ellipse(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, clockwise: boolean = true) {
        this.addPathCommand({
            type: 'ellipse',
            params: [x, y, rx, ry, rotation, startAngle, endAngle, clockwise]
        })
        this.setLastPathPoint(x + rx * Math.cos(endAngle), y + ry * Math.sin(endAngle))
        this.effectFlag |= NodeEffectFlags.Shape
    }

    closePath() {
        this.addPathCommand({
            type: 'closePath',
        })
        this.effectFlag |= NodeEffectFlags.Shape
    }
    draw(renderer: CanvaskitRenderer): void {
        const pathCmdData = this.pathCmdData
        if (pathCmdData.length === 0) {
            return
        }
        renderer.beginPath()
        this.buildInnerPath()
        this.buildPath(renderer._currentPath)
        renderer.applyCanvasStyle(this.style)
        renderer.drawPathPaint(renderer._currentPath, this.style)

    }
}

