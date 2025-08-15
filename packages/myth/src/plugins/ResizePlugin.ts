
import { Application } from 'src/core/Application'
import {Plugin} from 'src/core/PluginManager'

declare module '../types/core/Application.ts' {
    /**
     *  resizeTo: 控制画布是适应窗口(window)还是父元素(parent)
        fit: 控制内容如何适应容器：
            contain: 保持宽高比，完整显示内容
            cover: 保持宽高比，填满容器（可能裁剪）
            fill: 拉伸填满容器
            none: 使用原始尺寸
        */
    interface ApplicationOptions {
        canvas: HTMLCanvasElement;
        width?: number
        height?: number
        resizeTo?:HTMLElement|Window
    }
}
class ResizePlugin extends Plugin<Application> {
    name: string='ResizePlugin'
    resizeId=0
    width: number=0
    height: number=0
    create(): void {
    }
    init(): void {
        this.setupResizeObserver()
    }
    private setupResizeObserver() {
        const {resizeTo}=this.ctx.options
        if (resizeTo===window) {
            const handleWindowSize=()=>{
                this.width=window.innerWidth
                this.height=window.innerHeight
                this.handleResize()
            }
            window.addEventListener('resize', handleWindowSize);
            this.destroy=()=>{
                window.removeEventListener('resize', handleWindowSize);
            }
        } else if ((resizeTo as HTMLElement).nodeType === 1) {
            let observer = new ResizeObserver((entries)=>{
                for(let entry of entries) {
                    if(entry.target===resizeTo){
                        this.width=entry.contentRect.width
                        this.height=entry.contentRect.height
                        this.handleResize()
                    }
                }
            });
             observer.observe(resizeTo as HTMLElement);
            this.destroy=()=>{
                  observer.disconnect()
            }
        }
    }
    handleResize = () => {
        if(this.resizeId){
            cancelAnimationFrame(this.resizeId)
            this.resizeId=0
        }
        this.resizeId=requestAnimationFrame(()=>{
            this.resizeId=0
            this.resize()
        })
    }
    resize=()=>{
        this.ctx.renderer.updateSize(this.width, this.height)
    }

    destroy() {
       
    }
}
export default ResizePlugin 

