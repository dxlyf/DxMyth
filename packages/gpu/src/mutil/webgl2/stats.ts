import type { GL2FrameStats, GL2Stats } from './types.js';

export function createGL2Stats(): GL2Stats {
  return {
    glCalls: 0,
    stateCalls: 0,
    stateSkipped: 0,
    drawCalls: 0,
    programsCreated: 0,
    programsReused: 0,
    shaderCompiles: 0,
    buffersCreated: 0,
    buffersReused: 0,
    bufferReallocations: 0,
    bufferUploadBytes: 0,
    texturesCreated: 0,
    texturesReused: 0,
    textureUploads: 0,
    textureUploadBytes: 0,
    textureUploadSkipped: 0,
    mipmapGenerations: 0,
    samplersCreated: 0,
    samplerCacheHits: 0,
    framebuffersCreated: 0,
    framebufferResizes: 0,
    vertexArraysCreated: 0,
    vertexArrayBinds: 0,
    uniformWrites: 0,
    uniformSkipped: 0,
    uniformBlockBindings: 0,
    uniformBlockSkipped: 0,
  };
}

export function resetGL2Stats(stats: GL2Stats): void {
  Object.assign(stats, createGL2Stats());
}

export function snapshotGL2Stats(stats: GL2Stats, frame: number): GL2FrameStats {
  return { ...stats, frame };
}
