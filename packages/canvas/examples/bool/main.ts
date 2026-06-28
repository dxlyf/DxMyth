import { PathBuilder } from '../../src/math/PathBuilder'
import { pathBooleanOp, BoolOp } from '../../src/math/PathBool'
import { ExampleBase, ExampleManager } from '../lib/Example'

/**
 * 布尔运算示例：union / intersect / difference / xor。
 *
 * 左半区显示原始 subject（蓝色）与 clip（橙色）；
 * 右半区显示布尔运算结果（绿色填充 + 红色描边）。
 */
class BoolExample extends ExampleBase {
    static title = '布尔运算'

    stateOptions: Record<string, any> = {
        op: {
            '并集 union': BoolOp.Union,
            '交集 intersect': BoolOp.Intersect,
            '差集 difference': BoolOp.Difference,
            '异或 xor': BoolOp.Xor,
        },
        subjectShape: {
            '圆 circle': 'circle',
            '矩形 rect': 'rect',
            '星形 star': 'star',
            '三角 triangle': 'triangle',
            '六边 hexagon': 'hexagon',
            '心形 heart': 'heart',
            '环形(孔洞) donut': 'donut',
            '月牙 crescent': 'crescent',
        },
        clipShape: {
            '圆 circle': 'circle',
            '矩形 rect': 'rect',
            '星形 star': 'star',
            '三角 triangle': 'triangle',
            '六边 hexagon': 'hexagon',
            '心形 heart': 'heart',
            '环形(孔洞) donut': 'donut',
            '月牙 crescent': 'crescent',
        },
    }

    getDefaultState() {
        return {
            op: BoolOp.Union,
            subjectShape: 'circle',
            clipShape: 'rect',
            subjectX: 200,
            subjectY: 200,
            clipX: 280,
            clipY: 220,
            size: 80,
            showOriginal: true,
            showResult: true,
            resultStroke: true,
        }
    }

    enter() {
        this.onChange('', null)
    }

    /** 构造一个形状到 PathBuilder */
    private buildShape(kind: string, cx: number, cy: number, size: number): PathBuilder {
        const pb = new PathBuilder()
        if (kind === 'circle') {
            // 用 4 段二次贝塞尔近似圆（避免依赖 arc）
            const k = 0.5523 * size // 圆形近似的控制点系数
            pb.moveTo(cx + size, cy)
            pb.quadraticCurveTo(cx + size, cy + k, cx, cy + size)
            pb.quadraticCurveTo(cx - size, cy + k, cx - size, cy)
            pb.quadraticCurveTo(cx - size, cy - k, cx, cy - size)
            pb.quadraticCurveTo(cx + size, cy - k, cx + size, cy)
            pb.closePath()
        } else if (kind === 'rect') {
            pb.moveTo(cx - size, cy - size)
            pb.lineTo(cx + size, cy - size)
            pb.lineTo(cx + size, cy + size)
            pb.lineTo(cx - size, cy + size)
            pb.closePath()
        } else if (kind === 'star') {
            // 五角星
            const outer = size
            const inner = size * 0.4
            for (let i = 0; i < 10; i++) {
                const r = i % 2 === 0 ? outer : inner
                const a = (Math.PI / 5) * i - Math.PI / 2
                const x = cx + Math.cos(a) * r
                const y = cy + Math.sin(a) * r
                if (i === 0) pb.moveTo(x, y)
                else pb.lineTo(x, y)
            }
            pb.closePath()
        } else if (kind === 'triangle') {
            // 正三角形
            for (let i = 0; i < 3; i++) {
                const a = (Math.PI * 2 / 3) * i - Math.PI / 2
                const x = cx + Math.cos(a) * size
                const y = cy + Math.sin(a) * size
                if (i === 0) pb.moveTo(x, y)
                else pb.lineTo(x, y)
            }
            pb.closePath()
        } else if (kind === 'hexagon') {
            // 正六边形
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i
                const x = cx + Math.cos(a) * size
                const y = cy + Math.sin(a) * size
                if (i === 0) pb.moveTo(x, y)
                else pb.lineTo(x, y)
            }
            pb.closePath()
        } else if (kind === 'heart') {
            // 心形（两段三次贝塞尔合成左右两瓣）
            const s = size
            pb.moveTo(cx, cy + s * 0.6)
            pb.bezierCurveTo(
                cx + s * 1.2, cy + s * 0.2,
                cx + s * 0.9, cy - s * 0.8,
                cx, cy - s * 0.2,
            )
            pb.bezierCurveTo(
                cx - s * 0.9, cy - s * 0.8,
                cx - s * 1.2, cy + s * 0.2,
                cx, cy + s * 0.6,
            )
            pb.closePath()
        } else if (kind === 'donut') {
            // 环形（带孔洞）：外圆 + 内圆两条子路径，方向相反，
            // nonzero 填充规则下内圆即孔洞。用于测试多轮廓/孔洞布尔运算。
            // 屏幕坐标 y 向下，shoelace area>0 = CCW：
            //   外环 右→下→左→上→右 = CCW（area>0）
            //   孔洞 右→上→左→下→右 = CW （area<0）
            // 两者反向，孔洞区域 winding 相互抵消 → 不被填充。
            const kOut = 0.5523 * size
            pb.moveTo(cx + size, cy)
            pb.quadraticCurveTo(cx + size, cy + kOut, cx, cy + size)
            pb.quadraticCurveTo(cx - size, cy + kOut, cx - size, cy)
            pb.quadraticCurveTo(cx - size, cy - kOut, cx, cy - size)
            pb.quadraticCurveTo(cx + size, cy - kOut, cx + size, cy)
            pb.closePath()
            // 孔洞：方向与外环相反（CW），nonzero 下抵消外环 winding 形成孔洞
            const inner = size * 0.5
            const kIn = 0.5523 * inner
            pb.moveTo(cx + inner, cy)
            pb.quadraticCurveTo(cx + inner, cy - kIn, cx, cy - inner)
            pb.quadraticCurveTo(cx - inner, cy - kIn, cx - inner, cy)
            pb.quadraticCurveTo(cx - inner, cy + kIn, cx, cy + inner)
            pb.quadraticCurveTo(cx + inner, cy + kIn, cx + inner, cy)
            pb.closePath()
        } else if (kind === 'crescent') {
            // 月牙 = 大圆 - 偏移小圆。
            // 小圆部分超出大圆形成自相交，若直接用两子路径构造，
            // normalizeContourDirections 会用小圆边采样点判断嵌套深度，
            // 采样点落在大圆外 → 误判为外环 → 方向与外环同向 →
            // nonzero 规则下小圆区域 winding 累加 ≠ 0 → 孔洞被填充。
            // 改用 Difference 运算构造：算法会沿真实交点裁掉小圆超出部分，
            // 结果只含月牙外环（单一闭合轮廓），从根本上规避自相交。
            const r = size
            const off = size * 0.45
            const rr = r * 0.85
            const big = new PathBuilder()
            const kBig = 0.5523 * r
            big.moveTo(cx + r, cy)
            big.quadraticCurveTo(cx + r, cy + kBig, cx, cy + r)
            big.quadraticCurveTo(cx - r, cy + kBig, cx - r, cy)
            big.quadraticCurveTo(cx - r, cy - kBig, cx, cy - r)
            big.quadraticCurveTo(cx + r, cy - kBig, cx + r, cy)
            big.closePath()
            const small = new PathBuilder()
            const kSmall = 0.5523 * rr
            small.moveTo(cx + off + rr, cy)
            small.quadraticCurveTo(cx + off + rr, cy + kSmall, cx + off, cy + rr)
            small.quadraticCurveTo(cx + off - rr, cy + kSmall, cx + off - rr, cy)
            small.quadraticCurveTo(cx + off - rr, cy - kSmall, cx + off, cy - rr)
            small.quadraticCurveTo(cx + off + rr, cy - kSmall, cx + off + rr, cy)
            small.closePath()
            return pathBooleanOp(big, small, BoolOp.Difference)
        }
        return pb
    }

    onChange(_property?: string, _value?: any) {
        // 触发 refresh 即可，实际绘制在 onUpdate
    }

    onUpdate() {
        const ctx = this.owner.ctx
        const canvas = this.owner.canvas
        const s = this.state

        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const subject = this.buildShape(s.subjectShape, s.subjectX, s.subjectY, s.size)
        const clip = this.buildShape(s.clipShape, s.clipX, s.clipY, s.size)

        // 中线分隔
        ctx.strokeStyle = '#444'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2, 0)
        ctx.lineTo(canvas.width / 2, canvas.height)
        ctx.stroke()
        ctx.setLineDash([])

        // ── 左半区：原始两个形状 ──
        if (s.showOriginal) {
            ctx.save()
            ctx.beginPath()
            ctx.rect(0, 0, canvas.width / 2, canvas.height)
            ctx.clip()

            ctx.fillStyle = 'rgba(80, 170, 255, 0.35)'
            ctx.strokeStyle = '#4af'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            subject.toCanvasPath2D(ctx)
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = 'rgba(255, 170, 80, 0.35)'
            ctx.strokeStyle = '#fa4'
            ctx.beginPath()
            clip.toCanvasPath2D(ctx)
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        }

        // ── 右半区：布尔结果 ──
        if (s.showResult) {
            ctx.save()
            ctx.beginPath()
            ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height)
            ctx.clip()
            ctx.translate(canvas.width / 2, 0)

            const result = pathBooleanOp(subject, clip, s.op as BoolOp)
            ctx.fillStyle = 'rgba(120, 230, 140, 0.5)'
            ctx.beginPath()
            result.toCanvasPath2D(ctx)
            ctx.fill()

            if (s.resultStroke) {
                ctx.strokeStyle = '#f55'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                result.toCanvasPath2D(ctx)
                ctx.stroke()
            }
            ctx.restore()
        }

        // ── 标签 ──
        ctx.fillStyle = '#aaa'
        ctx.font = '12px sans-serif'
        ctx.fillText('Original (subject=蓝, clip=橙)', 10, 18)
        ctx.fillText(`Result: ${s.op}`, canvas.width / 2 + 10, 18)
    }
}

ExampleManager.examples = [BoolExample]
ExampleManager.getSingleInstance().init()
