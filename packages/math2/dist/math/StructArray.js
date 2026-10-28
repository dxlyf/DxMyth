const viewTypes = {
  "Int8": Int8Array,
  "Uint8": Uint8Array,
  "Int16": Int16Array,
  "Uint16": Uint16Array,
  "Int32": Int32Array,
  "Uint32": Uint32Array,
  "Float32": Float32Array
};
class Struct {
  // When reading the ArrayBuffer as an array of different data types, arrays have different length
  // depending on data type size. So to acess the same position,
  // we need to read different indexes depending on array data size.
  // _pos1 is the index reading an array with 1 byte data,
  // _pos2 is reading 2 byte data, and so forth.
  _pos1;
  _pos2;
  _pos4;
  _pos8;
  _structArray;
  /**
   * @param {StructArray} structArray The StructArray the struct is stored in
   * @param {number} index The index of the struct in the StructArray.
   * @private
   */
  constructor(structArray, index) {
    this._structArray = structArray;
    this._pos1 = index * this.size;
    this._pos2 = this._pos1 / 2;
    this._pos4 = this._pos1 / 4;
    this._pos8 = this._pos1 / 8;
  }
}
const DEFAULT_CAPACITY = 128;
const RESIZE_MULTIPLIER = 5;
const EMPTY_BUFFER = new ArrayBuffer(0);
class StructArray {
  capacity;
  length;
  arrayBuffer;
  int8;
  uint8;
  int16;
  uint16;
  int32;
  uint32;
  float32;
  _reallocCount;
  constructor() {
    this._reallocCount = 0;
    this.capacity = 0;
    this.length = 0;
  }
  /**
   * Serialize a StructArray instance.  Serializes both the raw data and the
   * metadata needed to reconstruct the StructArray base class during
   * deserialization.
   * @private
   */
  static serialize(array, transferables) {
    array._trim();
    if (transferables && array.arrayBuffer) {
      transferables.add(array.arrayBuffer);
    }
    return {
      length: array.length,
      arrayBuffer: array.arrayBuffer
    };
  }
  static deserialize(input) {
    const structArray = Object.create(this.prototype);
    structArray.arrayBuffer = input.arrayBuffer;
    structArray.length = input.length;
    if (input.arrayBuffer) {
      structArray.capacity = input.arrayBuffer.byteLength / structArray.bytesPerElement;
    } else {
      structArray.capacity = 0;
      structArray.arrayBuffer = EMPTY_BUFFER;
    }
    structArray._refreshViews();
    return structArray;
  }
  /**
   * Resize the array to discard unused capacity.
   */
  _trim() {
    if (this.length !== this.capacity) {
      this.capacity = this.length;
      this.arrayBuffer = this.arrayBuffer.slice(0, this.length * this.bytesPerElement);
      this._refreshViews();
    }
  }
  /**
   * Resets the the length of the array to 0 without de-allocating capacity.
   */
  clear() {
    this.length = 0;
  }
  /**
   * Resize the array.
   * If `n` is greater than the current length then additional elements with undefined values are added.
   * If `n` is less than the current length then the array will be reduced to the first `n` elements.
   * @param {number} n The new size of the array.
   */
  resize(n) {
    this.reserve(n);
    this.length = n;
  }
  /**
   * Like `resize`, but allocates exactly `n` slots — no growth multiplier or
   * default-capacity floor. Use when the final size is known up front.
   * @param {number} n The new size of the array.
   */
  resizeExact(n) {
    this.reserveExact(n);
    this.length = n;
  }
  /**
   * Indicate a planned increase in size, so that any necessary allocation may
   * be done once, ahead of time.
   * @param {number} n The expected size of the array.
   */
  reserve(n) {
    if (n > this.capacity) {
      this._allocate(Math.max(n, Math.floor(this.capacity * RESIZE_MULTIPLIER), DEFAULT_CAPACITY));
    }
  }
  /**
   * Like `reserve`, but allocates exactly `n` slots — no growth multiplier or
   * default-capacity floor. Use when the final size is known up front, so the
   * subsequent emplaceBacks fill the buffer exactly and no `_trim` is needed.
   * @param {number} n The exact final size of the array.
   */
  reserveExact(n) {
    if (n > this.capacity || !this.arrayBuffer) {
      this._allocate(n);
    }
  }
  _allocate(capacity) {
    this._reallocCount++;
    this.capacity = capacity;
    this.arrayBuffer = new ArrayBuffer(this.capacity * this.bytesPerElement);
    const oldUint8Array = this.uint8;
    this._refreshViews();
    if (oldUint8Array) this.uint8.set(oldUint8Array);
  }
  /**
   * Indicate a planned increase in size, so that any necessary allocation may
   * be done once, ahead of time.
   * @param {number} n The expected number of additional elements added to the array.
   */
  reserveForAdditional(n) {
    this.reserve(this.length + n);
  }
  /**
   * Create TypedArray views for the current ArrayBuffer.
   */
  _refreshViews() {
    throw new Error("StructArray#_refreshViews() must be implemented by each concrete StructArray layout");
  }
  emplace(..._) {
    throw new Error("StructArray#emplace() must be implemented by each concrete StructArray layout");
  }
  emplaceBack(..._) {
    throw new Error("StructArray#emplaceBack() must be implemented by each concrete StructArray layout");
  }
  destroy() {
    this.int8 = this.uint8 = this.int16 = this.uint16 = this.int32 = this.uint32 = this.float32 = null;
    this.arrayBuffer = null;
  }
}
function createLayout(members, alignment = 1) {
  let offset = 0;
  let maxSize = 0;
  const layoutMembers = members.map((member) => {
    const typeSize = sizeOf(member.type);
    const memberOffset = offset = align(offset, Math.max(alignment, typeSize));
    const components = member.components || 1;
    maxSize = Math.max(maxSize, typeSize);
    offset += typeSize * components;
    return {
      name: member.name,
      type: member.type,
      components,
      offset: memberOffset
    };
  });
  const size = align(offset, Math.max(maxSize, alignment));
  return {
    members: layoutMembers,
    size,
    alignment
  };
}
function sizeOf(type) {
  return viewTypes[type].BYTES_PER_ELEMENT;
}
function align(offset, size) {
  return Math.ceil(offset / size) * size;
}
export {
  Struct,
  StructArray,
  createLayout,
  viewTypes
};
