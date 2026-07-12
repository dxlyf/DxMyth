import { PathBuilder } from "./PathBuilder";
import { Point, PointLike } from "./Point";


export const fromSvgPathToCmds = (svgPath: string) => {

    // 解析命令和参数，支持逗号、空格分隔，科学计数法
    type Cmd = { cmd: string; params: number[] }
    const cmds: Cmd[] = []
    let currentCmd = ''
    const allNumbers: number[] = []

    let parsingCmd = false
    const svgCmdReg=/[MLHVCSQTAZmlhvcsqtaz]/
    for (let i = 0; i < svgPath.length; i++) {
        const ch = svgPath[i]
        if (svgCmdReg.test(ch)) {
            if (currentCmd && allNumbers.length > 0) {
                cmds.push({ cmd: currentCmd, params: [...allNumbers] })
                allNumbers.length = 0
            } else if (currentCmd && allNumbers.length === 0) {
                // Z/z 没有参数，但需要 push 到命令列表
                if (currentCmd === 'z' || currentCmd === 'Z') {
                    cmds.push({ cmd: currentCmd, params: [] })
                }
                // 其他不带参数连续命令的情况（如 MM），忽略
            }
            currentCmd = ch
            parsingCmd = true
        } else if (ch === ',' || ch === ' ') {
            // 分隔符，忽略
            continue
        } else if (ch === '-' || ch === '+' || ch === '.' || (ch >= '0' && ch <= '9') || ch === 'e' || ch === 'E') {
            // 数字的一部分，需要解析完整数字
            if (parsingCmd) {
                parsingCmd = false
            }
            // 解析数字
            let numEnd = i + 1
            // 处理科学计数法
            while (numEnd < svgPath.length && /[0-9.eE+\-]/.test(svgPath[numEnd])) {
                // 如果遇到 + 或 - 且前一个字符不是 e/E，则停止
                if ((svgPath[numEnd] === '+' || svgPath[numEnd] === '-') &&
                    !(svgPath[numEnd - 1] === 'e' || svgPath[numEnd - 1] === 'E')) {
                    break
                }
                // 如果遇到命令字母，停止
                if (svgCmdReg.test(svgPath[numEnd])) break
                // 如果遇到逗号或空格，停止
                if (svgPath[numEnd] === ',' || svgPath[numEnd] === ' ') {
                    numEnd++
                    break
                }
                numEnd++
            }
            const numStr = svgPath.substring(i, numEnd).trim()
            if (numStr && !svgCmdReg.test(numStr)) {
                const n = parseFloat(numStr)
                if (!isNaN(n)) allNumbers.push(n)
            }
            i = numEnd - 1
        }
    }
    if (currentCmd) {
        cmds.push({ cmd: currentCmd, params: [...allNumbers] })
    }
    return cmds
}
/**
    * 解析 SVG path 字符串，返回 PathBuilder 实例
    *
    * 支持所有 SVG path 命令：
    *   M/m (moveto), L/l (lineto), H/h (horizontal lineto), V/v (vertical lineto)
    *   C/c (cubic bezier), S/s (smooth cubic bezier)
    *   Q/q (quadratic bezier), T/t (smooth quadratic bezier)
    *   A/a (elliptical arc), Z/z (close path)
    *
    * @param svgPath - SVG path 字符串，如 "M10 10 L20 20 C30 30 40 40 50 50Z"
    * @returns PathBuilder 实例
    */
export function fromSvgPath(svgPath: string): PathBuilder {
    const path = new PathBuilder()
    if (!svgPath || !svgPath.trim()) return path

    const cmds = fromSvgPathToCmds(svgPath)
    // 执行命令
    let currentPoint = Point.fromPoint({ x: 0, y: 0 })
    let lastControlPoint: PointLike | null = null

    for (let ci = 0; ci < cmds.length; ci++) {
        const { cmd, params } = cmds[ci]
        const isRelative = cmd === cmd.toLowerCase()
        const absCmd = cmd.toUpperCase()
        let pi = 0 // 参数索引

        switch (absCmd) {
            case 'M': { // moveto
                while (pi + 1 <= params.length) {
                    const x = params[pi++]
                    const y = params[pi++]
                    const px = isRelative ? currentPoint.x + x : x
                    const py = isRelative ? currentPoint.y + y : y
                    if (pi === 2) {
                        path.moveTo(px, py)
                    } else {
                        path.lineTo(px, py) // 多余的点作为 lineTo
                    }
                    currentPoint = Point.fromPoint({ x: px, y: py })
                    if (isRelative) break // 相对模式只取第一对
                }
                lastControlPoint = null
                break
            }
            case 'L': { // lineto
                while (pi + 1 <= params.length) {
                    const x = params[pi++]
                    const y = params[pi++]
                    const px = isRelative ? currentPoint.x + x : x
                    const py = isRelative ? currentPoint.y + y : y
                    path.lineTo(px, py)
                    currentPoint = Point.fromPoint({ x: px, y: py })
                }
                lastControlPoint = null
                break
            }
            case 'H': { // horizontal lineto
                while (pi < params.length) {
                    const x = params[pi++]
                    const px = isRelative ? currentPoint.x + x : x
                    path.lineTo(px, currentPoint.y)
                    currentPoint = Point.fromPoint({ x: px, y: currentPoint.y })
                }
                lastControlPoint = null
                break
            }
            case 'V': { // vertical lineto
                while (pi < params.length) {
                    const y = params[pi++]
                    const py = isRelative ? currentPoint.y + y : y
                    path.lineTo(currentPoint.x, py)
                    currentPoint = Point.fromPoint({ x: currentPoint.x, y: py })
                }
                lastControlPoint = null
                break
            }
            case 'C': { // cubic bezier
                while (pi + 5 <= params.length) {
                    const cp1x = params[pi++]; const cp1y = params[pi++]
                    const cp2x = params[pi++]; const cp2y = params[pi++]
                    const x = params[pi++]; const y = params[pi++]
                    const p1x = isRelative ? currentPoint.x + cp1x : cp1x
                    const p1y = isRelative ? currentPoint.y + cp1y : cp1y
                    const p2x = isRelative ? currentPoint.x + cp2x : cp2x
                    const p2y = isRelative ? currentPoint.y + cp2y : cp2y
                    const px = isRelative ? currentPoint.x + x : x
                    const py = isRelative ? currentPoint.y + y : y
                    path.bezierCurveTo(p1x, p1y, p2x, p2y, px, py)
                    lastControlPoint = { x: p2x, y: p2y }
                    currentPoint = Point.fromPoint({ x: px, y: py })
                }
                break
            }
            case 'S': { // smooth cubic bezier
                while (pi + 3 <= params.length) {
                    const cp2x = params[pi++]; const cp2y = params[pi++]
                    const x = params[pi++]; const y = params[pi++]
                    // 反射上一个控制点
                    let cp1x: number, cp1y: number
                    if (lastControlPoint) {
                        cp1x = 2 * currentPoint.x - lastControlPoint.x
                        cp1y = 2 * currentPoint.y - lastControlPoint.y
                    } else {
                        cp1x = currentPoint.x
                        cp1y = currentPoint.y
                    }
                    const p2x = isRelative ? currentPoint.x + cp2x : cp2x
                    const p2y = isRelative ? currentPoint.y + cp2y : cp2y
                    const px = isRelative ? currentPoint.x + x : x
                    const py = isRelative ? currentPoint.y + y : y
                    path.bezierCurveTo(cp1x, cp1y, p2x, p2y, px, py)
                    lastControlPoint = { x: p2x, y: p2y }
                    currentPoint = Point.fromPoint({ x: px, y: py })
                }
                break
            }
            case 'Q': { // quadratic bezier
                while (pi + 3 <= params.length) {
                    const cpx = params[pi++]; const cpy = params[pi++]
                    const x = params[pi++]; const y = params[pi++]
                    const pcx = isRelative ? currentPoint.x + cpx : cpx
                    const pcy = isRelative ? currentPoint.y + cpy : cpy
                    const px = isRelative ? currentPoint.x + x : x
                    const py = isRelative ? currentPoint.y + y : y
                    path.quadraticCurveTo(pcx, pcy, px, py)
                    lastControlPoint = { x: pcx, y: pcy }
                    currentPoint = Point.fromPoint({ x: px, y: py })
                }
                break
            }
            case 'T': { // smooth quadratic bezier
                while (pi + 1 <= params.length) {
                    const x = params[pi++]; const y = params[pi++]
                    let cpx: number, cpy: number
                    if (lastControlPoint) {
                        cpx = 2 * currentPoint.x - lastControlPoint.x
                        cpy = 2 * currentPoint.y - lastControlPoint.y
                    } else {
                        cpx = currentPoint.x
                        cpy = currentPoint.y
                    }
                    const px = isRelative ? currentPoint.x + x : x
                    const py = isRelative ? currentPoint.y + y : y
                    path.quadraticCurveTo(cpx, cpy, px, py)
                    lastControlPoint = { x: cpx, y: cpy }
                    currentPoint = Point.fromPoint({ x: px, y: py })
                }
                break
            }
            case 'A': { // elliptical arc
                while (pi + 6 <= params.length) {
                    const rx = params[pi++]
                    const ry = params[pi++]
                    const xAxisRotation = params[pi++] * Math.PI / 180 // SVG 使用角度，转为弧度
                    const largeArcFlag = params[pi++]
                    const sweepFlag = params[pi++]
                    const x = params[pi++]; const y = params[pi++]
                    const px = isRelative ? currentPoint.x + x : x
                    const py = isRelative ? currentPoint.y + y : y
                    // 使用椭圆弧方法
                    path.ellipseSvgArc(
                        currentPoint.x, currentPoint.y,
                        px, py,
                        rx, ry,
                        xAxisRotation,
                        largeArcFlag !== 0,
                        sweepFlag !== 0
                    )
                    currentPoint = Point.fromPoint({ x: px, y: py })
                    lastControlPoint = null
                }
                break
            }
            case 'Z': { // close path
                path.closePath()
                lastControlPoint = null
                break
            }
        }
    }

    return path
}