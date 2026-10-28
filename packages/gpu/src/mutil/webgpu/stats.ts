import type { WGPUFrameStats, WGPUStats } from './types.js';

export function createWGPUStats(): WGPUStats {
  return {
    frames: 0,
    commandEncoders: 0,
    renderPasses: 0,
    drawCalls: 0,
    stateCalls: 0,
    stateSkipped: 0,
    shaderModulesCreated: 0,
    shaderModuleCacheHits: 0,
    pipelinesCreated: 0,
    pipelineCacheHits: 0,
    bindGroupsCreated: 0,
    bindGroupCacheHits: 0,
    buffersCreated: 0,
    buffersReused: 0,
    bufferWrites: 0,
    bufferWriteBytes: 0,
    texturesCreated: 0,
    texturesReused: 0,
    textureUploads: 0,
    textureUploadBytes: 0,
    samplersCreated: 0,
    samplerCacheHits: 0,
    uniformAllocations: 0,
    uniformFlushes: 0,
    uniformFlushBytes: 0,
    canvasConfigures: 0,
    currentTextureRequests: 0,
    bindGroupLayoutsRequested: 0,
    bindGroupLayoutsCreated: 0,
  };
}

export function resetWGPUStats(stats: WGPUStats): void {
  Object.assign(stats, createWGPUStats());
}

export function snapshotWGPUStats(stats: WGPUStats, frame: number): WGPUFrameStats {
  return { ...stats, frame };
}
