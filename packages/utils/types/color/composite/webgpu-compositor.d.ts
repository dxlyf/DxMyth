import { CompositeOperation } from './composite-types';
export declare class WebGPUCompositor {
    private device;
    private context;
    constructor(device: GPUDevice, context: GPUCanvasContext);
    createCompositePipeline(operation: CompositeOperation): Promise<GPURenderPipeline>;
    private generateWGSLShader;
    private getWGSLBlendFunction;
    private getBlendState;
}
