/**
 * 深度合并对象。
 *
 * 将 sources 中的可枚举属性递归合并到 target 上。
 *
 * 合并规则：
 * - 普通对象（plain object）与数组递归深度合并；
 * - 其他类型（Date、RegExp、原始值等）直接赋值替换；
 * - source 中值为 undefined 的属性不覆盖 target。
 *
 * @param target - 目标对象
 * @param sources - 来源对象列表（后面的优先级更高）
 * @returns 合并后的 target
 */
export declare function merge<T extends Record<string, any>>(target: T, ...sources: any[]): T;
export declare function isPrimitive(value: any): boolean;
