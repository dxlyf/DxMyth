/**
 * 几何体类
 * 管理顶点、索引数据和属性布局
 */

import type { Renderer } from './Renderer';
import type { VertexAttribute, GeometryOptions } from './types';

export class Geometry {
    private renderer: Renderer;
    private options: GeometryOptions;
    private vertexAttributes: VertexAttribute[] = [];
    private vertexBuffers: { data: ArrayBuffer; buffer: any; usage: string }[] = [];
    private indexBuffer: { data: ArrayBuffer; buffer: any; usage: string } | null = null;
    private primitiveCount: number = 0;
    private vertexCount: number = 0;
    private isDisposed: boolean = false;

    constructor(renderer: Renderer, options?: GeometryOptions) {
        this.renderer = renderer;
        this.options = {
            topology: 'triangle-list',
            primitiveRestart: false,
            primitiveRestartIndex: 0,
            ...options
        };
    }

    /**
     * 设置顶点属性布局
     * @param attributes - 顶点属性列表
     */
    setVertexAttributes(attributes: VertexAttribute[]): void {
        this.vertexAttributes = attributes;
    }

    /**
     * 获取顶点属性布局
     * @returns 顶点属性列表
     */
    getVertexAttributes(): VertexAttribute[] {
        return [...this.vertexAttributes];
    }

    /**
     * 添加顶点缓冲
     * @param data - 顶点数据
     * @param usage - 使用方式
     * @returns 缓冲索引
     */
    addVertexBuffer(data: ArrayBuffer, usage: 'static' | 'dynamic' | 'stream' = 'static'): number {
        const buffer = this.renderer.createVertexBuffer(data, usage);
        const bufferInfo = { data, buffer, usage };
        this.vertexBuffers.push(bufferInfo);
        
        // 更新顶点计数
        if (this.vertexAttributes.length > 0) {
            const stride = this.vertexAttributes[0].stride || this.calculateStride();
            this.vertexCount = data.byteLength / stride;
        }

        return this.vertexBuffers.length - 1;
    }

    /**
     * 更新顶点缓冲
     * @param index - 缓冲索引
     * @param data - 新的顶点数据
     * @param offset - 偏移量（字节）
     */
    updateVertexBuffer(index: number, data: ArrayBuffer, offset: number = 0): void {
        if (index < 0 || index >= this.vertexBuffers.length) {
            throw new Error(`Vertex buffer index out of range: ${index}`);
        }

        const bufferInfo = this.vertexBuffers[index];
        bufferInfo.data = data;
        this.renderer.updateBuffer(bufferInfo.buffer, data, offset);

        // 更新顶点计数
        if (this.vertexAttributes.length > 0) {
            const stride = this.vertexAttributes[0].stride || this.calculateStride();
            this.vertexCount = data.byteLength / stride;
        }
    }

    /**
     * 获取顶点缓冲
     * @param index - 缓冲索引
     * @returns 顶点缓冲对象
     */
    getVertexBuffer(index: number): any | null {
        if (index < 0 || index >= this.vertexBuffers.length) {
            return null;
        }
        return this.vertexBuffers[index].buffer;
    }

    /**
     * 获取所有顶点缓冲
     * @returns 顶点缓冲对象列表
     */
    getVertexBuffers(): any[] {
        return this.vertexBuffers.map(bufferInfo => bufferInfo.buffer);
    }

    /**
     * 设置索引缓冲
     * @param data - 索引数据
     * @param usage - 使用方式
     */
    setIndexBuffer(data: ArrayBuffer, usage: 'static' | 'dynamic' | 'stream' = 'static'): void {
        if (this.indexBuffer) {
            // 清理旧的索引缓冲
            // 注意：实际的清理可能需要由具体渲染器实现
        }

        const buffer = this.renderer.createIndexBuffer(data, usage);
        this.indexBuffer = { data, buffer, usage };

        // 更新图元计数
        const indexType = this.getIndexType(data);
        const indexSize = indexType === 'uint32' ? 4 : 2;
        this.primitiveCount = this.calculatePrimitiveCount(data.byteLength / indexSize);
    }

    /**
     * 更新索引缓冲
     * @param data - 新的索引数据
     * @param offset - 偏移量（字节）
     */
    updateIndexBuffer(data: ArrayBuffer, offset: number = 0): void {
        if (!this.indexBuffer) {
            throw new Error('Index buffer not set');
        }

        this.indexBuffer.data = data;
        this.renderer.updateBuffer(this.indexBuffer.buffer, data, offset);

        // 更新图元计数
        const indexType = this.getIndexType(data);
        const indexSize = indexType === 'uint32' ? 4 : 2;
        this.primitiveCount = this.calculatePrimitiveCount(data.byteLength / indexSize);
    }

    /**
     * 获取索引缓冲
     * @returns 索引缓冲对象
     */
    getIndexBuffer(): any | null {
        return this.indexBuffer?.buffer || null;
    }

    /**
     * 获取索引类型
     * @param data - 索引数据
     * @returns 索引类型
     */
    private getIndexType(data: ArrayBuffer): 'uint16' | 'uint32' {
        return data.byteLength / (data as Uint16Array | Uint32Array).length === 2 ? 'uint16' : 'uint32';
    }

    /**
     * 计算图元数量
     * @param indexCount - 索引数量
     * @returns 图元数量
     */
    private calculatePrimitiveCount(indexCount: number): number {
        switch (this.options.topology) {
            case 'point-list':
                return indexCount;
            case 'line-list':
                return indexCount / 2;
            case 'line-strip':
                return indexCount - 1;
            case 'triangle-list':
                return indexCount / 3;
            case 'triangle-strip':
                return indexCount - 2;
            case 'triangle-fan':
                return indexCount - 2;
            default:
                return 0;
        }
    }

    /**
     * 计算顶点步长
     * @returns 顶点步长（字节）
     */
    private calculateStride(): number {
        return this.vertexAttributes.reduce((total, attr) => total + attr.size * this.getTypeSize(attr.type), 0);
    }

    /**
     * 获取数据类型大小
     * @param type - 数据类型
     * @returns 大小（字节）
     */
    private getTypeSize(type: string): number {
        switch (type) {
            case 'float32':
            case 'uint32':
            case 'int32':
                return 4;
            case 'float16':
            case 'uint16':
            case 'int16':
                return 2;
            case 'uint8':
            case 'int8':
                return 1;
            default:
                return 4;
        }
    }

    /**
     * 获取顶点数量
     * @returns 顶点数量
     */
    getVertexCount(): number {
        return this.vertexCount;
    }

    /**
     * 获取图元数量
     * @returns 图元数量
     */
    getPrimitiveCount(): number {
        return this.primitiveCount;
    }

    /**
     * 获取几何体选项
     * @returns 几何体选项
     */
    getOptions(): GeometryOptions {
        return { ...this.options };
    }

    /**
     * 设置几何体选项
     * @param options - 要更新的几何体选项
     */
    setOptions(options: Partial<GeometryOptions>): void {
        this.options = { ...this.options, ...options };
    }

    /**
     * 清理几何体资源
     */
    dispose(): void {
        if (this.isDisposed) return;

        // 注意：实际的缓冲清理可能需要由具体渲染器实现
        // 这里只标记为已清理
        this.vertexBuffers = [];
        this.indexBuffer = null;
        this.isDisposed = true;
    }

    /**
     * 检查几何体是否已清理
     * @returns 是否已清理
     */
    isDisposed(): boolean {
        return this.isDisposed;
    }
}

/**
 * 创建平面几何体
 * @param renderer - 渲染器
 * @param width - 宽度
 * @param height - 高度
 * @param segmentsX - X方向分段数
 * @param segmentsY - Y方向分段数
 * @returns 平面几何体
 */
export function createPlaneGeometry(
    renderer: Renderer,
    width: number = 1,
    height: number = 1,
    segmentsX: number = 1,
    segmentsY: number = 1
): Geometry {
    const geometry = new Geometry(renderer);

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const segmentWidth = width / segmentsX;
    const segmentHeight = height / segmentsY;

    // 生成顶点和UV
    for (let y = 0; y <= segmentsY; y++) {
        for (let x = 0; x <= segmentsX; x++) {
            const u = x / segmentsX;
            const v = y / segmentsY;
            
            const px = -halfWidth + x * segmentWidth;
            const py = -halfHeight + y * segmentHeight;

            vertices.push(px, py, 0);
            uvs.push(u, v);
        }
    }

    // 生成索引
    for (let y = 0; y < segmentsY; y++) {
        for (let x = 0; x < segmentsX; x++) {
            const topLeft = y * (segmentsX + 1) + x;
            const topRight = topLeft + 1;
            const bottomLeft = (y + 1) * (segmentsX + 1) + x;
            const bottomRight = bottomLeft + 1;

            indices.push(topLeft, bottomLeft, topRight);
            indices.push(topRight, bottomLeft, bottomRight);
        }
    }

    // 合并顶点数据（位置 + UV）
    const vertexData: number[] = [];
    for (let i = 0; i < vertices.length / 3; i++) {
        vertexData.push(
            vertices[i * 3],
            vertices[i * 3 + 1],
            vertices[i * 3 + 2],
            uvs[i * 2],
            uvs[i * 2 + 1]
        );
    }

    // 设置顶点属性
    geometry.setVertexAttributes([
        { name: 'position', size: 3, type: 'float32', offset: 0, stride: 20 },
        { name: 'uv', size: 2, type: 'float32', offset: 12, stride: 20 }
    ]);

    // 添加顶点缓冲
    geometry.addVertexBuffer(new Float32Array(vertexData).buffer);

    // 设置索引缓冲
    geometry.setIndexBuffer(new Uint16Array(indices).buffer);

    return geometry;
}

/**
 * 创建立方体几何体
 * @param renderer - 渲染器
 * @param size - 立方体大小
 * @returns 立方体几何体
 */
export function createCubeGeometry(renderer: Renderer, size: number = 1): Geometry {
    const geometry = new Geometry(renderer);

    // 立方体顶点数据（位置 + UV）
    const vertices = new Float32Array([
        // 正面
        -size / 2, -size / 2, size / 2, 0, 0,
        size / 2, -size / 2, size / 2, 1, 0,
        size / 2, size / 2, size / 2, 1, 1,
        -size / 2, size / 2, size / 2, 0, 1,

        // 背面
        -size / 2, -size / 2, -size / 2, 1, 0,
        -size / 2, size / 2, -size / 2, 1, 1,
        size / 2, size / 2, -size / 2, 0, 1,
        size / 2, -size / 2, -size / 2, 0, 0,

        // 顶面
        -size / 2, size / 2, -size / 2, 0, 1,
        -size / 2, size / 2, size / 2, 0, 0,
        size / 2, size / 2, size / 2, 1, 0,
        size / 2, size / 2, -size / 2, 1, 1,

        // 底面
        -size / 2, -size / 2, -size / 2, 0, 0,
        size / 2, -size / 2, -size / 2, 1, 0,
        size / 2, -size / 2, size / 2, 1, 1,
        -size / 2, -size / 2, size / 2, 0, 1,

        // 右面
        size / 2, -size / 2, -size / 2, 1, 0,
        size / 2, size / 2, -size / 2, 1, 1,
        size / 2, size / 2, size / 2, 0, 1,
        size / 2, -size / 2, size / 2, 0, 0,

        // 左面
        -size / 2, -size / 2, -size / 2, 0, 0,
        -size / 2, -size / 2, size / 2, 1, 0,
        -size / 2, size / 2, size / 2, 1, 1,
        -size / 2, size / 2, -size / 2, 0, 1
    ]);

    // 索引数据
    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    // 设置顶点属性
    geometry.setVertexAttributes([
        { name: 'position', size: 3, type: 'float32', offset: 0, stride: 20 },
        { name: 'uv', size: 2, type: 'float32', offset: 12, stride: 20 }
    ]);

    // 添加顶点缓冲
    geometry.addVertexBuffer(vertices.buffer);

    // 设置索引缓冲
    geometry.setIndexBuffer(indices.buffer);

    return geometry;
}
