import { GLError } from './errors.js';
import type { GLVertexFormat } from './enums.js';

export interface VertexLayoutLike {
  readonly stride: number;
  readonly attributes: readonly {
    readonly name: string;
    readonly format: string;
    readonly offset: number;
  }[];
}

export interface WebGLVertexAttribute {
  readonly location: number;
  readonly format: GLVertexFormat;
  readonly offset: number;
}

export interface WebGLVertexLayout {
  readonly stride: number;
  readonly attributes: WebGLVertexAttribute[];
}

const GL_FORMATS = new Set<string>([
  'float32x1',
  'float32x2',
  'float32x3',
  'float32x4',
  'uint32x1',
  'uint32x2',
  'uint32x3',
  'uint32x4',
  'sint32x1',
  'sint32x2',
  'sint32x3',
  'sint32x4',
  'uint16x2',
  'uint16x4',
  'sint16x2',
  'sint16x4',
  'uint8x4norm',
  'sint8x4norm',
]);

/**
 * Converts a neutral interleaved layout (from `InterleavedBuffer`) into the
 * attribute list expected by `createVertexArray`.
 */
export function toWebGLLayout(
  layout: VertexLayoutLike,
  locations: Readonly<Record<string, number>>,
  maxAttributes = 16,
): WebGLVertexLayout {
  const seen = new Set<number>();
  const attributes: WebGLVertexAttribute[] = [];

  for (const attribute of layout.attributes) {
    if (!GL_FORMATS.has(attribute.format)) {
      throw new GLError('webgl/layout', `attribute "${attribute.name}" has unsupported format "${attribute.format}"`);
    }
    const location = locations[attribute.name];
    if (location === undefined) {
      throw new GLError('webgl/layout', `missing attribute location for "${attribute.name}"`);
    }
    if (!Number.isInteger(location) || location < 0 || location >= maxAttributes) {
      throw new GLError(
        'webgl/layout',
        `attribute location ${location} for "${attribute.name}" is outside [0, ${maxAttributes})`,
      );
    }
    if (seen.has(location)) {
      throw new GLError('webgl/layout', `duplicate attribute location ${location}`);
    }
    seen.add(location);
    attributes.push({
      location,
      format: attribute.format as GLVertexFormat,
      offset: attribute.offset,
    });
  }

  return { stride: layout.stride, attributes };
}
