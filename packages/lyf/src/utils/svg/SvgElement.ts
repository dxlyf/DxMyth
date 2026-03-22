import { createSvgElement, SVG_NAMESPACE, SVG_XLINK_ATTRIBUTE } from "./util"

export class SvgElement {
    element: SVGElement
    constructor(tagName: string) {
        this.element = createSvgElement(tagName)
    }
    get children() {
        return this.element.children
    }
    get childrenArray() {
        return Array.from(this.children) as SVGElement[]
    }
    addChild(child: SVGElement) {
        this.element.appendChild(child)
    }
    removeChild(child: SVGElement) {
        this.element.removeChild(child)
    }
    removeAllChildren(){
        this.childrenArray.forEach(child => this.removeChild(child))
    }
    setAttribute(name: string, value: string) {
        this.element.setAttributeNS(SVG_NAMESPACE, name, value)
    }
    getAttribute(name: string) {
        return this.element.getAttributeNS(SVG_NAMESPACE, name)
    }
    removeAttribute(name: string) {
        this.element.removeAttributeNS(SVG_NAMESPACE, name)
    }
    use(href: string) {
        this.setAttribute(SVG_XLINK_ATTRIBUTE, href)
    }
    useMask(href: string) {
        this.setAttribute(SVG_XLINK_ATTRIBUTE, href)
    }
    remove(){
        this.element.remove()
    }
}