import { default as Gradient, GradientObject, GradientColorStop } from './Gradient';
export interface LinearGradientObject extends GradientObject {
    type: 'linear';
    x: number;
    y: number;
    x2: number;
    y2: number;
}
/**
 * x, y, x2, y2 are all percent from 0 to 1 when globalCoord is false
 */
export default class LinearGradient extends Gradient {
    type: 'linear';
    x: number;
    y: number;
    x2: number;
    y2: number;
    constructor(x: number, y: number, x2: number, y2: number, colorStops?: GradientColorStop[], globalCoord?: boolean);
}
