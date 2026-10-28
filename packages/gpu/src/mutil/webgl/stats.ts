import type { GL1FrameStats, GL1Stats } from './types.js';

export function createGL1Stats(): GL1Stats {
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
    textureMipmapGenerations: 0,
    framebuffersCreated: 0,
    framebufferResizes: 0,
    vertexArraysCreated: 0,
    uniformWrites: 0,
    uniformSkipped: 0,
  };
}

export function resetGL1Stats(stats: GL1Stats): void {
  Object.assign(stats, createGL1Stats());
}

export function snapshotGL1Stats(stats: GL1Stats, frame: number): GL1FrameStats {
  return { ...stats, frame };
}
