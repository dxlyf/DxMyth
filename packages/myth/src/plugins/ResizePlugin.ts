
import {Plugin} from 'src/core/PluginManager'
import { IApplication } from 'src/types/core/Application';
import { getMargins } from 'src/utils/dom';

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

class ResizePlugin extends Plugin<IApplication> {
    static name: string='ResizePlugin'
    resizeId=0
    width: number=0
    height: number=0
    resizeType:'window'|'element'|'none'='none'
    create(): void {
        if(this.ctx.options.resizeTo===window) {
            this.resizeType='window'    
        }else if(this.ctx.options.resizeTo){
            this.resizeType='element'
        }

    }
    init(): void {
        this.resize()
        this.ctx.domElement.style.display='block'
        if(this.resizeType!=='none') {
            this.setupResizeObserver()
        }
  
    }
    private setupResizeObserver() {
        const {resizeTo}=this.ctx.options
        if (this.resizeType==='window') {
            window.addEventListener('resize', this.handleResize);
            this.destroy=()=>{
                window.removeEventListener('resize', this.handleResize);
            }
        } else if (this.resizeType==='element') {
            let observer = new ResizeObserver((entries)=>{
                for(let entry of entries) {
                    if(entry.target===resizeTo){
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
    getContainerDimension(){
        const {resizeTo}=this.ctx.options
        if(this.resizeType==='window') {
          
            this.width=window.innerWidth
            this.height=window.innerHeight
        }else if(this.resizeType==='element'){
            this.width=(resizeTo as HTMLElement).clientWidth
            this.height=(resizeTo as HTMLElement).clientHeight
        }else{
            this.width=this.ctx.options.width||300
            this.height=this.ctx.options.height||300
        }
        const styles = getMargins(document.body)
        this.width=this.width-styles.left-styles.right
        this.height=this.height-styles.top-styles.bottom
    }
    handleResize = () => {
        if(this.resizeId){
            clearTimeout(this.resizeId)
            this.resizeId=0
        }
        this.resizeId=setTimeout(()=>{
            this.resize()
            this.resizeId=0
        }) as any
    }
    resize=()=>{
        this.getContainerDimension()
        
        this.ctx.renderer.setSize(this.width, this.height)
        this.ctx.refresh()
    }

    destroy() {
       
    }
}
export default ResizePlugin 

