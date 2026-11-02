import { WebGPUError } from './errors.js';
import type { TextureHandle } from './types.js';

const SHADER = `
struct VSOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@group(0) @binding(0) var src: texture_2d<f32>;
@group(0) @binding(1) var samp: sampler;

@vertex
fn vs(@builtin(vertex_index) index: u32) -> VSOut {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0),
  );
  let position = positions[index];
  var out: VSOut;
  out.position = vec4f(position, 0.0, 1.0);
  out.uv = vec2f(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  return out;
}

@fragment
fn fs(input: VSOut) -> @location(0) vec4f {
  return textureSample(src, samp, input.uv);
}
`;

const SUPPORTED = new Set<GPUTextureFormat>([
  'rgba8unorm',
  'rgba8unorm-srgb',
  'bgra8unorm',
  'bgra8unorm-srgb',
  'rgba16float',
]);

/**
 * Generates a full mip chain with a fullscreen-triangle blit pipeline.
 * The texture must be created with TEXTURE_BINDING + RENDER_ATTACHMENT.
 */
export class MipmapGenerator {
  private readonly module: GPUShaderModule;
  private readonly sampler: GPUSampler;
  private readonly pipelines = new Map<GPUTextureFormat, GPURenderPipeline>();

  constructor(private readonly device: GPUDevice) {
    this.module = device.createShaderModule({ label: 'mipmap', code: SHADER });
    this.sampler = device.createSampler({
      label: 'mipmap',
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    });
  }

  generate(texture: TextureHandle): void {
    if (texture.mipLevels <= 1) return;
    if (!SUPPORTED.has(texture.format)) {
      throw new WebGPUError('webgpu/mipmap', `mipmap generation does not support format "${texture.format}"`);
    }
    if ((texture.usage & GPUTextureUsage.RENDER_ATTACHMENT) === 0) {
      throw new WebGPUError(
        'webgpu/mipmap',
        `texture "${texture.id}" needs TEXTURE_BINDING and RENDER_ATTACHMENT for mipmap generation`,
      );
    }
    if ((texture.usage & GPUTextureUsage.TEXTURE_BINDING) === 0) {
      throw new WebGPUError('webgpu/mipmap', `texture "${texture.id}" needs TEXTURE_BINDING`);
    }

    const pipeline = this.pipeline(texture.format);
    const encoder = this.device.createCommandEncoder({ label: 'mipmap' });

    for (let level = 1; level < texture.mipLevels; level++) {
      const source = texture.texture.createView({
        baseMipLevel: level - 1,
        mipLevelCount: 1,
      });
      const target = texture.texture.createView({
        baseMipLevel: level,
        mipLevelCount: 1,
      });
      const bindGroup = this.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: source },
          { binding: 1, resource: this.sampler },
        ],
      });
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: target,
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
          },
        ],
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();
    }

    this.device.queue.submit([encoder.finish()]);
  }

  private pipeline(format: GPUTextureFormat): GPURenderPipeline {
    const existing = this.pipelines.get(format);
    if (existing) return existing;
    const pipeline = this.device.createRenderPipeline({
      label: `mipmap:${format}`,
      layout: 'auto',
      vertex: { module: this.module, entryPoint: 'vs' },
      fragment: {
        module: this.module,
        entryPoint: 'fs',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });
    this.pipelines.set(format, pipeline);
    return pipeline;
  }
}
