// webgpu-compositor.ts
import { CompositeOperation } from './composite-types';

export class WebGPUCompositor {
  private device: GPUDevice;
  private context: GPUCanvasContext;

  constructor(device: GPUDevice, context: GPUCanvasContext) {
    this.device = device;
    this.context = context;
  }

  async createCompositePipeline(operation: CompositeOperation): Promise<GPURenderPipeline> {
    const module = this.device.createShaderModule({
      code: this.generateWGSLShader(operation)
    });

    const pipeline = await this.device.createRenderPipelineAsync({
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs_main',
      },
      fragment: {
        module,
        entryPoint: 'fs_main',
        targets: [{
          format: this.context.getCurrentTexture().format,
          blend: this.getBlendState(operation),
        }],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    return pipeline;
  }

  private generateWGSLShader(operation: CompositeOperation): string {
    const blendFunction = this.getWGSLBlendFunction(operation);
    
    return `
      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) texCoord: vec2<f32>,
      };

      @group(0) @binding(0) var source: texture_2d<f32>;
      @group(0) @binding(1) var destination: texture_2d<f32>;
      @group(0) @binding(2) var source_sampler: sampler;
      @group(0) @binding(3) var destination_sampler: sampler;

      ${blendFunction}

      @vertex
      fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
        var pos = array<vec2<f32>, 6>(
          vec2<f32>(-1.0, -1.0),
          vec2<f32>(-1.0, 1.0),
          vec2<f32>(1.0, -1.0),
          vec2<f32>(-1.0, 1.0),
          vec2<f32>(1.0, 1.0),
          vec2<f32>(1.0, -1.0)
        );
        
        var tex = array<vec2<f32>, 6>(
          vec2<f32>(0.0, 0.0),
          vec2<f32>(0.0, 1.0),
          vec2<f32>(1.0, 0.0),
          vec2<f32>(0.0, 1.0),
          vec2<f32>(1.0, 1.0),
          vec2<f32>(1.0, 0.0)
        );

        var output: VertexOutput;
        output.position = vec4<f32>(pos[vertex_index], 0.0, 1.0);
        output.texCoord = tex[vertex_index];
        return output;
      }

      @fragment
      fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
        let sourceColor = textureSample(source, source_sampler, input.texCoord);
        let destColor = textureSample(destination, destination_sampler, input.texCoord);
        return applyComposite(sourceColor, destColor);
      }
    `;
  }

  private getWGSLBlendFunction(operation: CompositeOperation): string {
    switch (operation) {
      case 'source-over':
        return `
          fn applyComposite(source: vec4<f32>, destination: vec4<f32>) -> vec4<f32> {
            let alpha = source.a + destination.a * (1.0 - source.a);
            if (alpha == 0.0) {
              return vec4<f32>(0.0);
            }
            return vec4<f32>(
              (source.rgb * source.a + destination.rgb * destination.a * (1.0 - source.a)) / alpha,
              alpha
            );
          }
        `;
      
      case 'multiply':
        return `
          fn applyComposite(source: vec4<f32>, destination: vec4<f32>) -> vec4<f32> {
            let alpha = source.a + destination.a * (1.0 - source.a);
            let s = source.rgb * source.a;
            let d = destination.rgb * destination.a;
            let result = s * d;
            return vec4<f32>(result / alpha, alpha);
          }
        `;
      
      // 其他操作模式的 WGSL 实现...
      
      default:
        return this.getWGSLBlendFunction('source-over');
    }
  }

  private getBlendState(operation: CompositeOperation): GPUBlendState {
    // 对于简单的合成操作，可以使用 WebGPU 内置的混合
    switch (operation) {
      case 'source-over':
        return {
          color: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
          },
          alpha: {
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
          },
        };
      
      case 'multiply':
        return {
          color: {
            srcFactor: 'dst',
            dstFactor: 'zero',
            operation: 'add',
          },
          alpha: {
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
          },
        };
      
      default:
        return this.getBlendState('source-over');
    }
  }
}