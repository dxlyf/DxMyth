export interface GLStats {
  drawCalls: number;
  instances: number;
  programSwitches: number;
  stateChanges: number;
  redundantStateSkipped: number;
  uniformUploads: number;
  textureUploads: number;
  bufferUploads: number;
  vaoFallback: number;
}

export class GLStatsTracker implements GLStats {
  drawCalls = 0;
  instances = 0;
  programSwitches = 0;
  stateChanges = 0;
  redundantStateSkipped = 0;
  uniformUploads = 0;
  textureUploads = 0;
  bufferUploads = 0;
  vaoFallback = 0;

  reset(): void {
    this.drawCalls = 0;
    this.instances = 0;
    this.programSwitches = 0;
    this.stateChanges = 0;
    this.redundantStateSkipped = 0;
    this.uniformUploads = 0;
    this.textureUploads = 0;
    this.bufferUploads = 0;
    this.vaoFallback = 0;
  }
}
