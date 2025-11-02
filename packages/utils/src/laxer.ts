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

// 代码的令牌标记，存储源码位置和描述了源码的用处
const token = (type:string, value:any, start:number) => {
    return { type, value, start }
}
type Token = ReturnType<typeof token>
/**
 * 词法分析
 * @param {string} source 源码
 * @returns {Token[]}
*/
const lexer = (source:string) => {
    const tokens:Token[] = []
    let pos = 0, peekPos = pos, ch, value;
    const length = source.length;
    const digit_reg = /[0-9]/
    const literal_reg = /[a-zA-Z_]$/
    // 是否数字
    const isDigit = (ch:string) => {
        return digit_reg.test(ch)
    }
    // 是否字母
    const isLiteral = (ch:string) => {
        return literal_reg.test(ch)
    }
    const token = (type:string, value?:any) => {
        tokens.push({ type, value, start: peekPos })
    }
    const keywords = {
        let: true,
        const: true,
        function: true,
        if: true,
        for: true,
        return: true

    } as const;
    while (pos < length) {
        peekPos = pos;
        ch = source.charAt(peekPos)
        // 空白、换行、逗号、分号就跳过
        if (ch === ' ' || ch === '\n' || ch === '\t') {
            pos++
        } else if (ch === '{') {
            pos++
            token('lbrace', ch) // 左大括号
        } else if (ch === '}') {
            pos++
            token('rbrace', ch) // 右大括号
        } else if (ch === '[') {
            pos++
            token('lbracket', ch) // 左中括号
        } else if (ch === ']') {
            pos++
            token('rbracket', ch) // 右中括号
        } else if (ch === '(') {
            pos++
            token('lparen', ch) // 左小括号
        } else if (ch === ')') {
            pos++
            token('rparen', ch) // 右小括号
        } else if (ch === ',') {
            pos++
            token('comma', ch) // 逗号
        } else if (ch === ';') {
            pos++
            token('semicolon', ch) // 分号
        } else if (ch === '.') {
            pos++
            token('dot', ch) // 点
        }
        // 比较符
        else if (ch === '<' || ch === '>' || ch === '=') {
            pos++
            value = source.charAt(pos)
            if (value === '=') {
                ch += value
                pos++
            }
            if (ch === '=') {
                token('equals', ch) // 等于 
            } else {
                token('binaryExpression', ch)
            }
        }
        // 运算符
        else if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '=') {
            pos++
            value = source.charAt(pos)
            if (value === '=' || (ch === '+' || ch === '-') && value === ch) {
                ch += value
                pos++
            }
            if (ch === '=') {
                token('equals', ch) // 等于 
            } else {
                token('binaryExpression', ch)
            }
        } else if (isDigit(ch)) {
            // 数字
            while (pos < length && isDigit(source.charAt(pos))) {
                pos++
            }
            token('num', source.substring(peekPos, pos))
        } else if (isLiteral(ch)) {
            pos++
            while (pos < length && (isLiteral(source.charAt(pos)) || isDigit(source.charAt(pos)))) {
                pos++
            }
            value = source.substring(peekPos, pos)
            if (value === 'true' || value === 'false') {
                // 布尔类型
                token('boolean', value)
            } else if (keywords[value as keyof typeof keywords]) {
                // 关键字
                token('keyword', value)
            } else {
                // 变量
                token('Identifier', value)
            }
        } else {
            pos++
        }
    }
    token('eof') // 添加结束标识
    return tokens;
}
/**   
expression  -> term ( ( '+' | '-' ) term )*
term        -> factor ( ( '*' | '/' ) factor )*
factor      -> integer | '(' expression ')'
integer     -> [0-9]+
递归下降解析器（Recursive Descent Parser）是一种自顶向下的语法分析器，它从语法规则的最高级别开始，递归地调用自身来处理不同的语法规则。
下面是一个简单的递归下降解析器的示例，用于解析简单的数学表达式语言：
*/
class RecursiveDescentParser {
    input:string
    currentToken:any|null
    currentPosition:number
    constructor(input:string) {
        this.input = input;
        this.currentToken = null;
        this.currentPosition = 0;
    }

    parse() {
        this.currentToken = this.getNextToken();
        return this.parseExpression();
    }

    getNextToken() {
        if (this.currentPosition < this.input.length) {
            const token = this.input[this.currentPosition];
            this.currentPosition++;
            return token;
        } else {
            return null;
        }
    }

    parseExpression() {
        let term = this.parseTerm();
        while (this.currentToken === '+' || this.currentToken === '-') {
            const op = this.currentToken;
            this.currentToken = this.getNextToken();
            const termRight = this.parseTerm();
            if (op === '+') {
                term += termRight;
            } else {
                term -= termRight;
            }
        }
        return term;
    }

    parseTerm() {
        let factor = this.parseFactor();
        while (this.currentToken === '*' || this.currentToken === '/') {
            const op = this.currentToken;
            this.currentToken = this.getNextToken();
            const factorRight = this.parseFactor();
            if (op === '*') {
                factor *= factorRight;
            } else {
                factor /= factorRight;
            }
        }
        return factor;
    }

    parseFactor():any {
        if (!isNaN(this.currentToken)) {
            const result = parseFloat(this.currentToken);
            this.currentToken = this.getNextToken();
            return result;
        } else if (this.currentToken === '(') {
            this.currentToken = this.getNextToken();
            const result = this.parseExpression();
            if (this.currentToken === ')') {
                this.currentToken = this.getNextToken();
                return result;
            } else {
                throw new SyntaxError("Expected ')'");
            }
        } else {
            throw new SyntaxError("Unexpected token: " + this.currentToken);
        }
    }
}

// // Example usage:
// const parser = new RecursiveDescentParser("2 * (3 + 4) - 5");
// const result = parser.parse();
// console.log(result); // Output: 11

const parse = (tokens:Token[]) => {
    const program:{type:string,body:any[],start?:number,end?:number} = {
        type: 'Program',
        body: [] as any[]
    }
    let i = 0, length = tokens.length
    /**************定义ast节点******************/

    // 标识符
    const nodeIdentity = (name:string, start:number, end:number) => {
        return { type: 'Identifier', name, start, end }
    }
    // 多个变量,let a,b,c
    const nodeVariableDeclaration = (kind:string, declarations:any[],start:number,end:number) => {
        return { type: 'VariableDeclaration', kind, declarations, start, end }
    }
    // 单个
    const nodeVariableDeclarator = (id:string, init:any,start:number,end:number) => {
        return { type: 'VariableDeclarator', id, init, start, end }
    }

    // 定义文本和数字 ast节点
    const nodeNumericLiteral = (value:string,start:number,end:number) => {
        return { type: 'Literal', value: parseFloat(value), raw: value, start, end }
    }
    // 一元或二元运算符
    const nodeBinaryExpression = (operator:string, left:any, right:any,start:number,end:number) => {
        return { type: 'BinaryExpression', operator, left, right, start, end }
    }
    // += *= -=
    const nodeAssignmentExpression = (operator:string, left:any, right:any,start:number,end:number) => {
        return { type: 'AssignmentExpression', operator, left, right, start, end }
    }

    // 更新 for 
    const nodeUpdateExpression = (argument:any, operator:any,start:number,end:number) => {
        return { type: 'UpdateExpression', argument, operator, prefix: false, start, end }
    }
    //序列表达式 for(;;i++,j++)
    const nodeSequenceExpression = (expressions:any,start:number,end:number) => {
        return { type: 'SequenceExpression', expressions, start, end }
    }
    // 表达式语句
    const nodeExpressionStatement = (expression:any,start:number,end:number) => {
        return { type: 'ExpressionStatement', expression, start, end }
    }
    // 块语句
    const nodeBlockStatement = (body:any,start:number,end:number) => {
        return { type: 'BlockStatement', body, start, end }
    }
    // for语句
    const nodeForStatement = (init:any, test:any, update:any, body:any,start:number,end:number) => {
        return { type: 'ForStatement', init, test, update, body, start, end }
    }
    // 返回
    const nodeReturnStatement = (argument:any,start:number,end:number) => {
        return { type: 'ReturnStatement', argument, start, end }
    }
    // 函数
    const nodeFunctionDeclaration = (id:any, params:any, body:any,start:number,end:number) => {
        return { type: 'FunctionDeclaration', id, params, body, generator: false, async: false, start, end }
    }
    // 数组
    const nodeArrayExpression = (elements:any,start:number,end:number) => {
        return { type: 'ArrayExpression', elements, start, end }
    }
    // 实例
    const nodeNewExpression = (callee:any, args:any,start:number,end:number) => {
        return { type: 'NewExpression', callee, arguments:args, start, end }
    }
    /**************定义ast节点 end *******************/
    const read = () => {
        return tokens[i]
    }
    const eat = () => {
        return tokens[i++]
    }
    const next = () => {
        return tokens[++i]
    }
    // 解析语句 for()
    const parseStm = ():any => {
        const current = read()
        if (current.type === 'keyword') {
            return parseKeyword()
        } else {
            const node = parseExpr()
            if (node) {
                return nodeExpressionStatement(node, node.start, node.end)
            }
        }
    }

    const parseVariableDecelerator = () => {
        const declarations = [];
        const current = eat()
        let identity, equalOrSemicolonOrComma;
        while (true) {
            identity = parsePrimary()
            console.assert(identity.type === 'Identifier', '定义出错，位置：' + identity.start)
            equalOrSemicolonOrComma = eat()
            if (equalOrSemicolonOrComma.type === 'semicolon') {
                declarations.push(nodeVariableDeclarator(identity, null, identity.start, identity.end))
                break
            }
            else if (equalOrSemicolonOrComma.type === 'equals') {
                const expr = parseExpr()
                declarations.push(nodeVariableDeclarator(identity, expr, identity.start, expr.end))
                equalOrSemicolonOrComma = eat()
            } else {
                declarations.push(nodeVariableDeclarator(identity, null, identity.start, identity.end))
            }
            if (equalOrSemicolonOrComma.type !== 'comma') {
                break
            }
        }
        return nodeVariableDeclaration(current.value, declarations, current.start, declarations[declarations.length - 1].end)
    }
    // 解析函数
    const parseFunction = () => {
        const current = eat()
        const nameOrArgs = eat()
        let id, params, body;
        if (nameOrArgs.type === 'Identifier') {
            id = nodeIdentity(nameOrArgs.value, nameOrArgs.start, nameOrArgs.start + nameOrArgs.value.length)
        }
        params = parseArguments()
        body = parseBlock()
        return nodeFunctionDeclaration(id, params, body, current.start, body.end)
    }
    // 解析for循环
    const parseFor = () => {
        const current = eat()
        const lparen = eat()
        console.assert(lparen.type === 'lparen', 'for循环格式不正确')
        let init, test, update, body, start, end;
        init = parseVariableDecelerator()
        test = parseExpr()
        let comma = read()
        let updateExpressions = []
        while (true) {
            update = parseExpr()
            updateExpressions.push(update)
            comma = read()
            if (comma.type !== 'comma') {
                break
            } else {
                i++;
            }
        }
        if (updateExpressions.length > 1) {
            update = nodeSequenceExpression(updateExpressions, updateExpressions[0].start, updateExpressions[updateExpressions.length - 1].end)
        }
        const rparen = eat()
        console.assert(rparen.type === 'rparen', 'for循环格式不正确,rparen')
        body = parseBlock()
        start = lparen.start
        end = body.end
        return nodeForStatement(init, test, update, body,start,end)
    }
    // 解析关键字
    const parseKeyword = () => {
        const current = read()
        if (current.value === 'let') {
            return parseVariableDecelerator()
        } else if (current.value === 'for') {
            return parseFor()
        } else if (current.value === 'function') {
            return parseFunction()
        }
    }
    // 解析表达式
    const parseExpr = ():any => {
        const node = read()
        if (node.type === 'lbracket') {
            return parseArrayExpression()
        } else {
            return parseComparisonOperators()
        }
    }
    // 解析比较运算，<= >= ==
    const parseComparisonOperators = () => {
        let left = parseAdditionAndMinus()
        let current = read()
        while (current.type === 'equals') {
            i++
            let right = parseExpr()
            left = nodeAssignmentExpression(current.value, left, right, left.start, right?.end)
            current = read()
        }
        while (current.type === 'binaryExpression' && (current.value === '<' || current.value === '>' || current.value === '==' || current.value === '<=' || current.value === '>=')) {
            i++
            let right = parseAdditionAndMinus()
            left = nodeBinaryExpression(current.value, left, right, left.start, right?.end)
            current = read()
        }
        return left;
    }
    // 解析加减法:+ -
    const parseAdditionAndMinus = () => {
        let left = parseMultiplyAndDivision()
        let current = read()
        while (current.type === 'binaryExpression' && (current.value === '+=' || current.value === '-=' || current.value === '+' || current.value === '-')) {
            i++
            let right = parseMultiplyAndDivision()
            if (current.value === '+=' || current.value === '-=') {
                left = nodeAssignmentExpression(current.value, left, right, left.start, right?.end)
            } else {
                left = nodeBinaryExpression(current.value, left, right, left.start, right?.end)
            }

            current = read()
        }
        return left
    }
    // 解析:* / 
    const parseMultiplyAndDivision = () => {
        let left = parsePrimary()
        let current = read()
        while (current.type === 'binaryExpression' && (current.value === '*=' || current.value === '/=' || current.value === '*' || current.value === '/')) {
            i++
            let right = parsePrimary()
            if (current.value === '*=' || current.value === '/=') {
                left = nodeAssignmentExpression(current.value, left, right, left.start, right?.end)
            } else {
                left = nodeBinaryExpression(current.value, left, right, left.start, right?.end)
            }
            current = read()
        }
        return left
    }
    // 解析数组
    const parseArrayExpression = () => {
        const lbracket = eat()
        let current = parseExpr() || parsePrimary();
        const elements = [];
        let nextNode
        while (current) {
            elements.push(current)
            nextNode = read() // 逗号
            if (nextNode.type === 'comma') {
                i++;
                current = parseExpr() || parsePrimary()
            } else {
                break
            }
        }
        const rbracker = eat()
        console.assert(rbracker.type === 'rbracket', '数组定义不正确，缺少]')
        return nodeArrayExpression(elements, lbracket.start, rbracker.start)
    }
    // 解析代码块
    const parseBlock = () => {
        const lbrace = eat()
        console.assert(lbrace.type === 'lbrace', '代码块定义不正确')

        const body = []
        let current, comma = read();
        if (comma.type !== 'rbrace') {
            current = parseStm()
            while (current) {
                body.push(current)
                comma = read()
                if (comma.type === 'rbrace') {
                    break;
                }
                current = parseStm()
            }
        }
        const rbrace = eat()
        console.assert(rbrace.type === 'rbrace', '代码块定义不正确')
        return nodeBlockStatement(body, lbrace.start, rbrace.start)
    }
    // 解析函数参数 arguments parameters
    const parseArguments = () => {

        const lparen = eat()
        console.assert(lparen.type === 'lparen', '参数定义不正确')
        let current = parsePrimary()
        const params = []
        let comma;
        while (current && current.type === 'Identifier') {
            params.push(current)
            comma = read()
            if (comma.type === 'comma') {
                i++
                current = parsePrimary()
            } else {
                break;
            }
        }
        const rparen = eat()
        console.assert(rparen.type === 'rparen', '参数定义不正确')
        return params
    }


    // 解析主要
    const parsePrimary = () => {
        let current = read()
        while (current.type === 'semicolon') {
            current = next()
        }
        if (current.type === 'num') {
            i++
            return nodeNumericLiteral(current.value, current.start, current.start + current.value.length)
        } else if (current.type === 'binaryExpression' && (current.value === '++' || current.value === '--')) {

            let nextNode = current
            current = next()
            console.assert(current.type === 'Identifier', nextNode.value + '格式不对')
            i++
            const identity = nodeIdentity(current.value, current.start, current.start + current.value.length)
            const node = nodeUpdateExpression(identity, nextNode.value, current.start, nextNode.start + nextNode.value.length)
            node.prefix = true
            return node
        } else if (current.type === 'Identifier') {
            let nextNode = next()
            if (nextNode.type === 'binaryExpression' && (nextNode.value === '++' || nextNode.value === '--')) {
                i++
                const identity = nodeIdentity(current.value, current.start, current.start + current.value.length)
                return nodeUpdateExpression(identity, nextNode.value, current.start, nextNode.start + nextNode.value.length)
            }
            return nodeIdentity(current.value, current.start, current.start + current.value.length)
        } else if (current.type === 'lparen') {
            // ((a+b)*c)  >
            i++
            let node = parseExpr()
            let rparen = next()
            return node
        } else if (current.type === 'eof') {
            throw 'eof'
        }
    }
    try {
        while (i < length && tokens[i].type !== 'eof') {
            program.body.push(parseStm())
        }
    } catch (e) {
        console.log('e', e)
    }
    if (program.body.length) {
        program.start = program.body[0].start
        program.end = program.body[program.body.length - 1].end
    }
    return program
}
const codeGen = (ast:any) => {
    let source = [];
    // 访问者模式,DFS
    const visit = {
        Program(node:any, ctx:any) {
            const body = node.body
            for (let i = 0; i < body.length; i++) {
                gen(body[i], ctx)
                ctx.source.push('\n')
            }
        },
        UpdateExpression(node:any, ctx:any) {
            const { argument, operator, prefix } = node
            if (prefix) {
                ctx.source.push(operator)
                gen(argument, ctx)
            } else {
                gen(argument, ctx)
                ctx.source.push(operator)
            }
        },
        BlockStatement(node:any, ctx:any) {
            const { body } = node
            for (let i = 0; i < body.length; i++) {
                ctx.source.push('    ')
                gen(body[i], ctx)
                ctx.source.push(';')
            }
        },
        Identifier(node:any, ctx:any) {
            ctx.source.push(node.name)
        },
        VariableDeclarator(node:any, ctx:any) {
            gen(node.id, ctx)
            if (node.init) {
                ctx.source.push(' = ')
                gen(node.init, ctx)
            }
        },
        VariableDeclaration(node:any, ctx:any) {
            const { declarations, kind } = node
            ctx.source.push(kind + ' ')

            for (let i = 0; i < declarations.length; i++) {
                if (i > 0) {
                    ctx.source.push(',')
                }
                gen(declarations[i], ctx)

            }
            ctx.source.push(';')
        },
        ForStatement(node:any, ctx:any) {
            const { init, test, update, body } = node
            ctx.source.push('for (')
            gen(init, ctx)
            gen(test, ctx)
            ctx.source.push(';')
            gen(update, ctx)
            ctx.source.push(') {\n')
            gen(body, ctx)
            ctx.source.push('\n}')
        },
        ExpressionStatement(node:any, ctx:any) {
            const expression = node.expression
            gen(expression, ctx)
        },
        Literal(node:any, ctx:any) {
            //let parent=ctx.parents[ctx.parents.length-1]    
            ctx.source.push(node.value)
        },
        BinaryExpression(node:any, ctx:any) {
            let parent = ctx.parents[ctx.parents.length - 2]
            let paren = false
            // 重新定义括号内的表达式的优先级
            if (parent && (parent.operator === '*' || parent.operator === '/') && (node.operator === '+' || node.operator === '-')) {
                paren = true
            }
            if (node.left) {
                paren && ctx.source.push('(')
                gen(node.left, ctx)
            }
            ctx.source.push(' ' + node.operator + ' ')
            if (node.right) {
                gen(node.right, ctx)
                paren && ctx.source.push(')')
            }

        }
    } as const
    const ctx = {
        parents: [],
        source: []
    }
    const gen = (node:any, ctx:any) => {
        const handle = visit[node.type as keyof typeof visit]
        if (handle) {
            ctx.parents.push(node)
            let result = handle(node, ctx)
            ctx.parents.pop()
            // if (result) {
            //     gen(result,ctx)
            // }
        }
    }
    gen(ast, ctx)
    return ctx.source.join('')
}
const interpreter = (program:any) => {

    // 执行环境（执行上下文）  Environment

    class ExecutionContext {
        parent?:ExecutionContext
        vars:Map<string,any>
        childContext:ExecutionContext[]
        constructor(parent?:ExecutionContext) {
            this.parent = parent
            this.vars = new Map()// Variable
            this.childContext = []
            if (parent) {
                parent.childContext.push(this)
            }
        }
        has(name:string) {
            return this.vars.has(name)
        }
        get(name:string):any {
            if (this.vars.has(name) && this.parent) {
                return this.parent.get(name)
            }
            return this.vars.get(name)
        }
        update(name:string, value:any) {
            if (this.vars.has(name)) {
                this.vars.set(name, value)
            }
        }
        addSelf(name:string, value:any) {
            if (this.vars.has(name)) {
                let oldValue = this.get(name)
                this.vars.set(name, oldValue + value)
            }
        }
        minusSef(name:string, value:any) {
            if (this.vars.has(name)) {
                let oldValue = this.get(name)
                this.vars.set(name, oldValue - value)
            }
        }
        def(name:string, value:any) {
            if (!this.vars.has(name)) {
                this.vars.set(name, value)
            }
        }
        createChildContext() {
            return new ExecutionContext(this)
        }
    }
    let env = new ExecutionContext()
    let envs:any[] = [];
    const push = (_env:any) => {
        env && envs.push(env)
        env = _env
    }
    const pop = () => {
        envs.pop()
        env = envs[envs.length - 1]
    }
    const evalIdentifier = (node:any) => {
        const { name } = node
        return env.get(name)
    }
    const evalLiteral = (node:any) => {
        return node.value
    }
    const evalBinaryExpression = (node:any):any => {
        const operator = node.operator
        if (operator === '+') {
            return evaluate(node.left) + evaluate(node.right)
        } else if (operator === '-') {
            return evaluate(node.left) - evaluate(node.right)
        } else if (operator === '*') {
            return evaluate(node.left) * evaluate(node.right)
        } else if (operator === '/') {
            return evaluate(node.left) / evaluate(node.right)
        } else if (operator === '<') {
            return evaluate(node.left) < evaluate(node.right)
        } else if (operator === '<=') {
            return evaluate(node.left) <= evaluate(node.right)
        } else if (operator === '>') {
            return evaluate(node.left) > evaluate(node.right)
        } else if (operator === '>=') {
            return evaluate(node.left) >= evaluate(node.right)
        }
    }
    const evalAssignmentExpression = (node:any):any => {
        const operator = node.operator
        if (operator === '=') {
            env.def(node.left.name, evaluate(node.right))
            return evaluate(node.left)
        } else if (operator === '+=') {
            env.addSelf(node.left.name, evaluate(node.right))
            return evaluate(node.left)
        }
    }
    const evalUpdateExpression = (node:any):any => {
        const { argument, operator, prefix } = node
        if (operator === '++') {
            let prevValue = evaluate(argument)
            env.addSelf(argument.name, 1)
            return prefix ? evaluate(argument) : prevValue
        } else if (operator === '--') {
            let prevValue = evaluate(argument)
            env.minusSef(argument.name, 1)
            return prefix ? evaluate(argument) : prevValue
        }
    }
    const evalVariableDeclarator = (node:any):any => {
        const { id, init } = node
        if (init) {
            env.def(id.name, evaluate(init))
        } else {
            env.def(id.name, null)
        }
    }
    const evalVariableDeclaration = (node:any):any => {
        const { declarations } = node
        for (let i = 0; i < declarations.length; i++) {
            evaluate(declarations[i])
        }
    }
    const evalForStatement = (node:any):any => {
        const { init, test, update, body } = node
        let result;
        evaluate(init)
        while (evaluate(test)) {
            result = evaluate(body)
            evaluate(update)
        }
        return result
    }
    const evalBlockStatement = (node:any):any => {
        const { body } = node
        let result;
        for (let i = 0; i < body.length; i++) {
            result = evaluate(body[i])
        }
        return result
    }

    const evalExpressionStatement = (node:any):any => {
        return evaluate(node.expression)
    }
    const evalExprProgram = (node:any):any => {
        const body = node.body;
        let result;
        for (let i = 0; i < body.length; i++) {
            result = evaluate(body[i])
        }
        return result
    }
    const evaluate = (node:any):any => {
        switch (node.type) {
            case "Program":
                return evalExprProgram(node);
            case "BinaryExpression":
                return evalBinaryExpression(node);
            case "Identifier":
                return evalIdentifier(node);
            case "Literal":
                return evalLiteral(node);
            case "UpdateExpression":
                return evalUpdateExpression(node);
            case "AssignmentExpression":
                return evalAssignmentExpression(node);
            case "VariableDeclaration":
                return evalVariableDeclaration(node);
            case "VariableDeclarator":
                return evalVariableDeclarator(node);
            case "ForStatement":
                return evalForStatement(node);
            case "BlockStatement":
                return evalBlockStatement(node);
            case "ExpressionStatement":
                return evalExpressionStatement(node);
        }
    }
    return evaluate(program)
}
export {
    parse,
    codeGen,
    lexer,
    interpreter,
    token
}