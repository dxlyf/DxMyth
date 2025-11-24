
function observerElementSize(element:HTMLElement,callback:(width:number,height:number)=>void){
    const observer=new ResizeObserver((entries)=>{
        const elm=entries[0]
        callback(elm.contentRect.width,elm.contentRect.height)
    })
    observer.observe(element)
    return ()=>{
        observer.disconnect()
    }
}
type NamespaceURI='http://www.w3.org/1999/xhtml'|'http://www.w3.org/2000/svg'
function createElementNS<T extends Element>(namespaceURI:NamespaceURI,qualifiedName:string):T{
    return document.createElementNS(namespaceURI,qualifiedName) as T
}
export {
    observerElementSize,
    createElementNS
}