/** WebGL 上下文与驱动的静态信息。 */
export class WebGLInfo {
  readonly vendor: string;
  readonly renderer: string;
  readonly version: string;
  readonly shadingLanguageVersion: string;
  readonly extensions: readonly string[];

  constructor(gl: WebGLRenderingContext) {
    this.vendor = gl.getParameter(gl.VENDOR) as string;
    this.renderer = gl.getParameter(gl.RENDERER) as string;
    this.version = gl.getParameter(gl.VERSION) as string;
    this.shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION) as string;
    this.extensions = gl.getSupportedExtensions() ?? [];
  }

  /** 渲染器标识，便于日志与问题定位。 */
  toString(): string {
    return `${this.vendor} / ${this.renderer} (${this.version})`;
  }
}
