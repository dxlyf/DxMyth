import { VertexBufferFormats, VertexBufferLayout } from './descriptor';
import { UInt } from './primitive';
import { IndexFormat, TextureDimension, TextureFormat, VertexFormat } from './type';
/**
 * Checks if given texture type is a 3D or 2D array texture.
 * @internal
 * @param dimension texture dimension
 * @return whether the texture type is 3D
 */
export declare function is3DTexture(dimension: TextureDimension): boolean;
/**
 * Returns the byte size of a index format.
 * @internal
 * @param format index format
 * @returns byte size of the format
 */
export declare function indexByteSize(format: IndexFormat): UInt;
/**
 * Returns the byte size of a vertex format.
 * @internal
 * @param format vertex format
 * @returns byte size
 */
export declare function vertexByteSize(format: VertexFormat): UInt;
/**
 * Returns the number of components of a vertex format.
 * @internal
 * @param format vertex format
 * @returns number of components
 */
export declare function vertexSize(format: VertexFormat): UInt;
/**
 * Returns the data type of a vertex format.
 * @internal
 * @param format vertex format
 * @returns GL data type
 */
export declare function vertexType(format: VertexFormat): UInt;
/**
 * Returns if a vertex format is normalized.
 * @internal
 * @param format vertex format
 * @returns number of components
 */
export declare function vertexNormalized(format: VertexFormat): boolean;
/**
 * Auto-calculates the offsets, strides, shaderLocation for given attribute formats.
 * @param buffers the buffer layouts
 * @return the calculated vertex buffer layout
 */
export declare function vertexBufferLayouts(buffers: VertexBufferFormats[]): VertexBufferLayout[];
/**
 * Checks if given texture format is a depth/stencil format.
 * @internal
 * @param format texture format
 * @returns whether the texture format is a depth/stencil format
 */
export declare function isDepthStencil(format: TextureFormat): boolean;
/**
 * Checks if given texture format has stencil component.
 * @internal
 * @param format texture format
 * @returns whether the texture format has stencil component
 */
export declare function hasStencil(format: TextureFormat): boolean;
//# sourceMappingURL=utils.d.ts.map