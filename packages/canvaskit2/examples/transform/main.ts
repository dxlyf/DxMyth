

import { ExampleManager, Example, Canvas } from '../lib/Example'
import { Transform } from 'src/math/Transform'
class CanvasExample extends Example {
    constructor() {
        super()
    }
    getState(): Record<string, { label?: string; floder?: boolean; min?: number; max?: number; step?: number; value?: any; options?: any[] }> {
        return {

        }
    }
    enter(): void {
        super.enter()
        let a = new Transform()
        let b = new Transform()
        let c = new Transform()
        b.parent = a;
        c.parent = b;

     
    }
    onChange(): void {

    }
    render() {

    }
}
ExampleManager.create({ examples: [CanvasExample] }).init()