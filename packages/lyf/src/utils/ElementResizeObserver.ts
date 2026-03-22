
type Listener=(element: Element, rect: DOMRect) => void
export class ElementResizeObserver {
    element: HTMLElement
    observer: ResizeObserver
    listeners:Listener[]=[]
    constructor(element: HTMLElement) {
        this.element = element
        this.observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.listeners.forEach((cb) => {
                    cb(entry.target, entry.contentRect)
                })
            })
        })
    }
    subscribe(cb: Listener) {
        this.listeners.push(cb)
        return ()=>{
            this.listeners=this.listeners.filter((item)=>item!==cb)
        }
    }
    observe(){
        this.observer.observe(this.element)
    }
    unobserve(){
        this.observer.unobserve(this.element)
    }
    dispose(){
        this.observer.disconnect()
    }
}