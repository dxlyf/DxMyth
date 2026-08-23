/**
 * index.mjs —— SoftGL 入口模块
 *
 * 这个文件是整套软件光栅化系统的"门面"(facade)：
 * 对外只暴露一个工厂函数 createSimGL()，让使用者像创建真实 WebGL
 * 上下文一样，一行代码拿到一个可用的模拟上下文对象。
 *
 * 真实 WebGL 中上下文的获取方式是：
 *   const gl = canvas.getContext('webgl2');
 *
 * 我们模拟为：
 *   const gl = createSimGL(width, height, canvas?);
 *
 * 如果传入一个 2D canvas，我们还会附加一个 putImage() 辅助方法，
 * 它把软件渲染出来的颜色缓冲（模拟的"显存"）一次性拷贝到浏览器
 * 的 canvas 上显示，等价于真实 WebGL 中 GPU 扫描输出到屏幕的过程。
 */

import { SimGL } from './renderer.mjs';
import { ShaderError } from './glsl.mjs';

export { SimGL, ShaderError };

/**
 * 创建并返回一个模拟 WebGL2 上下文。
 *
 * 模拟的参数说明：
 *   width  / height —— 默认帧缓冲（即"屏幕"/默认 framebuffer 0）的尺寸，
 *                      单位是像素。对应真实 WebGL 里 canvas 的 drawingBufferWidth/Height。
 *   canvas           —— 可选。如果提供，则返回的 gl 对象上会多出一个
 *                      putImage() 方法，用于把渲染结果画到浏览器 2D canvas。
 *
 * 返回的 gl 对象具备与 WebGL2RenderingContext 高度相似的 API 签名，
 * 但所有数据都保存在 CPU 侧的 JS 数组里，整个过程完全在软件中模拟。
 */
export function createSimGL(width, height, canvas) {
  const gl = new SimGL(width, height);

  // —— DOM 渲染辅助（仅浏览器环境可用）——
  // 真实 GPU 渲染完成后，画面会自动输出到显示设备。
  // 我们的软件渲染器没有"硬件输出"能力，所以提供 putImage()
  // 让用户手动把颜色缓冲同步到 canvas。它等价于：
  //   const ctx = canvas.getContext('2d');
  //   ctx.putImageData(new ImageData(gl 的颜色缓冲), 0, 0);
  if (canvas && typeof document !== 'undefined') {
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    gl.putImage = () => {
      const img = gl.toImageData();
      const id = ctx.createImageData(img.width, img.height);
      id.data.set(img.data);
      ctx.putImageData(id, 0, 0);
    };
  }

  return gl;
}

/**
 * 将模拟上下文绑定到浏览器 canvas 上。
 * 与 createSimGL 的 canvas 参数等价，但允许稍后（resize 之后）重新绑定。
 */
export function attachToCanvas(gl, canvas) {
  if (!canvas || typeof document === 'undefined') return;
  const ctx = canvas.getContext('2d');
  canvas.width = gl._defaultFramebuffer.width;
  canvas.height = gl._defaultFramebuffer.height;
  gl.putImage = () => {
    const img = gl.toImageData();
    const id = ctx.createImageData(img.width, img.height);
    id.data.set(img.data);
    ctx.putImageData(id, 0, 0);
  };
}
