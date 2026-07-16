import { Group } from "./Group"
import { Element } from "./Element"
import RBush from 'src/utils/rbush'
import { Shape } from "./Shape"
import { ElementFlag } from "./ElementFlags"
import { Viewport } from "./Viewport"
export class Scene {
    root: Group
    renderElements: Element[] = []
    private rtree: RBush<Element> = new RBush()
    constructor() {
        this.root = new Group()
    }
    get flags() {
        return this.root.flags
    }
    add(child: Element) {
        this.root.add(child)
    }
    remove(child: Element) {
        this.root.remove(child)
    }
    getRenderElements(viewport:Viewport,updateElements = false): Element[] {
        const renderElements = this.renderElements
        const root = this.root
        const needReflow = root.flags.include(ElementFlag.REFLOW)
        if (updateElements || renderElements.length === 0) {

            if (needReflow) {
                renderElements.length = 0
            }
            root.traverseDescendant((element) => {
                element.onUpdate()
                if (needReflow && !element.isGroup && element.shouldAddToRenderList()&&viewport.isVisible(element.worldBounds))  {
                    renderElements.push(element)
                }
            })
        }
        if (needReflow) {
            renderElements.sort((a, b) => a.zIndex - b.zIndex)
        }
        if (needReflow || root.flags.include(ElementFlag.TRANSFORM)) {
            root.flags.remove(ElementFlag.REFLOW | ElementFlag.TRANSFORM)
            root.flags.removeSubtreeFlag(ElementFlag.REFLOW | ElementFlag.TRANSFORM)
            this.rtree.clear()
            this.rtree.load(renderElements)
        }

        return renderElements
    }
}