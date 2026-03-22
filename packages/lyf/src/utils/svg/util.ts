export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
export const SVG_XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink'
export const SVG_XLINK_ATTRIBUTE = 'xlink:href'
export const SVG_XLINK_ATTRIBUTE_NAMESPACE = SVG_XLINK_NAMESPACE

export const createSvgElement = (tagName: string) => {
    return document.createElementNS(SVG_NAMESPACE, tagName)
}
export const setSvgAttribute = (element: SVGElement, name: string, value: string) => {
    element.setAttributeNS(SVG_NAMESPACE, name, value)
}