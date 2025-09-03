/**
       *
       * 实现一个从源码到AST再到解释器的整个流程 :
       * 1、实现词法分析器（Lexer或Tokenizer）
       *    1、通过定义基本的词法规则，如果标识符Identity(变量)、运算符Operator(+、-、*、/)、关键字Keyword(if、for)
       *    2、输入源码通过定义的词法规则生成一系列的tokens
       * 2、实现语法分析器 (Syntax Analysis)
       *    语法分析器（Parser）负责将 tokens 转换为抽象语法树。它根据语法规则和语法结构，将 tokens 组织成树状结构，反映源代码的语法关系。
            常用的算法有递归下降解析器（Recursive Descent Parser）、LL（1）分析器、LR（1）分析器等。这些算法根据文法规则递归或迭代地构建语法树。
       *    1、接收词法分析器的tokens，并构建AST（抽象语法树）,
       *    2、这个阶段通常涉及到递归下降解析或者更复杂的技术。如EBNF(扩展的巴科斯范式)、LL(1)()、LR(1)
       * 3、ast生成源码.(像Babel、webpack、rollup)都会解析ast，修改部分ast节点，详细自己网上搜
       * 4、解释器，解释ast树（
       * 通常一门语言都需要解释器，
       * 比如，我这里用的还是JS来解释，如果你要性能好，
       * 你可以用c++、c来解释，
       * 或者通过AST转译或编译成汇编语言或机器码，让硬件解释
       * ）
       *
       * sourceCode -> Lexer analysis or Tokenizer(token[]) -> ast parse (tree<astNode>) -> (code generate) | (ast interpreter)
      */
export {};
