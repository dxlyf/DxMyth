export { WebGLBackend } from './WebGLBackend';
export {
  WebGLContext,
  type ClearDesc,
  type DrawArraysDesc,
  type DrawDesc,
  type DrawElementsDesc,
} from './WebGLContext';
export { WebGLInfo } from './WebGLInfo';
export { StateCache } from './state/StateCache';
export { ExtensionRegistry } from './extensions/ExtensionRegistry';
export { WebGLBuffer } from './resources/WebGLBuffer';
export { WebGLShader } from './resources/WebGLShader';
export { WebGLProgram, type ProgramDesc } from './resources/WebGLProgram';
export { WebGLUniform } from './resources/WebGLUniform';
export { WebGLAttribute } from './resources/WebGLAttribute';
export { WebGLVertexArray, type VertexArrayDesc } from './resources/WebGLVertexArray';
export { WebGLTexture, type TextureUploadOptions } from './resources/WebGLTexture';
export { WebGLSampler } from './resources/WebGLSampler';
export type { Sampler } from './resources/Sampler';
export { WebGLRenderbuffer, type RenderbufferDesc } from './resources/WebGLRenderbuffer';
export {
  WebGLFramebuffer,
  type FramebufferAttachment,
  type FramebufferDesc,
} from './resources/WebGLFramebuffer';
export {
  reflectProgram,
  type ProgramReflection,
  type ReflectedAttribute,
  type ReflectedUniform,
} from './reflection/ProgramReflection';
export type { NativeBuffer, NativeProgram, NativeShader, NativeVertexArray } from './native';
