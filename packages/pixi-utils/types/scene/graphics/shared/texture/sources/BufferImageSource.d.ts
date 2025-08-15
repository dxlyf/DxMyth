import { TextureSource, TextureSourceOptions } from './TextureSource';
import { ExtensionMetadata } from '../../../../../extensions/Extensions';
type TypedArray = Uint16Array | Uint8Array | Int16Array | Float32Array;
/**
 * Options for creating a BufferImageSource.
 * @category rendering
 * @advanced
 */
export interface BufferSourceOptions extends TextureSourceOptions<TypedArray | ArrayBuffer> {
    width: number;
    height: number;
}
/**
 * A texture source that uses a TypedArray or ArrayBuffer as its resource.
 * It automatically determines the format based on the type of TypedArray provided.
 * @category rendering
 * @advanced
 */
export declare class BufferImageSource extends TextureSource<TypedArray | ArrayBuffer> {
    static extension: ExtensionMetadata;
    uploadMethodId: string;
    constructor(options: BufferSourceOptions);
    static test(resource: any): resource is TypedArray | ArrayBuffer;
}
export {};
