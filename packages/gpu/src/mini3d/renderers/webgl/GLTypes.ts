/**
 * The WebGL context type every backend file shares.
 *
 * Kept in its own module so `GLProgram`, `WebGLUniforms` and the setter table
 * can all reference it without importing each other.
 */

/**
 * A WebGL2 context. The WebGL1 backend uses the same object shape: every call
 * the library makes exists in both APIs, and the WebGL1-only code paths are
 * gated on `capabilities` rather than on the type.
 */
export type GL = WebGL2RenderingContext;
