import { Color } from '../math/Color';

/** Linear fog applied in view space. */
export class Fog {
  readonly isFog = true;
  name = '';
  color: Color;
  near: number;
  far: number;

  constructor(color: number | string | Color = 0x000000, near = 1, far = 1000) {
    this.color = color instanceof Color ? color.clone() : new Color(color);
    this.near = near;
    this.far = far;
    this.name = '';
  }

  clone(): Fog {
    return new Fog(this.color.clone(), this.near, this.far);
  }
}

/** Exponential-squared fog. */
export class FogExp2 {
  readonly isFogExp2 = true;
  name = '';
  color: Color;
  density: number;

  constructor(color: number | string | Color = 0x000000, density = 0.00025) {
    this.color = color instanceof Color ? color.clone() : new Color(color);
    this.density = density;
  }

  clone(): FogExp2 {
    return new FogExp2(this.color.clone(), this.density);
  }
}
