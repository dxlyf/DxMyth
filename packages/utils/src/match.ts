// ==================== 类型定义 ====================

type Node =
  | { type: 'Char'; value: string }
  | { type: 'Any' }
  | { type: 'CharClass'; negated: boolean; ranges: [string, string][] }
  | { type: 'Star'; node: Node; greedy: boolean }
  | { type: 'Plus'; node: Node; greedy: boolean }
  | { type: 'Question'; node: Node; greedy: boolean }
  | { type: 'Concat'; nodes: Node[] }
  | { type: 'Alt'; options: Node[] }
  | { type: 'Group'; node: Node; index: number | null }
  | { type: 'AnchorStart' }
  | { type: 'AnchorEnd' }
  | { type: 'Lookahead'; node: Node; negative: boolean }; // (?=...) / (?!...)

interface MatchResult {
  matched: boolean;
  match: string;
  index: number;
  groups: (string | undefined)[];
}

// ==================== 语法分析 Parser ====================

class Parser {
  private pos = 0;
  private groupCount = 0;

  constructor(private pattern: string) {}

  parse(): Node {
    const node = this.parseAlternation();
    if (this.pos < this.pattern.length) {
      throw new Error(`Unexpected token at ${this.pos}: ${this.pattern[this.pos]}`);
    }
    return node;
  }

  private peek(): string | undefined {
    return this.pattern[this.pos];
  }

  private consume(): string {
    return this.pattern[this.pos++];
  }

  /** a|b|c */
  private parseAlternation(): Node {
    const options: Node[] = [this.parseConcat()];
    while (this.peek() === '|') {
      this.consume();
      options.push(this.parseConcat());
    }
    return options.length === 1 ? options[0] : { type: 'Alt', options };
  }

  /** 顺序连接 */
  private parseConcat(): Node {
    const nodes: Node[] = [];
    while (this.pos < this.pattern.length && this.peek() !== '|' && this.peek() !== ')') {
      nodes.push(this.parseQuantified());
    }
    if (nodes.length === 0) return { type: 'Concat', nodes: [] };
    return nodes.length === 1 ? nodes[0] : { type: 'Concat', nodes };
  }

  /** 处理量词 * + ? */
  private parseQuantified(): Node {
    let node = this.parseAtom();
    while (true) {
      const ch = this.peek();
      if (ch === '*') {
        this.consume();
        node = { type: 'Star', node, greedy: true };
      } else if (ch === '+') {
        this.consume();
        node = { type: 'Plus', node, greedy: true };
      } else if (ch === '?') {
        this.consume();
        node = { type: 'Question', node, greedy: true };
      } else {
        break;
      }
    }
    return node;
  }

  /** 单个原子：字符、.、[...]、(...) */
  private parseAtom(): Node {
    const ch = this.consume();

    // ---------- 分组 ----------
    if (ch === '(') {
      if (this.peek() === '?') {
        const next = this.pattern[this.pos + 1];

        // 非捕获组 (?:...)
        if (next === ':') {
          this.pos += 2;
          const inner = this.parseAlternation();
          if (this.consume() !== ')') throw new Error('Expected )');
          return { type: 'Group', node: inner, index: null };
        }

        // 正向肯定断言 (?=...)
        if (next === '=') {
          this.pos += 2;
          const inner = this.parseAlternation();
          if (this.consume() !== ')') throw new Error('Expected )');
          return { type: 'Lookahead', node: inner, negative: false };
        }

        // 负向否定断言 (?!...)
        if (next === '!') {
          this.pos += 2;
          const inner = this.parseAlternation();
          if (this.consume() !== ')') throw new Error('Expected )');
          return { type: 'Lookahead', node: inner, negative: true };
        }

        throw new Error(`Unsupported group syntax: (?${next}`);
      }

      // 普通捕获组
      const idx = ++this.groupCount;
      const inner = this.parseAlternation();
      if (this.consume() !== ')') throw new Error('Expected )');
      return { type: 'Group', node: inner, index: idx };
    }

    // ---------- 字符集 ----------
    if (ch === '[') return this.parseCharClass();

    // ---------- 其他 ----------
    if (ch === '.') return { type: 'Any' };
    if (ch === '^') return { type: 'AnchorStart' };
    if (ch === '$') return { type: 'AnchorEnd' };
    if (ch === '\\') return this.parseEscape(this.consume());
    if (ch === ')') throw new Error('Unmatched )');

    return { type: 'Char', value: ch };
  }

  /** 处理转义序列 */
  private parseEscape(esc: string): Node {
    switch (esc) {
      case 'd':
        return { type: 'CharClass', negated: false, ranges: [['0', '9']] };
      case 'D':
        return { type: 'CharClass', negated: true, ranges: [['0', '9']] };
      case 'w':
        return {
          type: 'CharClass', negated: false,
          ranges: [['a', 'z'], ['A', 'Z'], ['0', '9'], ['_', '_']],
        };
      case 'W':
        return {
          type: 'CharClass', negated: true,
          ranges: [['a', 'z'], ['A', 'Z'], ['0', '9'], ['_', '_']],
        };
      case 's':
        return {
          type: 'CharClass', negated: false,
          ranges: [[' ', ' '], ['\t', '\t'], ['\n', '\n'], ['\r', '\r'], ['\f', '\f'], ['\v', '\v']],
        };
      case 'S':
        return {
          type: 'CharClass', negated: true,
          ranges: [[' ', ' '], ['\t', '\t'], ['\n', '\n'], ['\r', '\r'], ['\f', '\f'], ['\v', '\v']],
        };
      case 'n': return { type: 'Char', value: '\n' };
      case 't': return { type: 'Char', value: '\t' };
      case 'r': return { type: 'Char', value: '\r' };
      default:  return { type: 'Char', value: esc };
    }
  }

  /** 解析 [...] */
  private parseCharClass(): Node {
    const ranges: [string, string][] = [];
    let negated = false;

    if (this.peek() === '^') {
      this.consume();
      negated = true;
    }

    while (this.pos < this.pattern.length && this.peek() !== ']') {
      let start = this.consume();

      // 处理 [\d] 这类内嵌转义
      if (start === '\\') {
        const esc = this.consume();
        const node = this.parseEscape(esc);
        if (node.type === 'CharClass') {
          ranges.push(...node.ranges);
        } else if (node.type === 'Char') {
          start = node.value;
          if (this.peek() === '-' && this.pattern[this.pos + 1] !== ']') {
            this.consume();
            const end = this.consume();
            ranges.push([start, end]);
          } else {
            ranges.push([start, start]);
          }
        }
        continue;
      }

      // 检查范围 a-z
      if (this.peek() === '-' && this.pattern[this.pos + 1] !== ']') {
        this.consume(); // -
        const end = this.consume();
        ranges.push([start, end]);
      } else {
        ranges.push([start, start]);
      }
    }

    if (this.consume() !== ']') throw new Error('Expected ]');
    return { type: 'CharClass', negated, ranges };
  }
}

// ==================== 匹配引擎 Matcher ====================

class Matcher {
  private input = '';
  private groups: (string | undefined)[] = [];

  constructor(private ast: Node) {}

  /** 从 index 开始尝试匹配，返回匹配结束位置，失败返回 -1 */
  private matchNode(node: Node, index: number, cont: (i: number) => number): number {
    switch (node.type) {
      case 'Char':
        if (index < this.input.length && this.input[index] === node.value) {
          return cont(index + 1);
        }
        return -1;

      case 'Any':
        if (index < this.input.length && this.input[index] !== '\n') {
          return cont(index + 1);
        }
        return -1;

      case 'CharClass': {
        if (index >= this.input.length) return -1;
        const ch = this.input[index];
        let inside = false;
        for (const [s, e] of node.ranges) {
          if (ch >= s && ch <= e) { inside = true; break; }
        }
        if (node.negated ? !inside : inside) return cont(index + 1);
        return -1;
      }

      case 'AnchorStart':
        return index === 0 ? cont(index) : -1;

      case 'AnchorEnd':
        return index === this.input.length ? cont(index) : -1;

      case 'Concat': {
        const { nodes } = node;
        const step = (i: number, k: number): number => {
          if (k === nodes.length) return cont(i);
          return this.matchNode(nodes[k], i, (ni) => step(ni, k + 1));
        };
        return step(index, 0);
      }

      case 'Alt': {
        for (const opt of node.options) {
          const r = this.matchNode(opt, index, cont);
          if (r !== -1) return r;
        }
        return -1;
      }

      case 'Group': {
        const start = index;
        return this.matchNode(node.node, index, (end) => {
          if (node.index !== null) {
            const saved = this.groups[node.index - 1];
            this.groups[node.index - 1] = this.input.slice(start, end);
            const r = cont(end);
            if (r === -1) this.groups[node.index - 1] = saved; // 回溯回滚
            return r;
          }
          return cont(end);
        });
      }

      // ---------- 零宽断言 ----------
      case 'Lookahead': {
        // 断言内部匹配成功即返回位置（用 probe 作为终点），
        // 不消耗外层位置：无论成功与否，index 都不变。
        const probe = (i: number) => i;
        const innerEnd = this.matchNode(node.node, index, probe);
        const ok = innerEnd !== -1;

        if (node.negative) {
          return !ok ? cont(index) : -1; // (?!...) 内部失败才算成功
        } else {
          return ok ? cont(index) : -1;  // (?=...)  内部成功才算成功
        }
      }

      // ---------- 量词 ----------
      case 'Star': {
        const inner = node.node;
        const tryMore = (i: number): number => {
          const r = this.matchNode(inner, i, (ni) => {
            if (ni === i) return -1; // 防止空匹配死循环
            return tryMore(ni);
          });
          if (r !== -1) return r;
          return cont(i); // 回溯：停止重复
        };
        return tryMore(index);
      }

      case 'Plus': {
        const inner = node.node;
        const tryMore = (i: number): number => {
          const r = this.matchNode(inner, i, (ni) => {
            if (ni === i) return cont(ni);
            return tryMore(ni);
          });
          if (r !== -1) return r;
          return cont(i);
        };
        // 至少一次
        return this.matchNode(inner, index, (ni) => {
          if (ni === index) return cont(ni);
          return tryMore(ni);
        });
      }

      case 'Question': {
        const r = this.matchNode(node.node, index, cont);
        if (r !== -1) return r;
        return cont(index);
      }
    }
  }

  /** 从 startIndex 起在 input 中搜索 */
  search(input: string, startIndex = 0): MatchResult {
    this.input = input;
    for (let i = startIndex; i <= input.length; i++) {
      this.groups = [];
      const end = this.matchNode(this.ast, i, (e) => e);
      if (end !== -1) {
        return {
          matched: true,
          match: input.slice(i, end),
          index: i,
          groups: [...this.groups],
        };
      }
    }
    return { matched: false, match: '', index: -1, groups: [] };
  }
}

// ==================== 对外 API ====================

export class MiniRegExp {
  private ast: Node;
  private matcher: Matcher;

  constructor(public readonly source: string) {
    this.ast = new Parser(source).parse();
    this.matcher = new Matcher(this.ast);
  }

  /** 是否包含匹配 */
  test(input: string): boolean {
    return this.matcher.search(input).matched;
  }

  /** 搜索第一个匹配 */
  exec(input: string, startIndex = 0): MatchResult {
    return this.matcher.search(input, startIndex);
  }

  /** 所有匹配 */
  matchAll(input: string): MatchResult[] {
    const results: MatchResult[] = [];
    let pos = 0;
    while (pos <= input.length) {
      const r = this.matcher.search(input, pos);
      if (!r.matched) break;
      results.push(r);
      pos = r.index + Math.max(1, r.match.length);
    }
    return results;
  }

  /** 替换（支持 $1 $2 ... 分组引用） */
  replace(input: string, replacement: string): string {
    let result = '';
    let pos = 0;
    while (pos <= input.length) {
      const r = this.matcher.search(input, pos);
      if (!r.matched) break;
      result += input.slice(pos, r.index);
      const rep = replacement.replace(/\$(\d)/g, (_, n) => r.groups[+n - 1] ?? '');
      result += rep;
      pos = r.index + Math.max(1, r.match.length);
    }
    result += input.slice(pos);
    return result;
  }
}

// // ==================== 使用示例 ====================

// // 基本匹配
// const re1 = new MiniRegExp('a+b*c?');
// console.log(re1.test('aaabc'));     // true
// console.log(re1.exec('xxaaabcxx')); // { matched: true, match: 'aaabc', index: 2, ... }

// // 捕获分组
// console.log(new MiniRegExp('(\\d+)').exec('abc123def'));
// // { matched: true, match: '123', index: 3, groups: ['123'] }

// // 锚点
// console.log(new MiniRegExp('^\\w+@\\w+$').test('hello@world')); // true

// // 或 + 全局匹配
// console.log(new MiniRegExp('[a-z]+|[0-9]+').matchAll('abc123def456').map(r => r.match));
// // ['abc', '123', 'def', '456']

// // 分组替换
// console.log(new MiniRegExp('(\\w+)@(\\w+)').replace('user@host', '$2::$1'));
// // 'host::user'

// // ---------- 零宽断言 ----------

// // 正向肯定断言：数字后面必须跟 px
// console.log(new MiniRegExp('\\d+(?=px)').matchAll('12px 34em 56px').map(r => r.match));
// // ['12', '56']

// // 负向否定断言：数字后面不能跟 px
// console.log(new MiniRegExp('\\d+(?!px)').matchAll('12px 34em 56px').map(r => r.match));
// // ['34']

// // 密码强度：至少含一个数字
// const rePwd = new MiniRegExp('^(?=.*\\d)\\w+$');
// console.log(rePwd.test('abc123')); // true
// console.log(rePwd.test('abcdef')); // false

// // 匹配不包含某词的字符串（负向断言）
// console.log(new MiniRegExp('(?!admin)\\w+').matchAll('root admin guest').map(r => r.match));
// // ['root', 'guest']