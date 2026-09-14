import { TextureFormat, UInt } from '../gpu';
/**
 * Gets the GL texel format from a texture format.
 * @internal
 * @param format texture format
 * @returns GL texel format
 */
export declare function glTexelFormat(format: TextureFormat): UInt;
/**
 * Gets the GL texel byte size from a texture format.
 * @internal
 * @param format texture format
 * @returns GL texel byte size
 */
export declare function glTexelSize(format: TextureFormat): UInt;
/**
 * Gets the GL texel type from a texture format.
 * @internal
 * @param format texture format
 * @returns GL texel size type
 */
export declare function glTexelType(format: TextureFormat): UInt;
/**
 * Gets the data type required to clear a buffer of given texture format.
 * @internal
 * @param format texture format
 * @returns FLOAT / INT / UNSIGNED_INT
 */
export declare function glClearType(format: TextureFormat): UInt;
//# sourceMappingURL=utils.d.ts.map