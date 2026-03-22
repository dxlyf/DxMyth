import { debounce } from "./debounce"
type ElementResizeOptions = {
    element: Element
    resizeTo?:ResizeTo
    enableWindowResize?: boolean
    enableElementResize?: boolean
    debounceDelay?: number
    onResize: (width: number, height: number) => void
}
const useElementResize = (options: ElementResizeOptions) => {
    const { element, resizeTo='element', enableWindowResize = true, enableElementResize = true, debounceDelay = 10, onResize } = options
    
    const handleResize = debounce(() => {
        const win=element.ownerDocument.defaultView || window
        if(resizeTo==='element'){
            onResize(element.clientWidth, element.clientHeight)
        }else if(resizeTo==='parent'){
            const parent=element.parentElement as HTMLElement
            if(!parent){
                return
            }
            onResize(parent.clientWidth || 0, parent.clientHeight || 0)
        }else{
            onResize(win.innerWidth, win.innerHeight)
        }
    }, debounceDelay)
    
    if (enableWindowResize) {
        window.addEventListener('resize', handleResize)
    }
    let observer: ResizeObserver
    if (enableElementResize&&resizeTo==='element') {
        observer = new ResizeObserver(handleResize)
        observer.observe(element)
    }
    handleResize()
    return () => {
        observer&&observer.disconnect()
        window.removeEventListener('resize', handleResize)
    }
}
export {
    useElementResize
}