import { ProxyPath } from 'src/core/ProxyPath'
import { Vector2 } from 'src/math/Vector2'
export class PixelRenderer {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    width: number = 0
    height: number = 0
    cellSize: number = 64
    colorBuffer: Uint8ClampedArray<ArrayBuffer>
    imageData: ImageData
    constructor(width: number, height: number, cellSize: number = 64) {
        this.cellSize = cellSize
        this.canvas = document.createElement('canvas')
        this.canvas.width = cellSize * width
        this.canvas.height = cellSize * height
        document.body.appendChild(this.canvas)
        this.ctx = this.canvas.getContext('2d')!
        this.width = Math.floor(width)
        this.height = Math.floor(height)
        this.colorBuffer = new Uint8ClampedArray(this.width * this.height * 4)
        this.imageData = new ImageData(this.colorBuffer, this.width, this.height)
    }
    setPixel(x: number, y: number, color: number[]) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
        x = x >> 0
        y = y >> 0
        let index = (x + y * this.width) * 4
        this.colorBuffer[index] = color[0]
        this.colorBuffer[index + 1] = color[1]
        this.colorBuffer[index + 2] = color[2]
        if (color.length === 4) {
            this.colorBuffer[index + 3] = color[3]
        } else {
            this.colorBuffer[index + 3] = 255
        }
    }

    flush() {
        const canvasWidth = this.ctx.canvas.width, canvasHeight = this.ctx.canvas.height;
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        const width_rate = canvasWidth / this.width
        const height_rate = canvasHeight / this.height
        const w = Math.floor(width_rate), h = Math.floor(height_rate);
        if (w === 1 && h === 1) {
            this.ctx.putImageData(this.imageData, 0, 0)
            return
        }
        let marginLeft = (width_rate - w) * this.width / 2
        let marginTop = (height_rate - h) * this.height / 2
        const data = this.imageData, height = data.height, width = data.width, colorBuffer = this.colorBuffer;


        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const index = (x + y * width) * 4
                this.ctx.beginPath();
                this.ctx.fillStyle = `rgba(${colorBuffer[index]},${colorBuffer[index + 1]},${colorBuffer[index + 2]},${colorBuffer[index + 3] / 255})`;
                this.ctx.fillRect(x * w + marginLeft, y * h + marginTop, w, h);
            }
        }



        for (let y = 0; y < height * 4; ++y) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 1
            this.ctx.strokeStyle = y % 4 == 0 ? "black" : "rgba(0,0,0,0.2)";
            this.ctx.moveTo(marginLeft, y * h / 4 + marginTop)
            this.ctx.lineTo(this.width * w, y * h / 4 + marginTop)
            this.ctx.stroke()
        }
        for (let x = 0; x < width * 4; ++x) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 1
            this.ctx.strokeStyle = x % 4 == 0 ? "black" : "rgba(0,0,0,0.2)";
            this.ctx.moveTo(x * w / 4 + marginLeft, marginTop)
            this.ctx.lineTo(x * w / 4 + marginLeft, this.height * h)
            this.ctx.stroke()

        }

    }


}
type Cell = {
    x: number
    y: number
}
type Span = {
    y: number
    x: number
    width: number

}
type FillRule = 'nonzero' | 'evenodd'
type SetPixel = (x: number, y: number, a: number) => void

class Int24_8 {
    static SHIFT = 8
    static ONE = 1 << this.SHIFT
    static MASK = this.ONE - 1
    static HALF = this.ONE >> 1
    static roundFloat(value: number) {
        return Math.round(value * this.ONE)
    }
    static floorFloat(value: number) {
        return Math.floor(value * this.ONE)
    }
    static ceilFloat(value: number) {
        return Math.ceil(value * this.ONE)
    }
    static truncFloat(value: number) {
        return Math.trunc(value * this.ONE)
    }
    static toFract(value: number) {
        return value & this.MASK
    }
    static toFloat(value: number) {
        return value / this.ONE
    }
}
type Edge = { y0: number, y1: number, slope: number, x: number, winding: number,p0?:Vector2,p1?:Vector2 }
class Rasterazier {

    fillPolygon2(path: ProxyPath, setPixel: SetPixel, fillRule: FillRule = 'nonzero') {
        let vertices: Vector2[] = []
        let firstPoint = Vector2.create()
        let lastPoint = Vector2.create()
        path.cmds.forEach(cmd => {
            const [type, ...params] = cmd

            switch (type) {
                case 'moveTo':
                    firstPoint.set(params[0], params[1])
                    lastPoint.set(params[0], params[1])
                    vertices.push(Vector2.create(params[0], params[1]))
                    break
                case 'lineTo':
                    vertices.push(Vector2.create(params[0], params[1]))
                    break
                case 'closePath':
                    vertices.push(Vector2.create(firstPoint.x, firstPoint.y))
            }
        })
        // vertices.forEach(v => {
        //     v.multiplyScalar(Int24_8.ONE).floor()
        // })
        const edges: Edge[] = []
        const createEdge = (p0: Vector2, p1: Vector2) => {
            let y0 = Math.min(p0.y, p1.y)
            let y1 = Math.max(p0.y, p1.y)
            let dx = p1.x - p0.x
            let dy = p1.y - p0.y
            let slope = dx / dy
            let x = p0.y < p1.y ? p0.x : p1.x
            let winding = p0.y < p1.y ? 1 : -1
            edges.push({ y0, y1, x, winding, slope })
        }
        let minY = Infinity
        let maxY = -Infinity

        for (let i = 0; i < vertices.length; i++) {
            let p1 = vertices[i]
            let p2 = vertices[(i + 1) % vertices.length]
            if (p1.y === p2.y) {
                continue
            }
            minY = Math.min(p1.y, minY)
            maxY = Math.max(p1.y, maxY)
            createEdge(p1, p2)
        }
        // 排序
        edges.sort((a, b) => a.y0 - b.y0)

        let y0 = Math.floor(minY)
        let y1 = Math.ceil(maxY)
        let activeEdges: Edge[] = []
        let edgeIndex = 0
        for (let y = y0; y < y1; y++) {

            while (edgeIndex < edges.length && edges[edgeIndex].y0 <= y) {
                activeEdges.push(edges[edgeIndex])
                edgeIndex++
            }
            activeEdges = activeEdges.filter(d => y < d.y1)
            activeEdges.sort((a, b) => a.x - b.x)

            let winding = 0
            for (let i = 0; i < activeEdges.length; i++) {
                if (i > 0) {
                    let edge0 = activeEdges[i - 1]
                    let edge1 = activeEdges[i]
                    let x0 = Math.floor(edge0.x)
                    let x1 = Math.ceil(edge1.x)
                    let isFill = false
                    if (fillRule === 'nonzero' && winding !== 0) {
                        isFill = true
                    } else if (fillRule === 'evenodd' && winding % 2 !== 0) {
                        isFill = true
                    }
                    if (isFill) {
                        for (let x = x0; x < x1; x++) {
                            setPixel(x, y, 1)
                        }
                    }

                }
                winding += activeEdges[i].winding
            }
            activeEdges.forEach(d => {
                d.x += d.slope
            })



        }

    }
    fillPolygon(path: ProxyPath, setPixel: SetPixel, fillRule: FillRule = 'nonzero') {
        let vertices: Vector2[] = []
        let firstPoint = Vector2.create()
        let lastPoint = Vector2.create()
        path.cmds.forEach(cmd => {
            const [type, ...params] = cmd

            switch (type) {
                case 'moveTo':
                    firstPoint.set(params[0], params[1])
                    lastPoint.set(params[0], params[1])
                    vertices.push(Vector2.create(params[0], params[1]))
                    break
                case 'lineTo':
                    vertices.push(Vector2.create(params[0], params[1]))
                    break
                case 'closePath':
                    vertices.push(Vector2.create(firstPoint.x, firstPoint.y))
            }
        })
        // vertices.forEach(v => {
        //     v.multiplyScalar(Int24_8.ONE).floor()
        // })
        const edges: Edge[] = []
        const createEdge = (p0: Vector2, p1: Vector2) => {
            let y0 = Math.min(p0.y, p1.y)
            let y1 = Math.max(p0.y, p1.y)
            let dx = p1.x - p0.x
            let dy = p1.y - p0.y
            let slope = dx / dy
            let x = p0.y < p1.y ? p0.x : p1.x
            let winding = p0.y < p1.y ? 1 : -1
            edges.push({ y0, y1, x, winding, slope,p0,p1 })
        }
        let minY = Infinity
        let maxY = -Infinity

        for (let i = 0; i < vertices.length; i++) {
            let p1 = vertices[i]
            let p2 = vertices[(i + 1) % vertices.length]
            if (p1.y === p2.y) {
                continue
            }
            minY = Math.min(p1.y, minY)
            maxY = Math.max(p1.y, maxY)
            createEdge(p1, p2)
        }
        // 排序
        edges.sort((a, b) => a.y0 - b.y0)

        let y0 = Math.floor(minY)
        let y1 = Math.ceil(maxY)
        let activeEdges: Edge[] = []
        let edgeIndex = 0
         let insertActiveEdge = (edge: Edge) => {
            let i = 0
            for (; i < activeEdges.length; i++) {
                if (edge.x < activeEdges[i].x) {
                    break
                }
            }
            activeEdges.splice(i, 0, edge)

        }
        for (let y = y0; y < y1; y++) {

            activeEdges.length=0
            for(let i=0;i<edges.length;i++){
                if(edges[i].y0<=y && edges[i].y1>y){
                    edges[i].x=edges[i].p0.x+(y-edges[i].p0.y)*edges[i].slope
                    insertActiveEdge(edges[i])
                }
            }
            let winding = 0
            for (let i = 0; i < activeEdges.length; i++) {
                if (i > 0) {
                    let edge0 = activeEdges[i - 1]
                    let edge1 = activeEdges[i]
                    let x0 = Math.floor(edge0.x)
                    let x1 = Math.floor(edge1.x)
                    let isFill = false
                    if (fillRule === 'nonzero' && winding !== 0) {
                        isFill = true
                    } else if (fillRule === 'evenodd' && winding % 2 !== 0) {
                        isFill = true
                    }
                    if (isFill) {
                        for (let x = x0; x <= x1; x++) {
                            setPixel(x, y, 1)
                        }
                    }

                }
                winding += activeEdges[i].winding
            }
            



        }

    }
    scan(path: ProxyPath, setPixel: SetPixel){
        let firstPoint = Vector2.create()
        let lastPoint = Vector2.create()
        const moveTo=(x:number,y:number)=>{
            firstPoint.set(x,y)
            lastPoint.set(x,y)
        }
        const lineTo=(x:number,y:number)=>{
            let x0=lastPoint.x;
            let y0=lastPoint.y;
            let x1=x;
            let y1=y;
            lastPoint.set(x,y)
            if(y0>y1){
                ([y1,y0]=[y0,y1]);
                ([x1,x0]=[x0,x1]);
            }

            let i_x0=Int24_8.roundFloat(x0)
            let f_x0=Int24_8.toFract(i_x0)
            let i_y0=Int24_8.roundFloat(y0)
            let f_y0=Int24_8.toFract(i_y0)

            let i_x1=Int24_8.roundFloat(x1)
            let f_x1=Int24_8.toFract(i_x1)
            let i_y1=Int24_8.roundFloat(y1)
            let f_y1=Int24_8.toFract(i_y1)

            // 如果y0==y1,水平绘制
            if(Math.floor(y0)==Math.floor(y1)){

                return
            }
            // 如果x0=x1,垂直绘制
            if(Math.floor(x0)==Math.floor(x1)){

                return;
            }
            let abs_dx=Math.abs(x1-x0)
            let abs_dy=Math.abs(y1-y0)

            // 哪个轴长，以哪个轴优先
            if(abs_dx>abs_dy){
                // 斜率
                for(let i=0;i<abs_dx;i++){
                    
                }

            }else{

            }


          
        }

        path.cmds.forEach(cmd => {
            const [type, ...params] = cmd

            switch (type) {
                case 'moveTo':
                    moveTo(params[0],params[1])
                    firstPoint.set(params[0],params[1])
                    break
                case 'lineTo':
                    lineTo(params[0],params[1])
                    break
                case 'closePath':
                    lineTo(firstPoint.x,firstPoint.y)
            }
        })
    }
    render(path: ProxyPath, pixelRenderer: PixelRenderer) {
        this.fillPolygon2(path, (x, y) => {
            pixelRenderer.setPixel(x, y, [255, 0, 0])
        })
    }
}


let pixel = new PixelRenderer(20, 20, 64)
let path = new ProxyPath()
let raster = new Rasterazier()

let vertices = [[10, 2], [16, 10], [3, 13]]
vertices.forEach(v => {
  //  v[0] += 0.5
   // v[1] += 0.5
})
vertices.forEach((v, i) => {

    if (i > 0) {
        path.lineTo(v[0], v[1])
    } else {
        path.moveTo(v[0], v[1])
    }
    if ((i + 1) >= vertices.length) {
        path.closePath()
    }
})


raster.render(path, pixel)
pixel.flush()

path.cmds.forEach(cmd => {
    const [type, ...params] = cmd
    const ctx = pixel.ctx
    switch (type) {
        case 'moveTo':
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = '#0000ff'
            ctx.moveTo(params[0] * pixel.cellSize, params[1] * pixel.cellSize)
            break;
        case 'lineTo':
            ctx.lineTo(params[0] * pixel.cellSize, params[1] * pixel.cellSize)
            break;
        case 'closePath':
            ctx.closePath()
            ctx.stroke()
            break;
    }
})
