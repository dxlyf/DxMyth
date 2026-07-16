import { Element } from "src/core/Element"
import { Engine } from "src/core/Engine"
import { Scene } from "src/core/Scene"
import { Picker } from "./Picker"
import { PathPicker } from "./PathPicker"


export class PickerSystem{
    engine:Engine
    picker:Picker
    constructor(engine:Engine){
        this.engine=engine
        this.picker=new PathPicker(engine)
    }
    setPicker(picker:Picker){
        this.picker=picker
    }
    pick(x: number, y: number): Element | null {
        return this.picker.pick(x, y)
    }
}