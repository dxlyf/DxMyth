/**
 * glsl.mjs —— GLSL ES 着色器模拟执行环境
 * ============================================================================
 * 这是整个软件光栅化器的"大脑"部分。真实的 WebGL 中，GLSL 源码被 GPU 驱动
 * 编译成硬件指令并下发到 GPU。这里我们无法直接运行硬件指令，因此：
 *
 *   1. 词法分析 (tokenize)  —— 把 GLSL 源码切成一个个 token（类似驱动里的前端解析）
 *   2. 语法分析 (Parser)    —— 把 token 组装成抽象语法树 AST
 *   3. 解释执行 (Exec)      —— 逐条解释执行 AST（用 CPU 模拟 GPU 着色器运行）
 *
 * 本模拟器支持 GLSL ES 1.00 / 3.00 的常用子集：
 *   - 类型: float / int / bool / vec2-4 / ivec2-4 / bvec2-4 / mat2-4 / sampler2D / 数组
 *   - 限定符: attribute / varying / uniform / const / in / out（ES1 与 ES3 两种风格均可）
 *   - 语句: 变量声明、if/else、for、while、do-while、return、break、continue、discard
 *   - 表达式: 算术、比较、逻辑、位运算、三元、赋值、swizzle(.xyz)、下标、自增自减
 *   - 内建函数: sin/cos/pow/mix/clamp/normalize/dot/cross/texture2D 等常用函数
 *   - 内建变量: gl_Position、gl_PointSize、gl_FragCoord、gl_FrontFacing、gl_FragColor
 *
 * Shader 对象 对应 gl.createShader/compileShader/getShaderParameter
 * Program 对象 对应 gl.createProgram/attachShader/linkProgram/useProgram
 * ============================================================================
 */

import { sampleTexture } from './texture.mjs';

/* ============================ 基础定义 ============================ */

/** 自定义错误：编译或运行错误信息会写入 getShaderInfoLog / getProgramInfoLog */
export class ShaderError extends Error {}

/** GLSL 类型关键字集合（构造器调用时也使用这些名字，如 vec3(...)） */
const TYPE_NAMES = new Set([
  'float', 'int', 'bool', 'void',
  'vec2', 'vec3', 'vec4',
  'ivec2', 'ivec3', 'ivec4',
  'bvec2', 'bvec3', 'bvec4',
  'mat2', 'mat3', 'mat4',
  'sampler2D',
]);

/** 各种修饰限定符（本模拟器识别但大多仅记录、不真正执行其语义） */
const QUALIFIERS = new Set([
  'attribute', 'varying', 'uniform', 'const', 'in', 'out', 'inout',
  'highp', 'mediump', 'lowp', 'invariant', 'smooth', 'flat', 'centroid',
]);

/** 获取 vecN / matN 的维度 N */
export function compCount(t) {
  switch (t) {
    case 'vec2': case 'ivec2': case 'bvec2': return 2;
    case 'vec3': case 'ivec3': case 'bvec3': return 3;
    case 'vec4': case 'ivec4': case 'bvec4': return 4;
    case 'mat2': return 2;
    case 'mat3': return 3;
    case 'mat4': return 4;
    default: return 0;
  }
}

export function isVec(t) { return /^(i?b?vec)[234]$/.test(t || ''); }
export function isMat(t) { return /^mat[234]$/.test(t || ''); }
export function isScalar(t) { return t === 'float' || t === 'int' || t === 'bool'; }

/** 创建 GLSL 运行时值：{ t: 类型, v: 数据 }，标量存 number，向量/矩阵存 Float32Array */
export function mk(t, v) { return { t, v }; }

/** 按类型生成零值（用于未初始化的变量 / uniform 默认值） */
export function zeroValue(t) {
  if (t === 'float' || t === 'int' || t === 'bool') return mk(t, 0);
  const n = compCount(t);
  if (isVec(t)) return mk(t, new Float32Array(n));
  if (isMat(t)) return mk(t, new Float32Array(n * n));
  if (t === 'sampler2D') return mk(t, { unit: 0, texture: null });
  throw new ShaderError('无法为类型生成零值: ' + t);
}

/** 深拷贝一个 GLSL 值（防止向量数组被多处共享引用） */
export function copyValue(v) {
  if (!v) return v;
  if (v.t === 'array') return mk('array', v.v.map(copyValue));
  if (Array.isArray(v.v)) return mk(v.t, v.v.slice());
  if (v.v instanceof Float32Array) return mk(v.t, v.v.slice());
  return mk(v.t, v.v);
}

/** 隐式类型转换：int→float、number→bool 等（GLSL 允许 int 隐式转 float） */
export function coerce(value, t) {
  if (!value) return value;
  if (value.t === t) return value;
  if (t === 'float' && value.t === 'int') return mk('float', value.v);
  if (t === 'int' && value.t === 'float') return mk('int', Math.trunc(value.v));
  if (t === 'bool') return mk('bool', value.v ? 1 : 0);
  // 数值类型互转（如 float vec 与 int vec 之间）
  if (isVec(t) && isVec(value.t) && compCount(t) === compCount(value.t)) {
    return mk(t, Float32Array.from(value.v));
  }
  return value;
}

/* ============================ 词法分析器 ============================ */

function isDigit(c) { return c >= '0' && c <= '9'; }
function isIdentStart(c) { return /[a-zA-Z_]/.test(c); }
function isIdentPart(c) { return /[a-zA-Z0-9_]/.test(c); }

/**
 * 把 GLSL 源码切成 token 流。
 * 与真实编译器的前端词法分析一一对应：数字字面量、标识符、运算符、分号等。
 * 同时处理：// 与 /* *\/ 注释、# 开头的预处理行（#version 等，直接跳过）。
 */
export function tokenize(src) {
  const tokens = [];
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];

    // 空白
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
    // 行注释
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    // 块注释
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // 预处理行（#version 300 es 等）：真实 GLSL 由预处理器处理，这里整体跳过
    if (c === '#') { while (i < n && src[i] !== '\n') i++; continue; }

    // 数字字面量（含小数点与科学计数法）
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1]))) {
      let j = i;
      let isFloat = false;
      while (j < n && (isDigit(src[j]) || src[j] === '.')) { if (src[j] === '.') isFloat = true; j++; }
      if (j < n && (src[j] === 'e' || src[j] === 'E')) {
        let k = j + 1;
        if (src[k] === '+' || src[k] === '-') k++;
        if (isDigit(src[k])) { isFloat = true; j = k; while (j < n && isDigit(src[j])) j++; }
      }
      const text = src.slice(i, j);
      tokens.push({ type: 'num', value: parseFloat(text), isFloat: isFloat || text.includes('e') || text.includes('E') });
      i = j;
      continue;
    }

    // 标识符 / 关键字
    if (isIdentStart(c)) {
      let j = i;
      while (j < n && isIdentPart(src[j])) j++;
      tokens.push({ type: 'ident', value: src.slice(i, j) });
      i = j;
      continue;
    }

    // 双字符运算符
    const two = src.slice(i, i + 2);
    if (['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '<<', '>>', '&=', '|=', '^='].includes(two)) {
      tokens.push({ type: 'op', value: two });
      i += 2;
      continue;
    }
    // 单字符运算符 / 分隔符
    if ('+-*/%<>=!&|^~(){}[];,:.?'.includes(c)) {
      tokens.push({ type: 'op', value: c });
      i++;
      continue;
    }

    throw new ShaderError(`词法错误: 无法识别的字符 '${c}'`);
  }
  tokens.push({ type: 'eof' });
  return tokens;
}

/* ============================ 语法分析器 ============================ */

/**
 * 递归下降语法分析器：把 token 流转换成 AST。
 * AST 节点统一用 { kind, ... } 表示，kind 见各方法注释。
 */
class Parser {
  constructor(tokens) {
    this.toks = tokens;
    this.pos = 0;
  }

  peek() { return this.toks[this.pos]; }
  peekAt(d = 0) { return this.toks[this.pos + d]; }
  next() { return this.toks[this.pos++]; }
  eof() { return this.peek().type === 'eof'; }
  isOp(v) { return this.peek().type === 'op' && this.peek().value === v; }
  isIdent(v) { return this.peek().type === 'ident' && this.peek().value === v; }
  expectOp(v) {
    if (!this.isOp(v)) throw new ShaderError(`语法错误: 期望 '${v}'，实际得到 '${this.peek().value}'`);
    return this.next();
  }
  expectIdent() {
    const t = this.next();
    if (t.type !== 'ident') throw new ShaderError('语法错误: 期望标识符');
    return t.value;
  }

  /** 程序 = 一系列顶层声明（全局变量 / 函数 / 精度语句） */
  parseProgram() {
    const globals = [];
    while (!this.eof()) {
      // 跳过 precision highp float; 之类的精度语句
      if (this.isIdent('precision')) {
        while (!this.isOp(';') && !this.eof()) this.next();
        this.expectOp(';');
        continue;
      }
      const decl = this.parseTopLevel();
      if (decl) globals.push(decl);
    }
    return { kind: 'program', globals };
  }

  /** 解析一组限定符，返回 [{ kind, name?, location? }] */
  parseQualifiers() {
    const quals = [];
    // 处理 layout(location = N) 形式的显式绑定（ES3 语法）
    while (this.isIdent('layout')) {
      this.next();
      this.expectOp('(');
      let location = null;
      while (!this.isOp(')') && !this.eof()) {
        const t = this.next();
        if (t.type === 'num') {
          const prev = this.toks[this.pos - 3];
          if (prev && prev.type === 'ident' && prev.value === 'location') location = t.value;
        }
      }
      this.expectOp(')');
      quals.push({ kind: 'layout', location });
    }
    while (this.peek().type === 'ident' && QUALIFIERS.has(this.peek().value)) {
      quals.push({ kind: this.next().value });
    }
    return quals;
  }

  /** 解析类型关键字，返回类型字符串 */
  parseType() {
    const t = this.next();
    if (t.type !== 'ident' || !TYPE_NAMES.has(t.value)) {
      throw new ShaderError(`语法错误: 期望类型关键字，实际得到 '${t.value}'`);
    }
    return t.value;
  }

  /** 顶层声明：函数 或 全局变量 */
  parseTopLevel() {
    const quals = this.parseQualifiers();

    let type = null;
    if (this.peek().type === 'ident' && TYPE_NAMES.has(this.peek().value)) {
      type = this.parseType();
    } else {
      if (this.isIdent('invariant')) this.next();
      if (this.peek().type === 'ident' && TYPE_NAMES.has(this.peek().value)) type = this.parseType();
      else throw new ShaderError('语法错误: 顶层声明期望类型');
    }

    // 判断是函数声明还是变量声明：标识符后面紧跟 '(' 说明是函数返回类型 + 函数名。
    // 注意这里必须用"两 token 前瞻"：不能提前消费名字，否则变量声明
    // （如 `attribute vec2 a_pos;`）在 parseVarList 里会重复读标识符。
    const nt = this.peek();
    if (nt.type === 'ident' && this.peekAt(1).type === 'op' && this.peekAt(1).value === '(') {
      // ---- 函数声明 ----
      const name = this.expectIdent();
      const params = this.parseParams();
      const body = this.parseBlock();
      return { kind: 'func', name, retType: type, params, body, quals };
    }
    // ---- 变量声明（可连续声明多个，如 float a, b = 1.0;）----
    const vars = this.parseVarList(type, quals);
    return { kind: 'vardecl', vars };
  }

  /** 形参列表： (类型 名字, ...) 或 (void) */
  parseParams() {
    this.expectOp('(');
    const params = [];
    if (this.isOp(')')) { this.next(); return params; }
    while (true) {
      const quals = this.parseQualifiers();
      const type = this.parseType();
      const name = this.expectIdent();
      let arrSize = 0;
      if (this.isOp('[')) { this.next(); if (this.peek().type === 'num') arrSize = this.next().value; this.expectOp(']'); }
      params.push({ type, name, quals, arrSize });
      if (this.isOp(',')) { this.next(); continue; }
      break;
    }
    this.expectOp(')');
    return params;
  }

  /** 变量声明列表：名字 [= 初始化器], 名字 ...; （parseType 已消费） */
  parseVarList(type, quals) {
    const vars = [];
    while (true) {
      const name = this.expectIdent();
      let arrSize = 0;
      if (this.isOp('[')) {
        this.next();
        if (this.peek().type === 'num') arrSize = this.next().value;
        this.expectOp(']');
      }
      let init = null;
      if (this.isOp('=')) { this.next(); init = this.parseExpression(); }
      vars.push({ type, name, quals, arrSize, init });
      if (this.isOp(',')) { this.next(); continue; }
      break;
    }
    this.expectOp(';');
    return vars;
  }

  /** 语句块 { ... } */
  parseBlock() {
    this.expectOp('{');
    const stmts = [];
    while (!this.isOp('}') && !this.eof()) {
      stmts.push(this.parseStatement());
    }
    this.expectOp('}');
    return { kind: 'block', stmts };
  }

  /** 语句 */
  parseStatement() {
    // 块
    if (this.isOp('{')) return this.parseBlock();
    // 分号空语句
    if (this.isOp(';')) { this.next(); return { kind: 'empty' }; }

    // 控制流关键字
    if (this.isIdent('if')) {
      this.next(); this.expectOp('(');
      const cond = this.parseExpression();
      this.expectOp(')');
      const then = this.parseStatement();
      let els = null;
      if (this.isIdent('else')) { this.next(); els = this.parseStatement(); }
      return { kind: 'if', cond, then, els };
    }
    if (this.isIdent('for')) {
      this.next(); this.expectOp('(');
      let init = null;
      if (!this.isOp(';')) init = this.parseSimpleStmt();
      this.expectOp(';');
      let cond = null;
      if (!this.isOp(';')) cond = this.parseExpression();
      this.expectOp(';');
      let step = null;
      if (!this.isOp(')')) step = this.parseExpression();
      this.expectOp(')');
      const body = this.parseStatement();
      return { kind: 'for', init, cond, step, body };
    }
    if (this.isIdent('while')) {
      this.next(); this.expectOp('(');
      const cond = this.parseExpression();
      this.expectOp(')');
      return { kind: 'while', cond, body: this.parseStatement() };
    }
    if (this.isIdent('do')) {
      this.next();
      const body = this.parseStatement();
      if (!this.isIdent('while')) throw new ShaderError('do 后面需要 while');
      this.next(); this.expectOp('(');
      const cond = this.parseExpression();
      this.expectOp(')'); this.expectOp(';');
      return { kind: 'dowhile', cond, body };
    }
    if (this.isIdent('return')) {
      this.next();
      let expr = null;
      if (!this.isOp(';')) expr = this.parseExpression();
      this.expectOp(';');
      return { kind: 'return', expr };
    }
    if (this.isIdent('break')) { this.next(); this.expectOp(';'); return { kind: 'break' }; }
    if (this.isIdent('continue')) { this.next(); this.expectOp(';'); return { kind: 'continue' }; }
    if (this.isIdent('discard')) { this.next(); this.expectOp(';'); return { kind: 'discard' }; }

    // 局部变量声明
    if (this.peek().type === 'ident' && TYPE_NAMES.has(this.peek().value)) {
      const type = this.parseType();
      const vars = this.parseVarList(type, []);
      return { kind: 'vardecl', vars };
    }

    // 普通表达式语句
    const expr = this.parseExpression();
    this.expectOp(';');
    return { kind: 'expr', expr };
  }

  /** for 循环 init 部分：变量声明或表达式 */
  parseSimpleStmt() {
    if (this.peek().type === 'ident' && TYPE_NAMES.has(this.peek().value)) {
      const type = this.parseType();
      const vars = this.parseVarList(type, []);
      return { kind: 'vardecl', vars };
    }
    return { kind: 'expr', expr: this.parseExpression() };
  }

  /* ---------------- 表达式（优先级爬升） ---------------- */

  parseExpression() { return this.parseAssignment(); }

  parseAssignment() {
    const left = this.parseTernary();
    if (this.peek().type === 'op' && ['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '|=', '^='].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseAssignment(); // 赋值右结合
      return { kind: 'assign', op, target: left, value: right };
    }
    return left;
  }

  parseTernary() {
    const cond = this.parseBinary(0);
    if (this.isOp('?')) {
      this.next();
      const a = this.parseExpression();
      this.expectOp(':');
      const b = this.parseExpression();
      return { kind: 'ternary', cond, a, b };
    }
    return cond;
  }

  // 运算符优先级表（数值越大优先级越高）
  static BIN_PREC = {
    '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5,
    '==': 6, '!=': 6,
    '<': 7, '>': 7, '<=': 7, '>=': 7,
    '<<': 8, '>>': 8,
    '+': 9, '-': 9,
    '*': 10, '/': 10, '%': 10,
  };

  parseBinary(minPrec) {
    let left = this.parseUnary();
    while (true) {
      const t = this.peek();
      if (t.type !== 'op') break;
      const prec = Parser.BIN_PREC[t.value];
      if (prec === undefined || prec < minPrec) break;
      const op = this.next().value;
      const right = this.parseBinary(prec + 1);
      left = { kind: 'binop', op, left, right };
    }
    return left;
  }

  parseUnary() {
    if (this.isOp('+') || this.isOp('-') || this.isOp('!') || this.isOp('~')) {
      const op = this.next().value;
      return { kind: 'unop', op, expr: this.parseUnary() };
    }
    if (this.isOp('++') || this.isOp('--')) {
      const op = this.next().value;
      return { kind: 'incdec', op, target: this.parseUnary(), prefix: true };
    }
    return this.parsePostfix();
  }

  parsePostfix() {
    let expr = this.parsePrimary();
    while (true) {
      if (this.isOp('(')) {
        // 函数调用 / 构造器
        this.next();
        const args = [];
        if (!this.isOp(')')) {
          while (true) {
            args.push(this.parseExpression());
            if (this.isOp(',')) { this.next(); continue; }
            break;
          }
        }
        this.expectOp(')');
        expr = { kind: 'call', callee: expr, args };
      } else if (this.isOp('[')) {
        this.next();
        const idx = this.parseExpression();
        this.expectOp(']');
        expr = { kind: 'index', base: expr, index: idx };
      } else if (this.isOp('.')) {
        this.next();
        const name = this.expectIdent();
        // .length() 方法调用
        if (this.isOp('(')) {
          this.next();
          const args = [];
          if (!this.isOp(')')) {
            while (true) {
              args.push(this.parseExpression());
              if (this.isOp(',')) { this.next(); continue; }
              break;
            }
          }
          this.expectOp(')');
          expr = { kind: 'method', obj: expr, name, args };
        } else {
          expr = { kind: 'member', base: expr, name };
        }
      } else if (this.isOp('++') || this.isOp('--')) {
        const op = this.next().value;
        expr = { kind: 'incdec', op, target: expr, prefix: false };
      } else {
        break;
      }
    }
    return expr;
  }

  parsePrimary() {
    const t = this.next();
    if (t.type === 'num') {
      return { kind: 'literal', value: mk(t.isFloat ? 'float' : 'int', t.value) };
    }
    if (t.type === 'ident') {
      if (t.value === 'true') return { kind: 'literal', value: mk('bool', 1) };
      if (t.value === 'false') return { kind: 'literal', value: mk('bool', 0) };
      return { kind: 'ident', name: t.value };
    }
    if (t.type === 'op' && t.value === '(') {
      const e = this.parseExpression();
      this.expectOp(')');
      return e;
    }
    throw new ShaderError(`语法错误: 意外的 token '${t.value}'`);
  }
}

/* ============================ 运行时值操作 ============================ */

/** swizzle 字符表：x/r/s、y/g/t、z/b/p、w/a/q 分别对应分量 0~3 */
const SWIZZLE = { x: 0, y: 1, z: 2, w: 3, r: 0, g: 1, b: 2, a: 3, s: 0, t: 1, p: 2, q: 3 };

/** 解析 swizzle 字符串，返回分量下标数组 */
function parseSwizzle(name, size) {
  const comps = [];
  for (const c of name) {
    const idx = SWIZZLE[c];
    if (idx === undefined || idx >= size) throw new ShaderError(`非法 swizzle: ${name}（向量长度 ${size}）`);
    comps.push(idx);
  }
  return comps;
}

/** 对向量做 swizzle 取分量，返回新向量 */
function swizzleValue(val, name) {
  const comps = parseSwizzle(name, compCount(val.t));
  const prefix = val.t[0] === 'i' ? 'ivec' : val.t[0] === 'b' ? 'bvec' : 'vec';
  const out = new Float32Array(comps.length);
  for (let i = 0; i < comps.length; i++) out[i] = val.v[comps[i]];
  return mk(prefix + comps.length, out);
}

/** 矩阵列向量取值：m.c0 / m[i] 返回第 i 列 */
function matColumn(m, col) {
  const n = compCount(m.t);
  const out = new Float32Array(n);
  for (let r = 0; r < n; r++) out[r] = m.v[col * n + r];
  return mk('vec' + n, out);
}

/** 纯数值运算（float 由调用方保证） */
function numOp(op, x, y) {
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return x / y;
    // GLSL float % = a - b*floor(a/b)；int % 与 JS 相同（符号同被除数）
    case '%': return x - y * Math.floor(x / y);
    case '<<': return x << y;
    case '>>': return x >> y;
    case '&': return x & y;
    case '|': return x | y;
    case '^': return x ^ y;
    default: throw new ShaderError('不支持的数值运算符: ' + op);
  }
}

/**
 * 二元算术（含向量广播、矩阵乘法）。
 * 与 GLSL 一致：int op int → int；有 float 参与 → float；
 * 向量/矩阵与标量 → 广播；mat * mat / mat * vec → 真正的矩阵乘法。
 */
function evalArith(op, a, b) {
  const aScalar = isScalar(a.t), bScalar = isScalar(b.t);

  // 标量 × 标量
  if (aScalar && bScalar) {
    const x = a.t === 'bool' ? (a.v ? 1 : 0) : a.v;
    const y = b.t === 'bool' ? (b.v ? 1 : 0) : b.v;
    const isFloat = a.t === 'float' || b.t === 'float';
    const r = numOp(op, x, y);
    if (op === '/' || op === '%') return mk(isFloat ? 'float' : 'int', isFloat ? r : Math.trunc(r));
    return mk(isFloat ? 'float' : 'int', r);
  }

  // 矩阵参与：矩阵乘矩阵 / 矩阵乘向量 / 矩阵乘标量
  if (isMat(a.t) || isMat(b.t)) {
    if (isMat(a.t) && isMat(b.t) && op === '*') {
      const n = compCount(a.t);
      const out = new Float32Array(n * n);
      for (let col = 0; col < n; col++) {
        for (let row = 0; row < n; row++) {
          let s = 0;
          for (let k = 0; k < n; k++) s += a.v[k * n + row] * b.v[col * n + k];
          out[col * n + row] = s;
        }
      }
      return mk(a.t, out);
    }
    if (isMat(a.t) && isVec(b.t) && op === '*') {
      // 矩阵 × 列向量
      const n = compCount(a.t);
      const out = new Float32Array(n);
      for (let row = 0; row < n; row++) {
        let s = 0;
        for (let k = 0; k < n; k++) s += a.v[k * n + row] * b.v[k];
        out[row] = s;
      }
      return mk('vec' + n, out);
    }
    if (isVec(a.t) && isMat(b.t) && op === '*') {
      // 行向量 × 矩阵
      const n = compCount(b.t);
      const out = new Float32Array(n);
      for (let col = 0; col < n; col++) {
        let s = 0;
        for (let k = 0; k < n; k++) s += a.v[k] * b.v[col * n + k];
        out[col] = s;
      }
      return mk('vec' + n, out);
    }
    // 矩阵 ± 矩阵、矩阵 × 标量：逐元素
    const m = isMat(a.t) ? a : b;
    const other = isMat(a.t) ? b : a;
    const out = Float32Array.from(m.v);
    if (isScalar(other.t)) {
      for (let i = 0; i < out.length; i++) out[i] = numOp(op, out[i], other.v);
    } else {
      for (let i = 0; i < out.length; i++) out[i] = numOp(op, out[i], other.v[i]);
    }
    return mk(m.t, out);
  }

  // 向量运算（含标量广播）
  const aData = aScalar ? [a.v] : a.v;
  const bData = bScalar ? [b.v] : b.v;
  const n = Math.max(aData.length, bData.length);
  const isFloat = a.t === 'float' || b.t === 'float' || /^v/.test(a.t) || /^v/.test(b.t);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = aScalar ? aData[0] : aData[i];
    const y = bScalar ? bData[0] : bData[i];
    out[i] = numOp(op, x, y);
  }
  const prefix = isFloat ? 'vec' : (a.t[0] === 'i' || b.t[0] === 'i' ? 'ivec' : 'bvec');
  return mk(prefix + n, out);
}

/** 比较运算：标量返回 bool，向量返回 bvec（GLSL 语义） */
function evalCompare(op, a, b) {
  const aData = isScalar(a.t) ? [a.v] : a.v;
  const bData = isScalar(b.t) ? [b.v] : b.v;
  const n = Math.max(aData.length, bData.length);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = aData.length === 1 ? aData[0] : aData[i];
    const y = bData.length === 1 ? bData[0] : bData[i];
    let r;
    switch (op) {
      case '==': r = x === y; break;
      case '!=': r = x !== y; break;
      case '<': r = x < y; break;
      case '>': r = x > y; break;
      case '<=': r = x <= y; break;
      case '>=': r = x >= y; break;
      default: throw new ShaderError('不支持的比较运算符: ' + op);
    }
    out[i] = r ? 1 : 0;
  }
  return mk(n === 1 ? 'bool' : 'bvec' + n, n === 1 ? out[0] : out);
}

/* ============================ 内建函数与构造器 ============================ */

/** 内建函数表：元素级函数（逐分量应用）与向量级函数 */
const BUILTINS = {
  // —— 角度与三角函数 ——
  radians: (x) => x * Math.PI / 180,
  degrees: (x) => x * 180 / Math.PI,
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos,
  atan: null, // 特殊处理：支持 1 或 2 个参数
  // —— 指数函数 ——
  pow: (a, b) => Math.pow(a, b),
  exp: Math.exp, log: Math.log, exp2: (x) => 2 ** x, log2: Math.log2,
  sqrt: Math.sqrt, inversesqrt: (x) => 1 / Math.sqrt(x),
  // —— 通用函数 ——
  abs: Math.abs, sign: (x) => Math.sign(x),
  floor: Math.floor, ceil: Math.ceil,
  fract: (x) => x - Math.floor(x),
  mod: (a, b) => a - b * Math.floor(a / b),
  min: Math.min, max: Math.max,
  clamp: (x, a, b) => Math.min(Math.max(x, a), b),
  mix: (a, b, t) => a + (b - a) * t,
  step: (edge, x) => (x < edge ? 0 : 1),
  smoothstep: (e0, e1, x) => {
    const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
    return t * t * (3 - 2 * t);
  },
};

/** 内建函数需要特殊处理（如函数签名/向量语义），在此分发 */
function callBuiltin(ctx, name, args) {
  // texture2D / texture：采样 2D 纹理（对应 WebGL 的纹理采样器）
  if (name === 'texture2D' || name === 'texture') {
    const sampler = args[0];
    const uv = args[1];
    if (!sampler || !uv) throw new ShaderError('texture2D 参数错误');
    // 通过上下文找到纹理单元上绑定的纹理，再执行采样（对应真实驱动从显存读取纹素）
    const unit = sampler.v.unit;
    const tex = ctx && ctx.state ? ctx.state.textureUnits[unit] : null;
    const out = new Float32Array(4);
    if (tex) {
      const px = sampleTexture(tex, uv.v[0], uv.v[1]);
      out[0] = px[0]; out[1] = px[1]; out[2] = px[2]; out[3] = px[3];
    } else {
      // 未绑定纹理时返回黑色（对应 WebGL 未完成纹理采样未定义，这里约定为黑）
      out[3] = 1;
    }
    return mk('vec4', out);
  }

  // 向量级内建函数
  if (name === 'length') {
    const v = args[0];
    let s = 0;
    for (const x of v.v) s += x * x;
    return mk('float', Math.sqrt(s));
  }
  if (name === 'distance') {
    const a = args[0], b = args[1];
    let s = 0;
    for (let i = 0; i < a.v.length; i++) { const d = a.v[i] - b.v[i]; s += d * d; }
    return mk('float', Math.sqrt(s));
  }
  if (name === 'dot') {
    const a = args[0], b = args[1];
    let s = 0;
    for (let i = 0; i < a.v.length; i++) s += a.v[i] * b.v[i];
    return mk('float', s);
  }
  if (name === 'cross') {
    // 仅支持 vec3
    const a = args[0].v, b = args[1].v;
    return mk('vec3', new Float32Array([
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ]));
  }
  if (name === 'normalize') {
    const v = args[0];
    let s = 0;
    for (const x of v.v) s += x * x;
    const inv = 1 / Math.sqrt(s) || 0;
    return mk(v.t, Float32Array.from(v.v, (x) => x * inv));
  }
  if (name === 'faceforward') {
    // faceforward(N, I, Nref): Nref·I < 0 ? N : -N
    const N = args[0], I = args[1], Nref = args[2];
    let dot = 0;
    for (let i = 0; i < Nref.v.length; i++) dot += Nref.v[i] * I.v[i];
    return mk(N.t, Float32Array.from(N.v, (x) => (dot < 0 ? x : -x)));
  }
  if (name === 'reflect') {
    // reflect(I, N) = I - 2*dot(N,I)*N
    const I = args[0], N = args[1];
    let d = 0;
    for (let i = 0; i < N.v.length; i++) d += N.v[i] * I.v[i];
    return mk(I.t, Float32Array.from(I.v, (x, i) => x - 2 * d * N.v[i]));
  }
  if (name === 'refract') {
    // refract(I, N, eta)
    const I = args[0], N = args[1], eta = args[2].v;
    let d = 0;
    for (let i = 0; i < N.v.length; i++) d += N.v[i] * I.v[i];
    const k = 1 - eta * eta * (1 - d * d);
    if (k < 0) return mk(I.t, new Float32Array(I.v.length));
    return mk(I.t, Float32Array.from(I.v, (x, i) => eta * x - (eta * d + Math.sqrt(k)) * N.v[i]));
  }

  // atan 双参数形式 atan(y, x)
  if (name === 'atan' && args.length === 2) {
    return elementwise((y, x) => Math.atan2(y, x), args[0], args[1]);
  }

  // 元素级函数：标量返回标量，向量逐分量返回向量
  const fn = BUILTINS[name];
  if (fn) return elementwise(fn, ...args);

  throw new ShaderError('不支持的函数: ' + name);
}

/** 元素级函数应用：标量→标量，向量→逐分量 */
function elementwise(fn, ...args) {
  const vecArg = args.find((a) => isVec(a.t));
  if (!vecArg) {
    // 全部标量
    const isFloat = args.some((a) => a.t === 'float');
    let result = fn(...args.map((a) => a.v));
    // min/max 返回参数类型：若存在 float 则返回 float
    return mk(isFloat ? 'float' : 'int', result);
  }
  const n = vecArg.v.length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const vals = args.map((a) => (isScalar(a.t) ? a.v : a.v[i]));
    out[i] = fn(...vals);
  }
  return mk(vecArg.t[0] === 'i' ? 'ivec' + n : 'vec' + n, out);
}

/**
 * 类型构造器：vec3(1.0)、vec4(vec3, 1.0)、mat4(1.0)、mat3(mat4) 等。
 * 与 GLSL 一致：标量构造向量时填充所有分量；矩阵默认单位阵。
 */
function construct(type, args) {
  const n = compCount(type);

  // 标量类型
  if (type === 'float') return mk('float', +args[0].v);
  if (type === 'int') return mk('int', Math.trunc(args[0].v));
  if (type === 'bool') return mk('bool', args[0].v ? 1 : 0);

  // 向量类型
  if (isVec(type)) {
    // 单个标量参数 → 所有分量相同（如 vec3(1.0)）
    if (args.length === 1 && isScalar(args[0].t)) {
      const out = new Float32Array(n).fill(args[0].v);
      return mk(type, out);
    }
    // 单个同类型向量 → 直接拷贝
    if (args.length === 1 && args[0].t === type) return copyValue(args[0]);
    // 多个参数 → 展平各参数分量，截取/补齐到 n
    const flat = [];
    for (const a of args) {
      if (isScalar(a.t)) flat.push(a.v);
      else for (const x of a.v) flat.push(x);
    }
    while (flat.length < n) flat.push(0);
    return mk(type, Float32Array.from(flat.slice(0, n)));
  }

  // 矩阵类型
  if (isMat(type)) {
    // 无参 → 单位阵
    if (args.length === 0) {
      const out = new Float32Array(n * n);
      for (let i = 0; i < n; i++) out[i * n + i] = 1;
      return mk(type, out);
    }
    // 单个标量 → 对角阵
    if (args.length === 1 && isScalar(args[0].t)) {
      const out = new Float32Array(n * n);
      for (let i = 0; i < n; i++) out[i * n + i] = args[0].v;
      return mk(type, out);
    }
    // matN(matN) 类型转换：mat3(mat4) 取左上 3x3；mat4(mat3) 用单位阵补全
    if (args.length === 1 && isMat(args[0].t)) {
      const out = new Float32Array(n * n);
      const src = args[0].v, sn = compCount(args[0].t);
      for (let c = 0; c < Math.min(n, sn); c++) {
        for (let r = 0; r < Math.min(n, sn); r++) out[c * n + r] = src[c * sn + r];
      }
      for (let i = 0; i < n; i++) out[i * n + i] = out[i * n + i] || 1;
      return mk(type, out);
    }
    // 按列构造：mat4(v0, v1, v2, v3) 每个参数一列
    if (args.length === n && args.every((a) => isVec(a.t))) {
      const out = new Float32Array(n * n);
      for (let c = 0; c < n; c++) {
        for (let r = 0; r < n; r++) out[c * n + r] = args[c].v[r] || 0;
      }
      return mk(type, out);
    }
    throw new ShaderError('不支持的矩阵构造参数');
  }

  throw new ShaderError('不支持的构造器: ' + type);
}

/* ============================ 解释执行器（CPU 模拟 GPU 着色器） ============================ */

/**
 * Exec：树遍历式解释器。
 * 作用域采用栈式（scope chain），与 GLSL 的词法作用域一致。
 * 用 throw 异常来实现 break / continue / return / discard 等控制流跳转
 * （类似编译器中的异常处理跳转机制）。
 */
class Exec {
  /**
   * @param {Map} scope    全局作用域（uniforms/全局变量/内建变量）
   * @param {Map} funcs    用户函数表 name → { params, body, retType }
   * @param {object|null} ctx  SimGL 上下文（用于纹理采样）
   */
  constructor(scope, funcs, ctx) {
    this.scopes = [scope];
    this.funcs = funcs;
    this.ctx = ctx;
  }

  lookup(name) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) return this.scopes[i].get(name);
    }
    throw new ShaderError('未定义的变量: ' + name);
  }

  declare(name, val) {
    this.scopes[this.scopes.length - 1].set(name, val);
  }

  /**
   * 赋值：写入变量"实际所在"的作用域。
   * 注意：不能用 declare()——declare 总是写最内层作用域（用于声明新变量），
   * 而赋值 `gl_Position = ...` 必须更新外层已存在的变量。否则顶点着色器里的
   * gl_Position 赋值会写进 main 函数的块级局部作用域，外层永远读不到。
   */
  assignTo(name, val) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) {
        this.scopes[i].set(name, val);
        return;
      }
    }
    throw new ShaderError('未定义的变量: ' + name);
  }

  /* ---------------- 语句 ---------------- */

  execStmt(node) {
    switch (node.kind) {
      case 'block': {
        this.scopes.push(new Map());
        try {
          for (const s of node.stmts) this.execStmt(s);
        } finally {
          this.scopes.pop();
        }
        return;
      }
      case 'vardecl': {
        for (const v of node.vars) {
          if (v.arrSize) {
            // 数组声明：float a[4] → 数组值
            const arr = [];
            for (let i = 0; i < v.arrSize; i++) arr.push(zeroValue(v.type));
            this.declare(v.name, mk('array', arr));
          } else {
            let val = v.init ? this.execExpr(v.init) : zeroValue(v.type);
            this.declare(v.name, coerce(val, v.type));
          }
        }
        return;
      }
      case 'expr':
        this.execExpr(node.expr);
        return;
      case 'empty':
        return;
      case 'if': {
        const cond = this.execExpr(node.cond);
        if (cond.v) this.execStmt(node.then);
        else if (node.els) this.execStmt(node.els);
        return;
      }
      case 'for': {
        this.scopes.push(new Map());
        try {
          if (node.init) this.execStmt(node.init);
          while (true) {
            if (node.cond && !this.execExpr(node.cond).v) break;
            try {
              this.execStmt(node.body);
            } catch (e) {
              if (e && e.ctrl === 'break') break;
              if (e && e.ctrl === 'continue') { /* 跳到步进 */ }
              else throw e;
            }
            if (node.step) this.execExpr(node.step);
          }
        } finally {
          this.scopes.pop();
        }
        return;
      }
      case 'while': {
        while (this.execExpr(node.cond).v) {
          try {
            this.execStmt(node.body);
          } catch (e) {
            if (e && e.ctrl === 'break') break;
            if (e && e.ctrl === 'continue') continue;
            throw e;
          }
        }
        return;
      }
      case 'dowhile': {
        do {
          try {
            this.execStmt(node.body);
          } catch (e) {
            if (e && e.ctrl === 'break') break;
            if (e && e.ctrl === 'continue') continue;
            throw e;
          }
        } while (this.execExpr(node.cond).v);
        return;
      }
      case 'return': {
        const val = node.expr ? this.execExpr(node.expr) : undefined;
        throw { ctrl: 'return', value: val };
      }
      case 'break': throw { ctrl: 'break' };
      case 'continue': throw { ctrl: 'continue' };
      case 'discard': throw { ctrl: 'discard' };
      default:
        throw new ShaderError('不支持的语句节点: ' + node.kind);
    }
  }

  /** 执行用户自定义函数体，返回其返回值（无 return 时返回零值） */
  callUserFunc(fn, args, retType) {
    const scope = new Map();
    fn.params.forEach((p, i) => {
      const a = args[i];
      scope.set(p.name, coerce(a, p.type));
    });
    this.scopes.push(scope);
    try {
      this.execStmt(fn.body);
      return retType === 'void' ? undefined : zeroValue(retType);
    } catch (e) {
      if (e && e.ctrl === 'return') return e.value;
      throw e;
    } finally {
      this.scopes.pop();
    }
  }

  /* ---------------- 表达式 ---------------- */

  execExpr(node) {
    switch (node.kind) {
      case 'literal': return node.value;
      case 'ident': return this.lookup(node.name);

      case 'binop': {
        const a = this.execExpr(node.left);
        const b = this.execExpr(node.right);
        if (node.op === '&&') return mk('bool', (a.v && b.v) ? 1 : 0);
        if (node.op === '||') return mk('bool', (a.v || b.v) ? 1 : 0);
        if (node.op === '==' || node.op === '!=' || node.op === '<' || node.op === '>' || node.op === '<=' || node.op === '>=') {
          return evalCompare(node.op, a, b);
        }
        return evalArith(node.op, a, b);
      }

      case 'unop': {
        const v = this.execExpr(node.expr);
        switch (node.op) {
          case '-': return mk(v.t, -v.v);
          case '+': return v;
          case '!': return mk('bool', v.v ? 0 : 1);
          case '~': return mk('int', ~v.v);
          default: throw new ShaderError('不支持的一元运算符: ' + node.op);
        }
      }

      case 'ternary': {
        const c = this.execExpr(node.cond);
        return this.execExpr(c.v ? node.a : node.b);
      }

      case 'assign': {
        const lv = this.deref(node.target);
        const val = this.execExpr(node.value);
        if (node.op === '=') {
          const cur = lv.get();
          lv.set(coerce(val, cur ? cur.t : val.t));
          return lv.get();
        }
        // 复合赋值 a += b 等价于 a = a + b
        const cur = lv.get();
        const combined = evalArith(node.op.slice(0, -1), cur, val);
        lv.set(coerce(combined, cur.t));
        return lv.get();
      }

      case 'incdec': {
        const lv = this.deref(node.target);
        const cur = lv.get();
        const inc = node.op === '++' ? 1 : -1;
        const newVal = mk(cur.t, cur.v + inc);
        lv.set(newVal);
        return node.prefix ? newVal : cur;
      }

      case 'index': {
        const base = this.execExpr(node.base);
        const idx = this.execExpr(node.index);
        return this.indexGet(base, idx.v | 0);
      }

      case 'member': {
        const base = this.execExpr(node.base);
        return this.memberGet(base, node.name);
      }

      case 'method': {
        // 目前支持 .length()：返回分量个数
        if (node.name === 'length' && node.args.length === 0) {
          const base = this.execExpr(node.obj);
          return mk('int', compCount(base.t));
        }
        throw new ShaderError('不支持的方法: ' + node.name);
      }

      case 'call': {
        const callee = node.callee;
        // 构造器：callee 是类型名
        if (callee.kind === 'ident' && TYPE_NAMES.has(callee.name)) {
          const args = node.args.map((a) => this.execExpr(a));
          return construct(callee.name, args);
        }
        // 函数调用（用户函数或内建函数）
        const name = callee.kind === 'ident' ? callee.name : null;
        if (name === null) throw new ShaderError('不支持的调用形式');
        const args = node.args.map((a) => this.execExpr(a));
        if (this.funcs.has(name)) {
          const fn = this.funcs.get(name);
          const ret = this.callUserFunc(fn, args, fn.retType);
          return ret === undefined ? zeroValue('float') : ret;
        }
        return callBuiltin(this.ctx, name, args);
      }

      default:
        throw new ShaderError('不支持的表达式节点: ' + node.kind);
    }
  }

  /** 下标读取：数组元素 / 向量分量 / 矩阵列 */
  indexGet(base, i) {
    if (base.t === 'array') return base.v[i];
    if (isMat(base.t)) return matColumn(base, i);
    if (isVec(base.t)) {
      const t = base.t[0] === 'i' ? 'int' : base.t[0] === 'b' ? 'bool' : 'float';
      return mk(t, base.v[i]);
    }
    throw new ShaderError('不能对 ' + base.t + ' 使用下标');
  }

  /** 成员读取：swizzle（.xyz / .rgba）或矩阵列（.c0） */
  memberGet(base, name) {
    if (isVec(base.t)) return swizzleValue(base, name);
    if (isMat(base.t)) {
      if (/^c[0-3]$/.test(name)) return matColumn(base, +name[1]);
      throw new ShaderError('矩阵不支持成员 ' + name);
    }
    // 标量 .x 返回自身（GLSL 允许）
    if (isScalar(base.t) && name === 'x') return base;
    throw new ShaderError('不支持成员访问: ' + name);
  }

  /**
   * 解析左值（赋值目标）：变量 / a[i] / a.xyz / m.c0 等。
   * 返回 { get(), set(value), setComponent(i, v) }。
   */
  deref(node) {
    if (node.kind === 'ident') {
      const name = node.name;
      return {
        get: () => this.lookup(name),
        set: (v) => { this.assignTo(name, v); },
        setComponent: (i, x) => { this.lookup(name).v[i] = x; },
      };
    }
    if (node.kind === 'index') {
      const base = this.deref(node.base);
      const idx = this.execExpr(node.index);
      const i = idx.v | 0;
      const cur = base.get();
      if (cur.t === 'array') {
        return { get: () => cur.v[i], set: (v) => { cur.v[i] = v; } };
      }
      if (isMat(cur.t)) {
        const n = compCount(cur.t);
        const start = i * n;
        return {
          get: () => mk('vec' + n, cur.v.slice(start, start + n)),
          set: (v) => { cur.v.set(v.v, start); },
          setComponent: (j, x) => { cur.v[start + j] = x; },
        };
      }
      if (isVec(cur.t)) {
        return {
          get: () => mk('float', cur.v[i]),
          set: (v) => { cur.v[i] = v.v; },
        };
      }
      throw new ShaderError('不能对 ' + cur.t + ' 下标赋值');
    }
    if (node.kind === 'member') {
      const base = this.deref(node.base);
      const cur = base.get();
      if (isVec(cur.t)) {
        const comps = parseSwizzle(node.name, compCount(cur.t));
        if (new Set(comps).size !== comps.length) {
          throw new ShaderError('swizzle 赋值不能重复分量: ' + node.name);
        }
        return {
          get: () => swizzleValue(cur, node.name),
          set: (v) => { for (let k = 0; k < comps.length; k++) cur.v[comps[k]] = v.v[k]; },
        };
      }
      if (isMat(cur.t) && /^c[0-3]$/.test(node.name)) {
        const c = +node.name[1];
        const n = compCount(cur.t);
        const start = c * n;
        return {
          get: () => mk('vec' + n, cur.v.slice(start, start + n)),
          set: (v) => { cur.v.set(v.v, start); },
        };
      }
      if (isScalar(cur.t) && node.name === 'x') {
        return { get: () => cur, set: (v) => { base.set(coerce(v, cur.t)); } };
      }
      throw new ShaderError('不可赋值的成员: ' + node.name);
    }
    throw new ShaderError('不是有效的赋值目标');
  }
}

/* ============================ Shader / Program 对象 ============================ */

/**
 * Shader：对应 gl.createShader + shaderSource + compileShader。
 * 只做"编译"（词法+语法分析），不负责与其他阶段的对接。
 */
export class Shader {
  constructor(type, source) {
    this.type = type; // 'vertex' | 'fragment'
    this.source = source;
    this.compileStatus = false;
    this.log = '';
    this.ast = null;
  }

  compile() {
    try {
      const tokens = tokenize(this.source);
      this.ast = new Parser(tokens).parseProgram();
      this.compileStatus = true;
      this.log = '编译成功';
    } catch (e) {
      this.compileStatus = false;
      this.log = e.message || String(e);
    }
    return this.compileStatus;
  }

  /** 遍历全局声明，收集 uniforms / 输入 / 输出 / 常量 / 函数 */
  collect() {
    const info = { uniforms: [], inputs: [], outputs: [], consts: [], globals: [], funcs: [] };
    for (const g of this.ast.globals) {
      if (g.kind === 'func') {
        info.funcs.push(g);
        continue;
      }
      for (const v of g.vars) {
        const q = new Set(v.quals.map((x) => x.kind));
        if (q.has('uniform')) info.uniforms.push(v);
        else if (q.has('const')) info.consts.push(v);
        else if (q.has('attribute') || (this.type === 'vertex' && q.has('in'))) info.inputs.push(v);
        else if (this.type === 'vertex' && (q.has('varying') || q.has('out'))) info.outputs.push(v);
        else if (this.type === 'fragment' && (q.has('varying') || q.has('in'))) info.inputs.push(v);
        else if (this.type === 'fragment' && q.has('out')) info.outputs.push(v);
        else info.globals.push(v);
      }
    }
    return info;
  }
}

/**
 * Program：对应 gl.createProgram + attachShader + linkProgram。
 * 链接阶段负责：
 *   1. 检查两个阶段 main 函数是否存在；
 *   2. 匹配顶点输出与片段输入（varying 一致性）；
 *   3. 为 attribute / uniform 分配位置（location）；
 *   4. 汇总用户函数表。
 * 运行阶段由 runVertex / runFragment 完成整段着色器的解释执行。
 */
export class Program {
  constructor(ctx) {
    this.ctx = ctx;
    this.shaders = [];
    this.linkStatus = false;
    this.log = '';

    // 链接后元数据
    this.vertexInputs = []; // 顶点属性 [{name,type,location}]
    this.vertexOutputs = []; // 顶点输出的 varying [{name,type}]
    this.fragmentInputs = [];
    this.fragmentOutputs = []; // out 变量名（ES1 时为 ['gl_FragColor']）
    this.uniforms = []; // [{name,type,location}]
    this.uniformValues = new Map(); // name → 当前值（GLSLValue）
    this.uniformNameByLoc = new Map();
    this.funcs = new Map();
    this.constInits = []; // 需要先于 main 求值的常量初始化器
  }

  attach(shader) {
    this.shaders.push(shader);
  }

  link() {
    this.log = '';
    const vertex = this.shaders.find((s) => s.type === 'vertex');
    const fragment = this.shaders.find((s) => s.type === 'fragment');

    if (!vertex || !fragment) {
      this.linkStatus = false;
      this.log = '必须同时附加顶点着色器和片段着色器';
      return false;
    }
    if (!vertex.compileStatus || !fragment.compileStatus) {
      this.linkStatus = false;
      this.log = '存在编译失败的着色器';
      return false;
    }

    const vInfo = vertex.collect();
    const fInfo = fragment.collect();

    // 检查 main 函数
    const hasMain = (info) => info.funcs.some((f) => f.name === 'main');
    if (!hasMain(vInfo) || !hasMain(fInfo)) {
      this.linkStatus = false;
      this.log = '两个阶段都必须定义 main 函数';
      return false;
    }

    // 顶点输入（attributes）：分配 location
    let nextLoc = 0;
    this.vertexInputs = [];
    for (const v of vInfo.inputs) {
      const layout = v.quals.find((x) => x.kind === 'layout');
      const loc = layout && layout.location != null ? layout.location : nextLoc;
      nextLoc = Math.max(nextLoc, loc + 1);
      this.vertexInputs.push({ name: v.name, type: v.type, location: loc });
    }

    // varying 匹配检查（顶点输出 ⊆ 片段输入）
    this.vertexOutputs = vInfo.outputs.map((v) => ({ name: v.name, type: v.type }));
    this.fragmentInputs = fInfo.inputs
      .map((v) => v.name)
      .filter((n) => !n.startsWith('gl_'));
    for (const fi of this.fragmentInputs) {
      if (!this.vertexOutputs.some((o) => o.name === fi)) {
        this.log += `警告: 片段着色器输入的 varying '${fi}' 在顶点着色器中未输出\n`;
      }
    }

    // 片段输出：ES3 用 out 声明；ES1 用内建的 gl_FragColor
    this.fragmentOutputs = fInfo.outputs.length
      ? fInfo.outputs.map((v) => v.name)
      : ['gl_FragColor'];

    // uniforms：统一收集两个阶段，分配 location
    const uniformNames = new Map(); // name → type
    for (const v of [...vInfo.uniforms, ...fInfo.uniforms]) {
      if (!uniformNames.has(v.name)) uniformNames.set(v.name, v.type);
    }
    this.uniforms = [];
    this.uniformValues = new Map();
    this.uniformNameByLoc = new Map();
    let loc = 0;
    for (const [name, type] of uniformNames) {
      const u = { name, type, location: loc };
      this.uniforms.push(u);
      this.uniformValues.set(name, zeroValue(type));
      this.uniformNameByLoc.set(loc, name);
      loc++;
    }

    // 用户函数表：必须按阶段分开保存！
    // 顶点与片段着色器可以各自定义 main 与辅助函数；若混在一个 Map 中，
    // 片段的 main 会覆盖顶点的 main（或反之），导致两个阶段执行同一段代码。
    // 真实 GLSL 中每个阶段都是独立编译、独立的函数作用域，这里完全等价。
    this.funcs = new Map(); // 合并表（仅作诊断用，运行时不再引用）
    this.vertexFuncs = new Map();
    this.fragmentFuncs = new Map();
    for (const f of vInfo.funcs) {
      const fn = { params: f.params, body: f.body, retType: f.retType };
      this.funcs.set(f.name, fn);
      this.vertexFuncs.set(f.name, fn);
    }
    for (const f of fInfo.funcs) {
      const fn = { params: f.params, body: f.body, retType: f.retType };
      this.funcs.set(f.name, fn);
      this.fragmentFuncs.set(f.name, fn);
    }

    // 收集需要先初始化的全局常量/全局变量
    this.constInits = [...vInfo.consts, ...fInfo.consts, ...vInfo.globals, ...fInfo.globals];

    this.linkStatus = true;
    this.log += '链接成功';
    return true;
  }

  /** 查询 attribute 位置（对应 gl.getAttribLocation） */
  getAttribLocation(name) {
    const a = this.vertexInputs.find((x) => x.name === name);
    return a ? a.location : -1;
  }

  /** 查询 uniform 位置（对应 gl.getUniformLocation） */
  getUniformLocation(name) {
    const u = this.uniforms.find((x) => x.name === name);
    return u ? { name, location: u.location } : null;
  }

  /** 根据 location 返回 uniform 名称 */
  uniformNameAt(loc) {
    return this.uniformNameByLoc.get(loc);
  }

  /**
   * 运行顶点着色器（一次调用处理一个顶点，对应 GPU 每个顶点一个线程）。
   * @param {Map} attribValues  属性名 → GLSLValue
   * @returns {{position: Float32Array, pointSize: number, varyings: Map}}
   */
  runVertex(attribValues) {
    const scope = new Map();
    // uniforms 拷贝进作用域
    for (const [name, val] of this.uniformValues) scope.set(name, copyValue(val));
    // 内建输出变量
    scope.set('gl_Position', zeroValue('vec4'));
    scope.set('gl_PointSize', mk('float', 1.0));
    // 顶点输出变量（varying）在顶点着色器里是可写的全局变量，
    // 必须在作用域中占位，否则 `v_uv = a_uv;` 这类赋值会报"未定义变量"。
    for (const o of this.vertexOutputs) scope.set(o.name, zeroValue(o.type));
    // 执行 main（用顶点阶段的函数表，避免与片段 main 混淆）
    const exec = new Exec(scope, this.vertexFuncs, this.ctx);
    for (const v of this.constInits) {
      if (v.arrSize) {
        const arr = [];
        for (let i = 0; i < v.arrSize; i++) arr.push(zeroValue(v.type));
        scope.set(v.name, mk('array', arr));
      } else {
        let val = v.init ? exec.execExpr(v.init) : zeroValue(v.type);
        scope.set(v.name, coerce(val, v.type));
      }
    }
    // 绑定属性
    for (const a of this.vertexInputs) {
      const val = attribValues.get(a.name) || zeroValue(a.type);
      scope.set(a.name, coerce(val, a.type));
    }
    // 执行 main
    exec.execStmt(this.vertexFuncs.get('main').body);

    // 捕获输出
    const position = scope.get('gl_Position');
    const pointSize = scope.get('gl_PointSize');
    const varyings = new Map();
    for (const o of this.vertexOutputs) {
      if (scope.has(o.name)) varyings.set(o.name, copyValue(scope.get(o.name)));
    }
    return {
      position: Float32Array.from(position.v), // gl_Position（裁剪空间齐次坐标）
      pointSize: pointSize.v, // gl_PointSize
      varyings,
    };
  }

  /**
   * 运行片段着色器（一次调用处理一个像素，对应 GPU 每个片段一个线程）。
   * @param {Map} varyings      插值后的 varying 值
   * @param {object} fragCoord  gl_FragCoord 数据 {x,y,z,w}
   * @param {number} frontFacing 是否正面（1/0）
   * @returns {Map|null} 输出变量名→值；被 discard 时返回 null
   */
  runFragment(varyings, fragCoord, frontFacing) {
    const scope = new Map();
    for (const [name, val] of this.uniformValues) scope.set(name, copyValue(val));
    // 内建输入
    scope.set('gl_FragCoord', mk('vec4', new Float32Array([fragCoord.x, fragCoord.y, fragCoord.z, fragCoord.w])));
    scope.set('gl_FrontFacing', mk('bool', frontFacing));
    scope.set('gl_FragColor', zeroValue('vec4')); // ES1 输出

    const exec = new Exec(scope, this.fragmentFuncs, this.ctx);
    for (const v of this.constInits) {
      if (v.arrSize) {
        const arr = [];
        for (let i = 0; i < v.arrSize; i++) arr.push(zeroValue(v.type));
        scope.set(v.name, mk('array', arr));
      } else {
        let val = v.init ? exec.execExpr(v.init) : zeroValue(v.type);
        scope.set(v.name, coerce(val, v.type));
      }
    }
    // 绑定插值后的 varying 输入
    for (const [name, val] of varyings) {
      scope.set(name, val);
    }

    // 执行 main；discard 通过异常跳出
    try {
      exec.execStmt(this.fragmentFuncs.get('main').body);
    } catch (e) {
      if (e && e.ctrl === 'discard') return null;
      throw e;
    }

    const outputs = new Map();
    for (const name of this.fragmentOutputs) {
      if (scope.has(name)) outputs.set(name, scope.get(name));
    }
    return outputs;
  }
}

/** 便捷工厂：创建并编译一个着色器（返回 Shader，可用 compileStatus 判断） */
export function createShader(type, source) {
  const shader = new Shader(type, source);
  shader.compile();
  return shader;
}

/** 便捷工厂：创建并链接一个程序（返回 Program，可用 linkStatus 判断） */
export function createProgram(ctx, vertexShader, fragmentShader) {
  const program = new Program(ctx);
  program.attach(vertexShader);
  program.attach(fragmentShader);
  program.link();
  return program;
}

