import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 查询类型。 */
export type WebGPUQueryType = 'occlusion' | 'timestamp';

/** 查询集描述。 */
export interface QuerySetDesc {
  label?: string;
  type: WebGPUQueryType;
  count: number;
}

/** WebGPU 查询集。 */
export class WebGPUQuerySet extends Resource<GPUQuerySet> {
  readonly queryType: WebGPUQueryType;
  readonly count: number;

  constructor(context: WebGPUContext, native: GPUQuerySet, desc: QuerySetDesc) {
    super(native, { label: desc.label });
    this.queryType = desc.type;
    this.count = desc.count;
    void context;
  }

  protected override destroyNative(native: GPUQuerySet): void {
    native.destroy();
  }
}
