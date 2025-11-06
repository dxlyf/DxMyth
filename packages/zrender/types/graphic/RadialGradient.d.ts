import { default as Gradient, GradientColorStop, GradientObject } from './Gradient';
export interface RadialGradientObject extends GradientObject {
    type: 'radial';
    x: number;
    y: number;
    r: number;
}
/**
 * x, y, r are all percent from 0 to 1 when globalCoord is false
 */
declare class RadialGradient extends Gradient {
    type: 'radial';
    x: number;
    y: number;
    r: number;
    constructor(x: number, y: number, r: number, colorStops?: GradientColorStop[], globalCoord?: boolean);
}
export default RadialGradient;
