/** WebGPU 适配器与设备信息。 */
export class WebGPUInfo {
  readonly vendor: string;
  readonly architecture: string;
  readonly device: string;
  readonly description: string;

  constructor(adapter: GPUAdapter | null) {
    const info = (adapter as { info?: GPUAdapterInfo } | null)?.info;
    this.vendor = info?.vendor ?? '';
    this.architecture = info?.architecture ?? '';
    this.device = info?.device ?? '';
    this.description = info?.description ?? '';
  }

  /** 便于日志输出的描述。 */
  toString(): string {
    const parts = [this.vendor, this.architecture, this.device, this.description].filter(
      (part) => part !== '',
    );
    return parts.length > 0 ? parts.join(' / ') : '未知 GPU';
  }
}
