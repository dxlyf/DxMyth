
import { BoundingRect } from '@dxyl/math2'
import {ck,type CanvasKit} from './lib'
import {ellipse} from './util'
import { easeOutQuart } from 'src/animation'
import { FillRule } from 'src/core/Renderer'
import {toCKFillRule} from './convert'

export class CKPathBuilder {
    pathBuilder :CanvasKit.PathBuilder
    version:number=0
    constructor() {
        this.beginPath()
    }
    reset(){
        this.beginPath()
    }
    markDirty(){
        this.version++
    }
    beginPath(){
        const path=this.pathBuilder
        if(path){
            path.delete()
        }
        this.pathBuilder=new ck.PathBuilder()
        this.markDirty()
    }
    transform(matrix: CanvasKit.Matrix3x3) {
        this.pathBuilder.transform(matrix)
        this.markDirty()
    }
    moveTo(x:number,y:number){
        this.pathBuilder.moveTo(x,y)
        this.markDirty()
    }
    lineTo(x:number,y:number){
        this.pathBuilder.lineTo(x,y)
        this.markDirty()
    }
    quadraticCurveTo(cp1x:number, cp1y:number, x:number, y:number){
        this.pathBuilder.quadTo(cp1x, cp1y, x, y)
        this.markDirty()
    }
    bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number){
        this.pathBuilder.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y)
        this.markDirty()
    }
    conicTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.pathBuilder.conicTo(x1, y1, x2, y2, radius)
       this.markDirty()
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.pathBuilder.arcToTangent(x1, y1, x2, y2, radius)
        this.markDirty()
    }
    arc(x:number, y:number, radius:number, startAngle:number, endAngle:number, counterclockwise:boolean=false){
        this.pathBuilder.arc(x, y, radius, startAngle, endAngle, counterclockwise)
        this.markDirty()
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        ellipse(this.pathBuilder, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number, isCCW?: boolean): void {
        this.pathBuilder.addRect(ck.XYWHRect(x, y, w, h), isCCW)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void {
        let rrect = ck.XYWHRect(x, y, w, h)
        let corners = new Float32Array(4).fill(0)
        if (Array.isArray(radii)) {
            if (radii.length === 1) {
                corners.fill(radii[0] as number)
            } else if (radii.length === 2) {
                corners[0] = corners[1] = radii[0] as number
                corners[2] = corners[3] = radii[1] as number
            } else if (radii.length === 4) {
                corners[0] = radii[0] as number
                corners[1] = radii[1] as number
                corners[2] = radii[2] as number
                corners[3] = radii[3] as number
            }
        } else {
            corners.fill(radii as number)
        }
        rrect[4] = rrect[5] = corners[0]
        rrect[6] = rrect[7] = corners[1]
        rrect[8] = rrect[9] = corners[2]
        rrect[10] = rrect[11] = corners[3]
        this.pathBuilder.addRRect(rrect)
        this.markDirty()
    }
    closePath() {
        this.pathBuilder.close()
        this.markDirty()
    }
    getBounds(out:BoundingRect): BoundingRect {
        const rect=this.pathBuilder.getBounds()
        out.fromLTRB(rect[0], rect[1], rect[2], rect[3])
        return out
    }
    contains(x:number,y:number){
        return this.pathBuilder.contains(x, y)
    }
    setFillType(fillType:FillRule){
        this.pathBuilder.setFillType(toCKFillRule(fillType))
    }
    isEmpty(){
        return this.pathBuilder.isEmpty()
    }
    detach(){
        // 会清空当前this.pathBuilder   
        return this.pathBuilder.detach()
    }
    detachAndDelete(){
        return this.pathBuilder.detachAndDelete()
    }
    deleteLater(){
        this.pathBuilder.deleteLater()
    }
    delete(){
        this.pathBuilder.delete()
    }
    
  
}