import { Object3D } from './Object3D';
import { Color } from '../math/Color';
import type { Texture } from '../textures/Texture';
import type { Fog } from './Fog';

/**
 * Root of a renderable graph. `background` accepts a `Color` or a `Texture`
 * (equirectangular / cube); `fog` is applied by the shader library.
 */
export class Scene extends Object3D {
  readonly isScene = true;
  override type = 'Scene';
  background: Color | Texture | null = null;
  environment: Texture | null = null;
  fog: Fog | null = null;

  constructor() {
    super();
    this.matrixAutoUpdate = false;
    this.updateMatrix();
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const scene = source as Scene;
    if (scene.background instanceof Color) this.background = scene.background.clone();
    else this.background = scene.background;
    this.environment = scene.environment;
    this.fog = scene.fog;
    return this;
  }

  /** Convenience: sets a solid colour background. */
  setBackgroundColor(color: number | string | Color): this {
    this.background = color instanceof Color ? color.clone() : new Color(color);
    return this;
  }
}
