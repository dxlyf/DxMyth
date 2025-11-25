// composite-types.ts
export type CompositeOperation =
  | 'source-over'
  | 'source-in'
  | 'source-out'
  | 'source-atop'
  | 'destination-over'
  | 'destination-in'
  | 'destination-out'
  | 'destination-atop'
  | 'lighter'
  | 'copy'
  | 'xor'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface CompositeContext {
  applyComposite(
    source: RGBAColor,
    destination: RGBAColor,
    operation: CompositeOperation
  ): RGBAColor;
}