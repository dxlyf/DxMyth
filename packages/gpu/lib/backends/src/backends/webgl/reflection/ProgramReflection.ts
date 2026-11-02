import type { NativeProgram, NativeUniformLocation } from '../native';

/** 反射得到的顶点属性信息。 */
export interface ReflectedAttribute {
  name: string;
  location: number;
  type: number;
  size: number;
}

/** 反射得到的 uniform 信息。 */
export interface ReflectedUniform {
  name: string;
  location: NativeUniformLocation;
  type: number;
  size: number;
}

/** 程序的反射结果。 */
export interface ProgramReflection {
  attributes: ReflectedAttribute[];
  uniforms: ReflectedUniform[];
}

const ARRAY_SUFFIX = /\[0\]$/;

/**
 * 解析已链接程序的活动属性与 uniform。
 *
 * WebGL 对数组 uniform 的命名固定为 `name[0]`，这里统一去掉后缀，
 * 使调用方可以按逻辑名称查找。
 */
export function reflectProgram(
  gl: WebGLRenderingContext,
  program: NativeProgram,
): ProgramReflection {
  const attributes: ReflectedAttribute[] = [];
  const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number;
  for (let index = 0; index < attributeCount; index += 1) {
    const info = gl.getActiveAttrib(program, index);
    if (info === null) {
      continue;
    }
    const location = gl.getAttribLocation(program, info.name);
    if (location < 0) {
      continue;
    }
    attributes.push({
      name: info.name,
      location,
      type: info.type,
      size: info.size,
    });
  }

  const uniforms: ReflectedUniform[] = [];
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let index = 0; index < uniformCount; index += 1) {
    const info = gl.getActiveUniform(program, index);
    if (info === null) {
      continue;
    }
    const location = gl.getUniformLocation(program, info.name);
    if (location === null) {
      // uniform 位于 uniform block 中（WebGL2）或已被驱动优化掉。
      continue;
    }
    uniforms.push({
      name: info.name.replace(ARRAY_SUFFIX, ''),
      location,
      type: info.type,
      size: info.size,
    });
  }

  return { attributes, uniforms };
}
