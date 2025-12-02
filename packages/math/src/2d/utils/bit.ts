/**
 * 在只有加减乘除的系统中模拟位运算
 * 假设我们处理32位整数
 */
class BitwiseEmulator {
  // 最大32位无符号整数
  static readonly MAX_UINT32 = 0xFFFFFFFF;
  static readonly BIT_COUNT = 32;
  
  /**
   * 创建掩码 - 生成n位1的掩码
   */
  private static createMask(n: number): number {
    // 2^n - 1
    return this.powerOfTwo(n) - 1;
  }
  
  /**
   * 计算2的幂
   */
  static powerOfTwo(n: number): number {
    if (n === 0) return 1;
    if (n < 0) return 1 / this.powerOfTwo(-n);
    
    // 使用乘法计算2^n
    let result = 1;
    for (let i = 0; i < n; i++) {
      result = result * 2;
    }
    return result;
  }
  
  /**
   * 获取指定位的值 (0或1)
   */
  static getBit(value: number, bitIndex: number): number {
    // 将指定位移到最低位，然后检查奇偶性
    const shifted = Math.floor(value / this.powerOfTwo(bitIndex));
    return shifted % 2;
  }
  
  /**
   * 设置指定位为1
   */
  static setBit(value: number, bitIndex: number): number {
    // 如果该位已经是1，直接返回
    if (this.getBit(value, bitIndex) === 1) {
      return value;
    }
    
    // 否则加上2^bitIndex
    return value + this.powerOfTwo(bitIndex);
  }
  
  /**
   * 清除指定位 (设为0)
   */
  static clearBit(value: number, bitIndex: number): number {
    // 如果该位已经是0，直接返回
    if (this.getBit(value, bitIndex) === 0) {
      return value;
    }
    
    // 否则减去2^bitIndex
    return value - this.powerOfTwo(bitIndex);
  }
  
  /**
   * 切换指定位 (0变1，1变0)
   */
  static toggleBit(value: number, bitIndex: number): number {
    const bitValue = this.getBit(value, bitIndex);
    if (bitValue === 0) {
      return this.setBit(value, bitIndex);
    } else {
      return this.clearBit(value, bitIndex);
    }
  }
  
  /**
   * 位与运算 (AND)
   * a & b
   */
  static bitwiseAND(a: number, b: number): number {
    let result = 0;
    
    for (let i = 0; i < this.BIT_COUNT; i++) {
      const bitA = this.getBit(a, i);
      const bitB = this.getBit(b, i);
      
      if (bitA === 1 && bitB === 1) {
        result = this.setBit(result, i);
      }
    }
    
    return result;
  }
  
  /**
   * 位或运算 (OR)
   * a | b
   */
  static bitwiseOR(a: number, b: number): number {
    let result = 0;
    
    for (let i = 0; i < this.BIT_COUNT; i++) {
      const bitA = this.getBit(a, i);
      const bitB = this.getBit(b, i);
      
      if (bitA === 1 || bitB === 1) {
        result = this.setBit(result, i);
      }
    }
    
    return result;
  }
  
  /**
   * 位异或运算 (XOR)
   * a ^ b
   */
  static bitwiseXOR(a: number, b: number): number {
    let result = 0;
    
    for (let i = 0; i < this.BIT_COUNT; i++) {
      const bitA = this.getBit(a, i);
      const bitB = this.getBit(b, i);
      
      // 异或：两位不同则为1
      if ((bitA === 1 && bitB === 0) || (bitA === 0 && bitB === 1)) {
        result = this.setBit(result, i);
      }
    }
    
    return result;
  }
  
  /**
   * 位非运算 (NOT)
   * ~a
   */
  static bitwiseNOT(a: number): number {
    // 32位取反：MAX_UINT32 - a
    // 但对于有符号数需要小心处理
    let result = 0;
    
    for (let i = 0; i < this.BIT_COUNT; i++) {
      const bitA = this.getBit(a, i);
      
      // 如果原位是0，则结果位设为1
      if (bitA === 0) {
        result = this.setBit(result, i);
      }
    }
    
    return result;
  }
  
  /**
   * 优化的位非运算 (使用补码公式)
   */
  static bitwiseNOTOptimized(a: number): number {
    // 对于32位无符号整数：~a = MAX_UINT32 - a
    return this.MAX_UINT32 - a;
  }
  
  /**
   * 左移运算
   * a << n
   */
  static leftShift(a: number, shiftCount: number): number {
    if (shiftCount <= 0) return a;
    if (shiftCount >= this.BIT_COUNT) return 0;
    
    // 左移n位相当于乘以2^n
    return a * this.powerOfTwo(shiftCount);
  }
  
  /**
   * 右移运算（逻辑右移，无符号）
   * a >>> n
   */
  static logicalRightShift(a: number, shiftCount: number): number {
    if (shiftCount <= 0) return a;
    if (shiftCount >= this.BIT_COUNT) return 0;
    
    // 右移n位相当于除以2^n并向下取整
    return Math.floor(a / this.powerOfTwo(shiftCount));
  }
  
  /**
   * 算术右移（有符号，保留符号位）
   * a >> n
   */
  static arithmeticRightShift(a: number, shiftCount: number): number {
    if (shiftCount <= 0) return a;
    if (shiftCount >= this.BIT_COUNT) {
      // 如果a是负数，右移后全为1，否则全为0
      return a < 0 ? this.MAX_UINT32 : 0;
    }
    
    const isNegative = a < 0;
    let result = this.logicalRightShift(Math.abs(a), shiftCount);
    
    if (isNegative) {
      // 对于负数，需要设置高位为1
      const mask = this.createMask(this.BIT_COUNT - shiftCount);
      result = this.bitwiseNOT(result) & mask;
      result = this.bitwiseNOT(result);
    }
    
    return result;
  }
  
  /**
   * 循环左移
   */
  static rotateLeft(value: number, shiftCount: number): number {
    shiftCount = shiftCount % this.BIT_COUNT;
    if (shiftCount === 0) return value;
    
    const leftPart = this.leftShift(value, shiftCount);
    const rightPart = this.logicalRightShift(value, this.BIT_COUNT - shiftCount);
    
    return this.bitwiseOR(leftPart, rightPart);
  }
  
  /**
   * 循环右移
   */
  static rotateRight(value: number, shiftCount: number): number {
    shiftCount = shiftCount % this.BIT_COUNT;
    if (shiftCount === 0) return value;
    
    const leftPart = this.leftShift(value, this.BIT_COUNT - shiftCount);
    const rightPart = this.logicalRightShift(value, shiftCount);
    
    return this.bitwiseOR(leftPart, rightPart);
  }
  
  /**
   * 计算1的个数（汉明重量）
   */
  static popCount(value: number): number {
    let count = 0;
    
    // 使用Brian Kernighan算法思想
    let n = value;
    while (n > 0) {
      // 清除最低位的1: n & (n-1)
      const cleared = this.bitwiseAND(n, n - 1);
      count++;
      n = cleared;
    }
    
    return count;
  }
  
  /**
   * 查找最低有效位1的位置
   */
  static findLSB(value: number): number {
    if (value === 0) return -1;
    
    // 使用公式: value & -value 得到只有最低位1的数
    const lowestBit = this.bitwiseAND(value, -value);
    
    // 找到这个1在第几位
    let position = 0;
    while (lowestBit > this.powerOfTwo(position)) {
      position++;
    }
    
    return position;
  }
  
  /**
   * 检查是否是2的幂
   */
  static isPowerOfTwo(value: number): boolean {
    if (value <= 0) return false;
    
    // 2的幂的二进制表示中只有一个1
    return this.bitwiseAND(value, value - 1) === 0;
  }
  
  /**
   * 将数字转换为二进制字符串
   */
  static toBinaryString(value: number, bits: number = this.BIT_COUNT): string {
    let result = "";
    
    for (let i = bits - 1; i >= 0; i--) {
      result += this.getBit(value, i);
      if (i % 4 === 0 && i !== 0) {
        result += " ";
      }
    }
    
    return result;
  }
  
  /**
   * 批量位运算测试
   */
  static runTests(): void {
    console.log("=== 位运算模拟测试 ===\n");
    
    const testCases = [
      { a: 0b1100, b: 0b1010, name: "基本测试" },
      { a: 0b11110000, b: 0b11001100, name: "8位测试" },
      { a: 12345, b: 54321, name: "随机数测试" },
      { a: this.MAX_UINT32, b: 0, name: "边界测试" },
    ];
    
    for (const test of testCases) {
      console.log(`\n测试: ${test.name}`);
      console.log(`a = ${test.a} (0b${test.a.toString(2)})`);
      console.log(`b = ${test.b} (0b${test.b.toString(2)})`);
      
      console.log(`\na AND b = ${this.bitwiseAND(test.a, test.b)}`);
      console.log(`a OR b  = ${this.bitwiseOR(test.a, test.b)}`);
      console.log(`a XOR b = ${this.bitwiseXOR(test.a, test.b)}`);
      console.log(`NOT a   = ${this.bitwiseNOT(test.a)}`);
      console.log(`a << 2  = ${this.leftShift(test.a, 2)}`);
      console.log(`a >> 2  = ${this.logicalRightShift(test.a, 2)}`);
    }
    
    // 特殊测试
    console.log("\n=== 特殊运算测试 ===");
    
    // 循环移位测试
    const rotateValue = 0b110011001100;
    console.log(`\n循环左移测试:`);
    console.log(`原始值: ${this.toBinaryString(rotateValue, 12)}`);
    console.log(`左移4位: ${this.toBinaryString(this.rotateLeft(rotateValue, 4), 12)}`);
    
    // 汉明重量测试
    console.log(`\n汉明重量测试:`);
    console.log(`popCount(${rotateValue}) = ${this.popCount(rotateValue)}`);
    
    // 2的幂测试
    console.log(`\n2的幂测试:`);
    [1, 2, 4, 8, 16, 15, 20].forEach(n => {
      console.log(`isPowerOfTwo(${n}) = ${this.isPowerOfTwo(n)}`);
    });
  }
  
  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("\n=== 性能测试 ===\n");
    
    const iterations = 10000;
    const startTime = Date.now();
    
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      // 执行各种位运算
      const a = i * 123;
      const b = i * 456;
      
      result += this.bitwiseAND(a, b);
      result += this.bitwiseOR(a, b);
      result += this.bitwiseXOR(a, b);
      result += this.leftShift(a, 3);
      result += this.logicalRightShift(b, 2);
    }
    
    const endTime = Date.now();
    const elapsed = endTime - startTime;
    
    console.log(`执行 ${iterations} 次运算耗时: ${elapsed}ms`);
    console.log(`平均每次运算: ${(elapsed / (iterations * 5)).toFixed(4)}ms`);
    console.log(`最终结果: ${result}`);
  }
  
  /**
   * 验证与原生位运算的一致性
   */
  static verifyWithNative(): void {
    console.log("\n=== 验证与原生位运算的一致性 ===\n");
    
    const testValues = [
      0, 1, 255, 65535, 123456789, -1, -12345
    ];
    
    let allPassed = true;
    
    for (const a of testValues) {
      for (const b of testValues) {
        // 转换为32位无符号整数
        const a32 = a >>> 0;
        const b32 = b >>> 0;
        
        // 测试各种运算
        const tests = [
          {
            name: "AND",
            native: (a32 & b32) >>> 0,
            emulated: this.bitwiseAND(a32, b32)
          },
          {
            name: "OR",
            native: (a32 | b32) >>> 0,
            emulated: this.bitwiseOR(a32, b32)
          },
          {
            name: "XOR",
            native: (a32 ^ b32) >>> 0,
            emulated: this.bitwiseXOR(a32, b32)
          },
          {
            name: "NOT",
            native: (~a32) >>> 0,
            emulated: this.bitwiseNOTOptimized(a32)
          }
        ];
        
        for (const test of tests) {
          if (test.native !== test.emulated) {
            console.log(`错误: a=${a32.toString(2)}, b=${b32.toString(2)}`);
            console.log(`  ${test.name}: 原生=${test.native}, 模拟=${test.emulated}`);
            allPassed = false;
          }
        }
      }
    }
    
    if (allPassed) {
      console.log("所有测试通过！模拟位运算与原生位运算结果一致");
    } else {
      console.log("部分测试失败");
    }
  }
}

/**
 * 优化版本 - 使用查找表提高性能
 */
class OptimizedBitwiseEmulator extends BitwiseEmulator {
  // 预计算的2的幂次表
  private static powerOfTwoTable: number[] = [];
  
  // 预计算的位值表 (0-255每个字节的位模式)
  private static bitPatterns: number[][] = [];
  
  // 初始化查找表
  static initialize() {
    if (this.powerOfTwoTable.length === 0) {
      // 预计算2^0到2^31
      for (let i = 0; i < 32; i++) {
        this.powerOfTwoTable[i] = super.powerOfTwo(i);
      }
    }
    
    if (this.bitPatterns.length === 0) {
      // 预计算0-255每个数字的位模式
      for (let i = 0; i < 256; i++) {
        const bits = [];
        for (let j = 0; j < 8; j++) {
          bits[j] = super.getBit(i, j);
        }
        this.bitPatterns[i] = bits;
      }
    }
  }
  
  /**
   * 优化的2的幂计算（使用查找表）
   */
  static powerOfTwo(n: number): number {
    this.initialize();
    
    if (n >= 0 && n < 32) {
      return this.powerOfTwoTable[n];
    }
    
    // 超出查找表范围，使用原始方法
    return super.powerOfTwo(n);
  }
  
  /**
   * 优化的位与运算（按字节处理）
   */
  static bitwiseANDOptimized(a: number, b: number): number {
    this.initialize();
    
    let result = 0;
    
    // 按字节处理（4个字节）
    for (let byteIndex = 0; byteIndex < 4; byteIndex++) {
      // 提取当前字节
      const byteMask = 0xFF; // 8位掩码
      const shift = byteIndex * 8;
      
      const byteA = Math.floor(a / this.powerOfTwo(shift)) & byteMask;
      const byteB = Math.floor(b / this.powerOfTwo(shift)) & byteMask;
      
      // 字节内位运算
      let byteResult = 0;
      for (let bit = 0; bit < 8; bit++) {
        if (this.bitPatterns[byteA][bit] === 1 && 
            this.bitPatterns[byteB][bit] === 1) {
          byteResult += this.powerOfTwo(bit);
        }
      }
      
      // 合并结果
      result += byteResult * this.powerOfTwo(shift);
    }
    
    return result;
  }
  
  /**
   * 优化的获取位值（使用查找表）
   */
  static getBitOptimized(value: number, bitIndex: number): number {
    this.initialize();
    
    // 确定字节索引和位索引
    const byteIndex = Math.floor(bitIndex / 8);
    const bitInByte = bitIndex % 8;
    
    // 提取对应字节
    const shift = byteIndex * 8;
    const byteValue = Math.floor(value / this.powerOfTwo(shift)) & 0xFF;
    
    // 从查找表获取位值
    return this.bitPatterns[byteValue][bitInByte];
  }
}

// 导出模块
export { BitwiseEmulator, OptimizedBitwiseEmulator };