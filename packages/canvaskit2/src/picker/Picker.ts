import { Engine } from "src/core/Engine"
import { Element } from "src/core/Element"

export abstract class Picker{
    engine:Engine
    constructor(engine:Engine){
        this.engine=engine
    }
    abstract pick(x: number, y: number): Element | null
}