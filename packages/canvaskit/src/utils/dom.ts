
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
export {
    observerElementSize
}