/**
 * 在只有加减乘除的系统中模拟位运算
 * 假设我们处理32位整数
 */
declare class BitwiseEmulator {
    static readonly MAX_UINT32 = 4294967295;
    static readonly BIT_COUNT = 32;
    /**
     * 创建掩码 - 生成n位1的掩码
     */
    private static createMask;
    /**
     * 计算2的幂
     */
    static powerOfTwo(n: number): number;
    /**
     * 获取指定位的值 (0或1)
     */
    static getBit(value: number, bitIndex: number): number;
    /**
     * 设置指定位为1
     */
    static setBit(value: number, bitIndex: number): number;
    /**
     * 清除指定位 (设为0)
     */
    static clearBit(value: number, bitIndex: number): number;
    /**
     * 切换指定位 (0变1，1变0)
     */
    static toggleBit(value: number, bitIndex: number): number;
    /**
     * 位与运算 (AND)
     * a & b
     */
    static bitwiseAND(a: number, b: number): number;
    /**
     * 位或运算 (OR)
     * a | b
     */
    static bitwiseOR(a: number, b: number): number;
    /**
     * 位异或运算 (XOR)
     * a ^ b
     */
    static bitwiseXOR(a: number, b: number): number;
    /**
     * 位非运算 (NOT)
     * ~a
     */
    static bitwiseNOT(a: number): number;
    /**
     * 优化的位非运算 (使用补码公式)
     */
    static bitwiseNOTOptimized(a: number): number;
    /**
     * 左移运算
     * a << n
     */
    static leftShift(a: number, shiftCount: number): number;
    /**
     * 右移运算（逻辑右移，无符号）
     * a >>> n
     */
    static logicalRightShift(a: number, shiftCount: number): number;
    /**
     * 算术右移（有符号，保留符号位）
     * a >> n
     */
    static arithmeticRightShift(a: number, shiftCount: number): number;
    /**
     * 循环左移
     */
    static rotateLeft(value: number, shiftCount: number): number;
    /**
     * 循环右移
     */
    static rotateRight(value: number, shiftCount: number): number;
    /**
     * 计算1的个数（汉明重量）
     */
    static popCount(value: number): number;
    /**
     * 查找最低有效位1的位置
     */
    static findLSB(value: number): number;
    /**
     * 检查是否是2的幂
     */
    static isPowerOfTwo(value: number): boolean;
    /**
     * 将数字转换为二进制字符串
     */
    static toBinaryString(value: number, bits?: number): string;
    /**
     * 批量位运算测试
     */
    static runTests(): void;
    /**
     * 性能测试
     */
    static performanceTest(): void;
    /**
     * 验证与原生位运算的一致性
     */
    static verifyWithNative(): void;
}
/**
 * 优化版本 - 使用查找表提高性能
 */
declare class OptimizedBitwiseEmulator extends BitwiseEmulator {
    private static powerOfTwoTable;
    private static bitPatterns;
    static initialize(): void;
    /**
     * 优化的2的幂计算（使用查找表）
     */
    static powerOfTwo(n: number): number;
    /**
     * 优化的位与运算（按字节处理）
     */
    static bitwiseANDOptimized(a: number, b: number): number;
    /**
     * 优化的获取位值（使用查找表）
     */
    static getBitOptimized(value: number, bitIndex: number): number;
}
export { BitwiseEmulator, OptimizedBitwiseEmulator };
