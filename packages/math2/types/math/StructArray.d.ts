export type Transferable = ArrayBuffer | MessagePort | ImageBitmap;
declare const viewTypes: {
    Int8: Int8ArrayConstructor;
    Uint8: Uint8ArrayConstructor;
    Int16: Int16ArrayConstructor;
    Uint16: Uint16ArrayConstructor;
    Int32: Int32ArrayConstructor;
    Uint32: Uint32ArrayConstructor;
    Float32: Float32ArrayConstructor;
};
export type ViewType = keyof typeof viewTypes;
/**
 * @private
 */
declare class Struct {
    _pos1: number;
    _pos2: number;
    _pos4: number;
    _pos8: number;
    readonly _structArray: StructArray;
    size: number;
    /**
     * @param {StructArray} structArray The StructArray the struct is stored in
     * @param {number} index The index of the struct in the StructArray.
     * @private
     */
    constructor(structArray: StructArray, index: number);
}
export type StructArrayMember = {
    name: string;
    type: ViewType;
    components: number;
    offset: number;
};
export type StructArrayLayout = {
    members: Array<StructArrayMember>;
    size: number;
    alignment: number | null | undefined;
};
export interface IStructArrayLayout {
    _refreshViews: () => void;
    emplace: (...args: number[]) => number;
    emplaceBack: (...args: number[]) => number;
}
export type SerializedStructArray = {
    length: number;
    arrayBuffer: ArrayBuffer;
};
/**
 * `StructArray` provides an abstraction over `ArrayBuffer` and `TypedArray`
 * making it behave like an array of typed structs.
 *
 * Conceptually, a StructArray is comprised of elements, i.e., instances of its
 * associated struct type. Each particular struct type, together with an
 * alignment size, determines the memory layout of a StructArray whose elements
 * are of that type.  Thus, for each such layout that we need, we have
 * a corrseponding StructArrayLayout class, inheriting from StructArray and
 * implementing `emplaceBack()` and `_refreshViews()`.
 *
 * In some cases, where we need to access particular elements of a StructArray,
 * we implement a more specific subclass that inherits from one of the
 * StructArrayLayouts and adds a `get(i): T` accessor that returns a structured
 * object whose properties are proxies into the underlying memory space for the
 * i-th element.  This affords the convience of working with (seemingly) plain
 * Javascript objects without the overhead of serializing/deserializing them
 * into ArrayBuffers for efficient web worker transfer.
 *
 * @private
 */
declare class StructArray implements IStructArrayLayout {
    capacity: number;
    length: number;
    arrayBuffer: ArrayBuffer;
    int8: Int8Array;
    uint8: Uint8Array;
    int16: Int16Array;
    uint16: Uint16Array;
    int32: Int32Array;
    uint32: Uint32Array;
    float32: Float32Array;
    bytesPerElement: number;
    _reallocCount: number;
    constructor();
    /**
     * Serialize a StructArray instance.  Serializes both the raw data and the
     * metadata needed to reconstruct the StructArray base class during
     * deserialization.
     * @private
     */
    static serialize(array: StructArray, transferables?: Set<Transferable>): SerializedStructArray;
    static deserialize(input: SerializedStructArray): StructArray;
    /**
     * Resize the array to discard unused capacity.
     */
    _trim(): void;
    /**
     * Resets the the length of the array to 0 without de-allocating capacity.
     */
    clear(): void;
    /**
     * Resize the array.
     * If `n` is greater than the current length then additional elements with undefined values are added.
     * If `n` is less than the current length then the array will be reduced to the first `n` elements.
     * @param {number} n The new size of the array.
     */
    resize(n: number): void;
    /**
     * Like `resize`, but allocates exactly `n` slots — no growth multiplier or
     * default-capacity floor. Use when the final size is known up front.
     * @param {number} n The new size of the array.
     */
    resizeExact(n: number): void;
    /**
     * Indicate a planned increase in size, so that any necessary allocation may
     * be done once, ahead of time.
     * @param {number} n The expected size of the array.
     */
    reserve(n: number): void;
    /**
     * Like `reserve`, but allocates exactly `n` slots — no growth multiplier or
     * default-capacity floor. Use when the final size is known up front, so the
     * subsequent emplaceBacks fill the buffer exactly and no `_trim` is needed.
     * @param {number} n The exact final size of the array.
     */
    reserveExact(n: number): void;
    _allocate(capacity: number): void;
    /**
     * Indicate a planned increase in size, so that any necessary allocation may
     * be done once, ahead of time.
     * @param {number} n The expected number of additional elements added to the array.
     */
    reserveForAdditional(n: number): void;
    /**
     * Create TypedArray views for the current ArrayBuffer.
     */
    _refreshViews(): void;
    emplace(..._: number[]): number;
    emplaceBack(..._: number[]): number;
    destroy(): void;
}
/**
 * Given a list of member fields, create a full StructArrayLayout, in
 * particular calculating the correct byte offset for each field.  This data
 * is used at build time to generate StructArrayLayout_*#emplaceBack() and
 * other accessors, and at runtime for binding vertex buffer attributes.
 *
 * @private
 */
declare function createLayout(members: Array<{
    name: string;
    type: ViewType;
    readonly components?: number;
}>, alignment?: number): StructArrayLayout;
export { StructArray, Struct, viewTypes, createLayout };
