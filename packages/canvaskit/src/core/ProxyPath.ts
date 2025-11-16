import { CK, type CanvasKit } from "src/canvaskit"
import { arcTo, rect, roundRect, ellipse, arc } from "src/canvaskit/htmlcanvas/path2d"

type CommandParameter = {
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
type CommandType = keyof CommandParameter
type CommandData = [CommandType, ...CommandParameter[CommandType]]

function applyCKPath(path: CanvasKit.Path, type:string,params:any[]) {

        switch (type) {
            case 'moveTo':
                path.moveTo(...params as CommandParameter['moveTo'])
                break
            case 'lineTo':
                path.lineTo(...params as CommandParameter['lineTo'])
                break
            case 'quadraticCurveTo':
                path.quadTo(...params as CommandParameter['quadraticCurveTo'])
                break
            case 'bezierCurveTo':
                path.cubicTo(...params as CommandParameter['bezierCurveTo'])
                break
            case 'conicTo':
                path.conicTo(...params as CommandParameter['conicTo'])
                break
            case 'arcTo':
                path.arcToTangent(...params as CommandParameter['arcTo'])
                break
            case 'rect':
                path.addRRect(CK.XYWHRect(...params as CommandParameter['rect']))
                break
            case 'roundRect':
                roundRect(path, ...params as CommandParameter['roundRect'])
                break
            case 'arc':
                arc(path, ...params as CommandParameter['arc'])
                break
            case 'ellipse':
                ellipse(path, ...params as CommandParameter['ellipse'])
                break
            case 'closePath':
                path.close()
                break
        }
}
class ProxyPath {
    segmentType: number
    cmds: CommandData[] = []
    lastPosition: number[] = [0, 0]
    constructor() {
    }
    addCmd(type: CommandType, ...params: CommandParameter[CommandType]) {
        this.cmds.push([type, ...params])
    }
    setLastPosition(x: number, y: number) {
        this.lastPosition[0] = x
        this.lastPosition[1] = y
    }
    moveTo(x: number, y: number) {
        this.addCmd('moveTo', x, y)
        this.setLastPosition(x, y)
    }
    lineTo(x: number, y: number) {
        this.addCmd('lineTo', x, y)
        this.setLastPosition(x, y)
    }
    quadraticCurveTo(cp1x: number, cp1y: number, x: number, y: number) {
        this.addCmd('quadraticCurveTo', cp1x, cp1y, x, y)
        this.setLastPosition(x, y)
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
        this.addCmd('bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y)
        this.setLastPosition(x, y)
    }
    conicTo(cp1x: number, cp1y: number, x: number, y: number, w: number) {
        this.addCmd('conicTo', cp1x, cp1y, x, y, w)
        this.setLastPosition(x, y)
    }
    arcTo(x1: number, y1: number, x: number, y: number, radius: number) {
        this.addCmd('arcTo', x1, y1, x, y, radius)
        this.setLastPosition(x, y)
    }
    rect(x: number, y: number, width: number, height: number) {
        this.addCmd('rect', x, y, width, height)
        this.setLastPosition(x, y)
    }
    roundRect(x: number, y: number, width: number, height: number, radius: number) {
        this.addCmd('roundRect', x, y, width, height, radius)
        this.setLastPosition(x, y)
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
        this.addCmd('arc', x, y, radius, startAngle, endAngle, anticlockwise)
        this.setLastPosition(x, y)
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
        this.addCmd('ellipse', x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
        this.setLastPosition(x, y)
    }
    closePath() {
        this.addCmd('closePath')
    }
    toCKPath(path: CanvasKit.Path) {
        for (const cmd of this.cmds) {
            const [type, ...params] = cmd
            applyCKPath(path, type, params)
        }
        return path
    }
}

export {
    ProxyPath,
    applyCKPath
}