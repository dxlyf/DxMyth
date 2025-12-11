/**
 * WebGPU管线实现
 */

import { Pipeline } from '../Pipeline';
import type { Renderer } from '../Renderer';
import type { PipelineState, ShaderSource, VertexAttribute } from '../types';

export class WebGPUPipeline extends Pipeline {
    private pipeline: GPURenderPipeline | GPUComputePipeline | null = null;
    private vertexLayout: GPUVertexBufferLayout[] = [];
    private bindGroupLayouts: GPUBindGroupLayout[] = [];
    private bindGroups: GPUBindGroup[] = [];
    private uniformBuffers: Map<string, GPUBuffer> = new Map();
    private device: GPUDevice | null = null;

    constructor(renderer: Renderer, state: PipelineState) {
        super(renderer, state);
        this.device = renderer.getContext() as GPUDevice;
    }

    protected updatePipelineState(): void {
        // 重新创建管线
        if (this.pipeline) {
            // 注意：WebGPU中管线是不可变的，需要重新创建
            this.createPipeline();
        }
    }

    private createPipeline(): void {
        if (!this.device) {
            throw new Error('WebGPU device not available');
        }

        if (this.shaders.compute) {
            // 创建计算管线
            this.createComputePipeline();
        } else if (this.shaders.vertex && this.shaders.fragment) {
            // 创建渲染管线
            this.createRenderPipeline();
        }
    }

    private createComputePipeline(): void {
        if (!this.device || !this.shaders.compute) {
            throw new Error('Compute pipeline creation failed');
        }

        const pipelineDesc: GPUComputePipelineDescriptor = {
            layout: this.bindGroupLayouts.length > 0 ? this.device.createPipelineLayout({
                bindGroupLayouts: this.bindGroupLayouts
            }) : undefined,
            compute: {
                module: this.shaders.compute,
                entryPoint: 'main'
            },
            label: 'DxMyth Compute Pipeline'
        };

        this.pipeline = this.device.createComputePipeline(pipelineDesc);
    }

    private createRenderPipeline(): void {
        if (!this.device || !this.shaders.vertex || !this.shaders.fragment) {
            throw new Error('Render pipeline creation failed');
        }

        const primitive: GPUPrimitiveState = {
            topology: this.mapTopology(this.state.topology),
            stripIndexFormat: this.state.topology.includes('strip') ? 'uint16' : undefined,
            frontFace: this.state.frontFace === 'ccw' ? 'ccw' : 'cw',
            cullMode: this.state.cullMode === 'none' ? undefined : this.state.cullMode as GPUCullMode
        };

        const depthStencil: GPUDepthStencilState | undefined = this.state.depthTest ? {
            depthWriteEnabled: this.state.depthWrite,
            depthCompare: this.mapCompareFunction(this.state.depthCompare),
            format: 'depth24plus'
        } : undefined;

        const fragment: GPUFragmentState = {
            module: this.shaders.fragment,
            entryPoint: 'main',
            targets: [{
                format: 'rgba8unorm',
                blend: this.state.blendEnabled ? {
                    color: {
                        srcFactor: this.mapBlendFactor(this.state.blendSrcFactor),
                        dstFactor: this.mapBlendFactor(this.state.blendDstFactor),
                        operation: this.mapBlendOperation(this.state.blendEquation)
                    },
                    alpha: {
                        srcFactor: this.mapBlendFactor(this.state.blendSrcFactor),
                        dstFactor: this.mapBlendFactor(this.state.blendDstFactor),
                        operation: this.mapBlendOperation(this.state.blendEquation)
                    }
                } : undefined
            }]
        };

        const pipelineDesc: GPURenderPipelineDescriptor = {
            layout: this.bindGroupLayouts.length > 0 ? this.device.createPipelineLayout({
                bindGroupLayouts: this.bindGroupLayouts
            }) : undefined,
            vertex: {
                module: this.shaders.vertex,
                entryPoint: 'main',
                buffers: this.vertexLayout
            },
            primitive: primitive,
            depthStencil: depthStencil,
            multisample: {
                count: 1
            },
            fragment: fragment,
            label: 'DxMyth Render Pipeline'
        };

        this.pipeline = this.device.createRenderPipeline(pipelineDesc);
    }

    compileShader(source: ShaderSource): void {
        if (!this.device) {
            throw new Error('WebGPU device not available');
        }

        const shaderModule = this.device.createShaderModule({
            code: source.code,
            label: source.type === 'vertex' ? 'Vertex Shader' : 
                  source.type === 'fragment' ? 'Fragment Shader' : 'Compute Shader'
        });

        switch (source.type) {
            case 'vertex':
                this.shaders.vertex = shaderModule;
                break;
            case 'fragment':
                this.shaders.fragment = shaderModule;
                break;
            case 'compute':
                this.shaders.compute = shaderModule;
                break;
        }

        // 更新调试信息
        if (this.renderer.getDebugInfo) {
            const debugInfo = this.renderer.getDebugInfo();
            if (debugInfo) {
                debugInfo.shaderCompilations++;
            }
        }
    }

    setVertexAttributes(attributes: VertexAttribute[]): void {
        if (!attributes.length) return;

        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: attributes[0].stride,
            attributes: attributes.map((attr, index) => ({
                shaderLocation: index,
                offset: attr.offset,
                format: this.mapVertexFormat(attr.type, attr.size)
            })),
            stepMode: 'vertex'
        };

        this.vertexLayout = [vertexBufferLayout];
    }

    setVertexBuffers(buffers: GPUBuffer[]): void {
        // WebGPU中顶点缓冲是在绘制时设置的，这里不需要额外操作
    }

    setIndexBuffer(buffer: GPUBuffer): void {
        // WebGPU中索引缓冲是在绘制时设置的，这里不需要额外操作
    }

    setUniforms(uniforms: Record<string, any>): void {
        if (!this.device) {
            throw new Error('WebGPU device not available');
        }

        // 为每个uniform创建或更新缓冲
        for (const [name, value] of Object.entries(uniforms)) {
            let buffer = this.uniformBuffers.get(name);
            const byteLength = this.calculateUniformSize(value);

            if (!buffer || buffer.size < byteLength) {
                // 创建新的uniform缓冲
                if (buffer) {
                    buffer.destroy();
                }

                buffer = this.device.createBuffer({
                    size: byteLength,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                    label: `Uniform Buffer: ${name}`
                });

                this.uniformBuffers.set(name, buffer);
            }

            // 更新缓冲数据
            this.device.queue.writeBuffer(buffer, 0, this.serializeUniform(value));
        }

        // 更新绑定组
        this.updateBindGroups();
    }

    private calculateUniformSize(value: any): number {
        if (Array.isArray(value)) {
            if (value.length === 2) return 8; // vec2
            if (value.length === 3) return 12; // vec3
            if (value.length === 4) return 16; // vec4
            if (value.length === 9) return 36; // mat3
            if (value.length === 16) return 64; // mat4
        } else if (typeof value === 'number') {
            return 4; // float
        } else if (typeof value === 'object') {
            // 结构体
            return Object.values(value).reduce((total, v) => total + this.calculateUniformSize(v), 0);
        }
        return 0;
    }

    private serializeUniform(value: any): ArrayBuffer {
        const size = this.calculateUniformSize(value);
        const buffer = new ArrayBuffer(size);
        const float32View = new Float32Array(buffer);

        if (Array.isArray(value)) {
            float32View.set(value);
        } else if (typeof value === 'number') {
            float32View[0] = value;
        } else if (typeof value === 'object') {
            // 结构体
            let offset = 0;
            for (const v of Object.values(value)) {
                const vSize = this.calculateUniformSize(v);
                const vBuffer = this.serializeUniform(v);
                new Float32Array(buffer, offset).set(new Float32Array(vBuffer));
                offset += vSize;
            }
        }

        return buffer;
    }

    private updateBindGroups(): void {
        if (!this.device) {
            throw new Error('WebGPU device not available');
        }

        // 简单实现：创建一个包含所有uniform的绑定组
        const bindings: GPUBindGroupEntry[] = [];

        // 添加uniform缓冲
        let bindingIndex = 0;
        for (const [name, buffer] of this.uniformBuffers.entries()) {
            bindings.push({
                binding: bindingIndex++,
                resource: { buffer }
            });
        }

        // 添加纹理采样器
        // TODO: 实现纹理绑定

        if (bindings.length > 0) {
            // 创建绑定组布局
            const bindGroupLayoutDesc: GPUBindGroupLayoutDescriptor = {
                entries: bindings.map((binding, index) => ({
                    binding: index,
                    visibility: this.getShaderStageVisibility(),
                    buffer: {
                        type: 'uniform'
                    }
                }))
            };

            const bindGroupLayout = this.device.createBindGroupLayout(bindGroupLayoutDesc);
            this.bindGroupLayouts = [bindGroupLayout];

            // 创建绑定组
            const bindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: bindings
            });

            this.bindGroups = [bindGroup];
        }
    }

    private getShaderStageVisibility(): GPUShaderStageFlags {
        let visibility = 0;

        if (this.shaders.vertex) visibility |= GPUShaderStage.VERTEX;
        if (this.shaders.fragment) visibility |= GPUShaderStage.FRAGMENT;
        if (this.shaders.compute) visibility |= GPUShaderStage.COMPUTE;

        return visibility;
    }

    setTexture(index: number, texture: any, sampler?: any): void {
        // TODO: 实现纹理绑定
    }

    bind(): void {
        const renderPass = (this.renderer as any).currentRenderPass;
        const computePass = (this.renderer as any).currentComputePass;

        if (this.pipeline instanceof GPURenderPipeline && renderPass) {
            renderPass.setPipeline(this.pipeline);
            this.bindGroups.forEach((bindGroup, index) => {
                renderPass.setBindGroup(index, bindGroup);
            });
        } else if (this.pipeline instanceof GPUComputePipeline && computePass) {
            computePass.setPipeline(this.pipeline);
            this.bindGroups.forEach((bindGroup, index) => {
                computePass.setBindGroup(index, bindGroup);
            });
        }
    }

    unbind(): void {
        // WebGPU中不需要显式解绑
    }

    getNativePipeline(): GPURenderPipeline | GPUComputePipeline {
        if (!this.pipeline) {
            this.createPipeline();
        }
        return this.pipeline!;
    }

    dispose(): void {
        if (this.isDisposed) return;

        // 清理资源
        if (this.pipeline) {
            // WebGPU中管线没有destroy方法，由垃圾回收处理
            this.pipeline = null;
        }

        // 清理着色器模块
        if (this.shaders.vertex) {
            // WebGPU中着色器模块没有destroy方法
            this.shaders.vertex = null;
        }
        if (this.shaders.fragment) {
            this.shaders.fragment = null;
        }
        if (this.shaders.compute) {
            this.shaders.compute = null;
        }

        // 清理uniform缓冲
        for (const buffer of this.uniformBuffers.values()) {
            buffer.destroy();
        }
        this.uniformBuffers.clear();

        this.isDisposed = true;
    }

    // 辅助方法

    private mapTopology(topology: string): GPUPrimitiveTopology {
        switch (topology) {
            case 'point-list':
                return 'point-list';
            case 'line-list':
                return 'line-list';
            case 'line-strip':
                return 'line-strip';
            case 'triangle-list':
                return 'triangle-list';
            case 'triangle-strip':
                return 'triangle-strip';
            case 'triangle-fan':
                return 'triangle-fan';
            default:
                return 'triangle-list';
        }
    }

    private mapCompareFunction(func: string): GPUCompareFunction {
        switch (func) {
            case 'never':
                return 'never';
            case 'less':
                return 'less';
            case 'equal':
                return 'equal';
            case 'less-equal':
                return 'less-equal';
            case 'greater':
                return 'greater';
            case 'not-equal':
                return 'not-equal';
            case 'greater-equal':
                return 'greater-equal';
            case 'always':
                return 'always';
            default:
                return 'less';
        }
    }

    private mapBlendFactor(factor: string): GPUBlendFactor {
        switch (factor) {
            case 'zero':
                return 'zero';
            case 'one':
                return 'one';
            case 'src-color':
                return 'src-color';
            case 'one-minus-src-color':
                return 'one-minus-src-color';
            case 'src-alpha':
                return 'src-alpha';
            case 'one-minus-src-alpha':
                return 'one-minus-src-alpha';
            case 'dst-color':
                return 'dst-color';
            case 'one-minus-dst-color':
                return 'one-minus-dst-color';
            case 'dst-alpha':
                return 'dst-alpha';
            case 'one-minus-dst-alpha':
                return 'one-minus-dst-alpha';
            case 'src-alpha-saturated':
                return 'src-alpha-saturated';
            case 'blend-color':
                return 'blend-color';
            case 'one-minus-blend-color':
                return 'one-minus-blend-color';
            default:
                return 'src-alpha';
        }
    }

    private mapBlendOperation(operation: string): GPUBlendOperation {
        switch (operation) {
            case 'add':
                return 'add';
            case 'subtract':
                return 'subtract';
            case 'reverse-subtract':
                return 'reverse-subtract';
            case 'min':
                return 'min';
            case 'max':
                return 'max';
            default:
                return 'add';
        }
    }

    private mapVertexFormat(type: string, size: number): GPUVertexFormat {
        switch (type) {
            case 'float32':
                if (size === 1) return 'float32';
                if (size === 2) return 'float32x2';
                if (size === 3) return 'float32x3';
                if (size === 4) return 'float32x4';
                break;
            case 'uint32':
                if (size === 1) return 'uint32';
                if (size === 2) return 'uint32x2';
                if (size === 3) return 'uint32x3';
                if (size === 4) return 'uint32x4';
                break;
            case 'int32':
                if (size === 1) return 'sint32';
                if (size === 2) return 'sint32x2';
                if (size === 3) return 'sint32x3';
                if (size === 4) return 'sint32x4';
                break;
            case 'float16':
                if (size === 1) return 'float16';
                if (size === 2) return 'float16x2';
                if (size === 3) return 'float16x3';
                if (size === 4) return 'float16x4';
                break;
            case 'uint8':
                if (size === 1) return 'uint8';
                if (size === 2) return 'uint8x2';
                if (size === 3) return 'uint8x3';
                if (size === 4) return 'uint8x4';
                break;
            case 'int8':
                if (size === 1) return 'sint8';
                if (size === 2) return 'sint8x2';
                if (size === 3) return 'sint8x3';
                if (size === 4) return 'sint8x4';
                break;
        }
        return 'float32x4'; // 默认值
    }
}
