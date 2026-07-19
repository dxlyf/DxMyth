import { Group } from "./Group"
import { Element } from "./Element"
import RBush from 'src/utils/rbush'
import { Shape } from "./Shape"
import { ElementFlag } from "./ElementFlags"
import { Viewport } from "./Viewport"
import { Engine } from "./Engine"
export class Scene {
    root: Group
    engine:Engine
    renderElements: Element[] = []
    private rtree: RBush<Element> = new RBush()
    constructor(engine:Engine) {
        this.engine=engine
        this.root = new Group()
        this.root.owner=this.engine
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
                element.onBeforeUpdate()
                element.onUpdate()
                element.onAfterUpdate()
                if (needReflow && !element.isGroup && element.shouldAddToRenderList()&&viewport.isVisible(element.worldBounds))  {
                    renderElements.push(element)
                }
            })
        }
        if (needReflow) {
            renderElements.sort((a, b) => a.zIndex - b.zIndex)
        }
        if (needReflow) {
            root.flags.remove(ElementFlag.REFLOW)
            root.flags.removeSubtreeFlag(ElementFlag.REFLOW)
            this.rtree.clear()
            this.rtree.load(renderElements)
        }

        return renderElements
    }
}