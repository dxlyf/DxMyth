import type { VertexAttributeDesc } from '../../../core/descriptors';
import { UnsupportedError, ValidationError } from '../../../core/errors';
import type { ExtensionRegistry } from '../extensions/ExtensionRegistry';
import type { StateCache } from '../state/StateCache';
import { attributeType } from '../util/glEnums';
import { WebGLBuffer } from './WebGLBuffer';

/** 顶点数组中单个属性的绑定信息。 */
export class WebGLAttribute {
  readonly name: string | undefined;
  readonly location: number;
  readonly size: number;
  readonly type: number;
  readonly normalized: boolean;
  readonly stride: number;
  readonly offset: number;
  readonly divisor: number;
  readonly buffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext, desc: VertexAttributeDesc, location: number) {
    if (!(desc.buffer instanceof WebGLBuffer)) {
      throw new ValidationError('顶点属性必须引用 WebGLBuffer');
    }
    if (location < 0) {
      throw new ValidationError(`顶点属性 ${desc.name ?? ''} 的位置无效：${location}`);
    }
    if (desc.size < 1 || desc.size > 4) {
      throw new ValidationError('顶点属性分量数必须在 1 到 4 之间');
    }
    this.name = desc.name;
    this.location = location;
    this.size = desc.size;
    this.type = attributeType(gl, desc.type);
    this.normalized = desc.normalized ?? false;
    this.stride = desc.stride ?? 0;
    this.offset = desc.offset ?? 0;
    this.divisor = desc.divisor ?? 0;
    this.buffer = desc.buffer;
  }

  /** 把属性绑定写入当前顶点数组状态。 */
  apply(gl: WebGLRenderingContext, state: StateCache, extensions: ExtensionRegistry): void {
    state.bindBuffer(gl.ARRAY_BUFFER, this.buffer.handle);
    gl.vertexAttribPointer(
      this.location,
      this.size,
      this.type,
      this.normalized,
      this.stride,
      this.offset,
    );
    gl.enableVertexAttribArray(this.location);
    if (this.divisor > 0) {
      const gl2 = gl as WebGL2RenderingContext;
      if (typeof gl2.vertexAttribDivisor === 'function') {
        gl2.vertexAttribDivisor(this.location, this.divisor);
        return;
      }
      const instanced = extensions.instancedArrays;
      if (instanced === null) {
        throw new UnsupportedError('实例化绘制（缺少 ANGLE_instanced_arrays）', 'webgl');
      }
      instanced.vertexAttribDivisorANGLE(this.location, this.divisor);
    }
  }
}
