import { BoundingRect } from '@dxyl/math2'
import { CKPath2D } from 'src/ck'
import { Renderer } from 'src/core/Renderer'
import { Shape, type ShapeProps } from 'src/core/Shape'
import { ElementFlag } from 'src/core/ElementFlags'

export type ImageProps = ShapeProps<{
    /** 图片源：URL 字符串或 CanvasImageSource（HTMLImageElement / HTMLCanvasElement / ImageBitmap 等） */
    src?: string | CanvasImageSource
    /** 绘制位置 x（左上角） */
    x?: number
    /** 绘制位置 y（左上角） */
    y?: number
    /** 绘制宽度；不传则使用图片自然宽度 */
    width?: number
    /** 绘制高度；不传则使用图片自然高度 */
    height?: number
    /** 源裁剪起点 x */
    sx?: number
    /** 源裁剪起点 y */
    sy?: number
    /** 源裁剪宽度 */
    sw?: number
    /** 源裁剪高度 */
    sh?: number
}>

/**
 * 图片元素。
 *
 * 用法:
 *   const img = new Image({ shape: { src: '/a.png', x: 0, y: 0, width: 100, height: 100 } })
 *   scene.add(img)
 *
 * 也可以通过 setSrc 异步加载:
 *   await img.setSrc('/a.png')
 */
export class Image extends Shape<ImageProps> {
    type = "Image"

    /** 实际用于绘制的图片对象（异步加载后赋值） */
    private _image: CanvasImageSource | null = null
    /** 自然宽度（图片加载完成后才有值） */
    naturalWidth: number = 0
    /** 自然高度（图片加载完成后才有值） */
    naturalHeight: number = 0
    /** 加载状态 */
    loaded: boolean = false

    getDefaultProps(): Partial<ImageProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                src: '',
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            style: {
                // 图片默认无填充/描边
                fillStyle: 'none',
                strokeStyle: 'none',
            }
        }]
    }

    constructor(props?: Partial<ImageProps>) {
        super(props as ImageProps)
        // 若初始 src 是字符串 URL，触发异步加载
        const src = this.props.shape.src
        if (typeof src === 'string' && src) {
            this.setSrc(src)
        } else if (src && typeof src !== 'string') {
            // 直接传入 CanvasImageSource
            this._image = src
            this._syncNaturalSize()
            this.loaded = true
        }
    }

    /** 设置图片源；字符串则异步加载，CanvasImageSource 则直接使用 */
    setSrc(src: string | CanvasImageSource): Promise<void> {
        if (typeof src === 'string') {
            return this._loadFromURL(src)
        }
        this._image = src
        this.setShape('src', src as any)
        this._syncNaturalSize()
        this.loaded = true
        this.flags.add(ElementFlag.SHAPE)
        return Promise.resolve()
    }

    private async _loadFromURL(url: string): Promise<void> {
        this.loaded = false
        const img = new globalThis.Image()
        img.src = url
        try {
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve()
                img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
            })
            this._image = img
            this.naturalWidth = img.naturalWidth || img.width
            this.naturalHeight = img.naturalHeight || img.height
            this.loaded = true
            // 同步到 shape
            this.setShape('src', url)
            // 若用户未指定 width/height，使用自然尺寸
            if (!this.props.shape.width) this.setShape('width', this.naturalWidth)
            if (!this.props.shape.height) this.setShape('height', this.naturalHeight)
            // 触发重排 + 重绘
            this.flags.add(ElementFlag.SHAPE)
        } catch (e) {
            console.error(e)
            this._image = null
            this.loaded = false
        }
    }

    /** 从当前 _image 同步自然尺寸 */
    private _syncNaturalSize(): void {
        const img = this._image as any
        if (!img) return
        if (img.naturalWidth !== undefined) {
            this.naturalWidth = img.naturalWidth
            this.naturalHeight = img.naturalHeight
        } else if (img.width !== undefined) {
            this.naturalWidth = img.width
            this.naturalHeight = img.height
        }
        if (!this.props.shape.width) this.props.shape.width = this.naturalWidth
        if (!this.props.shape.height) this.props.shape.height = this.naturalHeight
    }

    /** 获取实际绘制宽度（shape.width 优先，否则用自然宽度） */
    get drawWidth(): number {
        return this.props.shape.width || this.naturalWidth
    }
    /** 获取实际绘制高度（shape.height 优先，否则用自然宽度） */
    get drawHeight(): number {
        return this.props.shape.height || this.naturalHeight
    }

    calcLocalBounds(out: BoundingRect): BoundingRect {
        out.fromXYWH(this.props.shape.x, this.props.shape.y, this.drawWidth, this.drawHeight)
        return out
    }

    draw(renderer: Renderer): void {
        if (!this._image) return
        const s = this.props.shape
        const dw = this.drawWidth
        const dh = this.drawHeight
        // 源裁剪模式：sx,sy,sw,sh 都有值
        if (s.sw !== undefined && s.sh !== undefined && s.sx !== undefined && s.sy !== undefined) {
            ;(renderer as any).drawImage(this._image, s.sx, s.sy, s.sw, s.sh, s.x, s.y, dw, dh)
        } else {
            ;(renderer as any).drawImage(this._image, s.x, s.y, dw, dh)
        }
    }

    /** 命中测试：矩形区域内才算命中 */
    hitTest(x: number, y: number): boolean {
        if (this.props.pointerEvents === 'none') return false
        if (!this._image) return false
        const s = this.props.shape
        const w = this.drawWidth
        const h = this.drawHeight
        return x >= s.x && x <= s.x + w && y >= s.y && y <= s.y + h
    }

    buildPath(path: CKPath2D): void {
        const s = this.props.shape
        path.rect(s.x, s.y, this.drawWidth, this.drawHeight)
    }

    render(renderer: Renderer): void {
        // 图片走专用渲染入口，但仍可应用 clipPath / transform
        renderer.renderImage(this)
    }

    dispose(): void {
        super.dispose()
        // 释放 ImageBitmap 资源
        if (this._image && typeof (this._image as ImageBitmap).close === 'function') {
            ;(this._image as ImageBitmap).close()
        }
        this._image = null
    }
}
