/**
 * buffer.mjs —— 顶点缓冲区（VBO）/ 索引缓冲区（IBO）/ 顶点数组对象（VAO）
 * ============================================================================
 * 对应 WebGL 的缓冲区 API：
 *   createBuffer / bindBuffer / bufferData / bufferSubData / deleteBuffer
 *   createVertexArray / bindVertexArray / enableVertexAttribArray
 *   vertexAttribPointer / vertexAttrib* 常量属性
 *
 * 真实 GPU 中，bufferData 把 CPU 端 TypedArray 的数据"上传到显存"（本模拟器里
 * 就是拷贝到 BufferObject.data 这个 Uint8Array）；渲染时由 GPU 按 vertexAttribPointer
 * 给出的格式（大小、类型、步长、偏移）从缓冲区取顶点数据。这里 fetchVertexAttrib
 * 实现了完全相同的取数逻辑。
 * ============================================================================
 */

/** 缓冲区对象：持有字节数据（模拟显存） */
export class BufferObject {
  constructor(id) {
    this.id = id;
    this.target = 0; // ARRAY_BUFFER / ELEMENT_ARRAY_BUFFER
    this.data = null; // Uint8Array（模拟 VRAM 字节数组）
    this.usage = 0;
    this.size = 0;
  }
}

/** 顶点属性指针配置（对应一次 vertexAttribPointer 调用） */
export class AttribPointer {
  constructor() {
    this.enabled = false;
    this.buffer = null; // BufferObject
    this.size = 4; // 每顶点分量个数（1~4）
    this.type = 0x1406; // FLOAT
    this.normalized = false;
    this.stride = 0; // 字节步长
    this.offset = 0; // 字节偏移
    // 常量属性（未启用时使用，对应 gl.vertexAttrib1f..4f）
    this.constant = [0, 0, 0, 1];
  }
}

/** 顶点数组对象：保存一组顶点属性指针 + 元素缓冲绑定（对应 gl.VAO） */
export class VertexArrayObject {
  constructor() {
    this.attribs = []; // AttribPointer[]
    this.elementBuffer = null; // 索引缓冲（ELEMENT_ARRAY_BUFFER 属于 VAO 状态）
  }
}

/** 创建默认 VAO（WebGL 中叫 default vertex array object） */
export function createDefaultVAO(maxAttribs) {
  const vao = new VertexArrayObject();
  for (let i = 0; i < maxAttribs; i++) vao.attribs.push(new AttribPointer());
  return vao;
}

/** 获取类型的字节宽度（对应 CPU 侧 TypedArray.BYTES_PER_ELEMENT） */
export function typeSize(type) {
  switch (type) {
    case 0x1400: return 1; // BYTE
    case 0x1401: return 1; // UNSIGNED_BYTE
    case 0x1402: return 2; // SHORT
    case 0x1403: return 2; // UNSIGNED_SHORT
    case 0x1404: return 4; // INT
    case 0x1405: return 4; // UNSIGNED_INT
    case 0x1406: return 4; // FLOAT
    default: return 4;
  }
}

/** 有符号读取（BYTE/SHORT/INT） */
function readSigned(buffer, byteOffset, bytes) {
  if (bytes === 1) {
    const b = buffer[byteOffset];
    return b >= 128 ? b - 256 : b;
  }
  if (bytes === 2) {
    const v = buffer[byteOffset] | (buffer[byteOffset + 1] << 8);
    return v >= 0x8000 ? v - 0x10000 : v;
  }
  return buffer[byteOffset] | (buffer[byteOffset + 1] << 8) | (buffer[byteOffset + 2] << 16) | (buffer[byteOffset + 3] << 24);
}

/** 无符号读取 */
function readUnsigned(buffer, byteOffset, bytes) {
  if (bytes === 1) return buffer[byteOffset];
  if (bytes === 2) return buffer[byteOffset] | (buffer[byteOffset + 1] << 8);
  return (buffer[byteOffset] | (buffer[byteOffset + 1] << 8) | (buffer[byteOffset + 2] << 16) | (buffer[byteOffset + 3] << 24)) >>> 0;
}

/**
 * 从缓冲区读取第 vertexIndex 个顶点的属性值（对应 GPU 的 vertex fetch 阶段）。
 * 依据 AttribPointer 的 size/type/normalized/stride/offset 逐分量解析。
 * @returns {Float32Array} 长度 size 的浮点分量
 */
export function fetchVertexAttrib(pointer, vertexIndex) {
  if (!pointer.enabled) {
    // 未启用的属性返回常量值（对应 gl.vertexAttrib* 设置）
    return Float32Array.from(pointer.constant.slice(0, Math.max(pointer.size, 4)));
  }
  const buf = pointer.buffer;
  if (!buf || !buf.data) return new Float32Array(pointer.size);

  const byteSize = typeSize(pointer.type);
  const stride = pointer.stride || (pointer.size * byteSize); // stride=0 表示紧凑排列
  const start = pointer.offset + vertexIndex * stride;
  const out = new Float32Array(pointer.size);

  for (let c = 0; c < pointer.size; c++) {
    const byteOffset = start + c * byteSize;
    let raw;
    switch (pointer.type) {
      case 0x1406: // FLOAT：按 IEEE754 4 字节解析
        raw = new DataView(buf.data.buffer, buf.data.byteOffset, buf.data.byteLength).getFloat32(byteOffset, true);
        out[c] = raw;
        break;
      case 0x1400: case 0x1402: case 0x1404: { // 有符号整型
        const v = readSigned(buf.data, byteOffset, byteSize);
        out[c] = pointer.normalized ? (v / (byteSize === 1 ? 127 : byteSize === 2 ? 32767 : 2147483647)) : v;
        break;
      }
      default: { // 无符号整型
        const v = readUnsigned(buf.data, byteOffset, byteSize);
        out[c] = pointer.normalized ? (v / (byteSize === 1 ? 255 : byteSize === 2 ? 65535 : 4294967295)) : v;
        break;
      }
    }
  }
  return out;
}

/** 把 TypedArray 拷贝成 Uint8Array 字节数据（模拟 bufferData 上传） */
export function toBytes(data) {
  if (typeof data === 'number') {
    // bufferData(target, size, usage)：只分配大小，不填数据
    return new Uint8Array(data);
  }
  if (data instanceof ArrayBuffer) return new Uint8Array(data.slice(0));
  // TypedArray
  const bytes = new Uint8Array(data.byteLength);
  new Uint8Array(data.buffer, data.byteOffset, data.byteLength).forEach((v, i) => { bytes[i] = v; });
  return bytes;
}

/** 读取索引缓冲区中的索引值（drawElements 用） */
export function readIndex(buf, indexPos, type) {
  const bytes = typeSize(type);
  if (bytes === 1) return buf.data[indexPos];
  if (bytes === 2) return buf.data[indexPos] | (buf.data[indexPos + 1] << 8);
  return (buf.data[indexPos] | (buf.data[indexPos + 1] << 8) | (buf.data[indexPos + 2] << 16) | (buf.data[indexPos + 3] << 24)) >>> 0;
}
