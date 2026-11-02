export interface GPUStats {
  drawCalls: number;
  pipelineSwitches: number;
  pipelineCacheHits: number;
  pipelineCacheMisses: number;
  bindGroupCacheHits: number;
  bindGroupCacheMisses: number;
  uniformBytes: number;
  textureUploads: number;
  frameIndex: number;
}

export class GPUStatsTracker implements GPUStats {
  drawCalls = 0;
  pipelineSwitches = 0;
  pipelineCacheHits = 0;
  pipelineCacheMisses = 0;
  bindGroupCacheHits = 0;
  bindGroupCacheMisses = 0;
  uniformBytes = 0;
  textureUploads = 0;
  frameIndex = 0;

  reset(): void {
    this.drawCalls = 0;
    this.pipelineSwitches = 0;
    this.pipelineCacheHits = 0;
    this.pipelineCacheMisses = 0;
    this.bindGroupCacheHits = 0;
    this.bindGroupCacheMisses = 0;
    this.uniformBytes = 0;
    this.textureUploads = 0;
  }
}
