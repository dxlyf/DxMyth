好的 ✅
下面整理一个**求导计算法则总览**，既包含基本规则，也包含常见函数的导数公式。你可以把它理解为一个「微积分求导速查表」。

---

# 🌟 一、基本求导定义

若函数 $f(x)$ 在点 $x=a$ 附近可导，则导数定义为：

$$
f'(a) = \lim_{h\to 0}\frac{f(a+h)-f(a)}{h}.
$$

---

# 📘 二、基本运算规则（四则运算法则）

1. **常数法则**

   $$
   \frac{d}{dx}(C) = 0
   $$

2. **幂函数法则**

   $$
   \frac{d}{dx}(x^n) = n x^{n-1}, \quad (n\in \mathbb{R})
   $$

3. **常数倍法则**

   $$
   \frac{d}{dx}[c \cdot f(x)] = c \cdot f'(x)
   $$

4. **加减法则**

   $$
   \frac{d}{dx}[f(x)\pm g(x)] = f'(x)\pm g'(x)
   $$

5. **乘积法则**（莱布尼茨法则）

   $$
   (f(x)g(x))' = f'(x)g(x) + f(x)g'(x)
   $$

6. **商法则**

   $$
   \left(\frac{f(x)}{g(x)}\right)' = \frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}, \quad g(x)\neq 0
   $$

---

# 📗 三、复合函数求导

1. **链式法则**

   $$
   \frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)
   $$

2. **反函数求导公式**
   若 $y=f(x)$，且存在反函数 $x=f^{-1}(y)$，则

   $$
   (f^{-1})'(y) = \frac{1}{f'(x)} \quad (\text{其中 } x=f^{-1}(y))
   $$

---

# 📙 四、常见初等函数导数

1. **指数函数**

   $$
   \frac{d}{dx}(a^x) = a^x \ln a, \quad (a>0,a\neq 1)
   $$

   $$
   \frac{d}{dx}(e^x) = e^x
   $$

2. **对数函数**

   $$
   \frac{d}{dx}(\ln x) = \frac{1}{x}, \quad (x>0)
   $$

   $$
   \frac{d}{dx}(\log_a x) = \frac{1}{x \ln a}, \quad (a>0,a\neq 1)
   $$

3. **三角函数**

   $$
   (\sin x)' = \cos x, \quad (\cos x)' = -\sin x
   $$

   $$
   (\tan x)' = \sec^2 x, \quad (\cot x)' = -\csc^2 x
   $$

   $$
   (\sec x)' = \sec x \tan x, \quad (\csc x)' = -\csc x \cot x
   $$

4. **反三角函数**

   $$
   (\arcsin x)' = \frac{1}{\sqrt{1-x^2}}, \quad |x|<1
   $$

   $$
   (\arccos x)' = -\frac{1}{\sqrt{1-x^2}}, \quad |x|<1
   $$

   $$
   (\arctan x)' = \frac{1}{1+x^2}
   $$

   $$
   (\arccot x)' = -\frac{1}{1+x^2}
   $$

5. **双曲函数**

   $$
   (\sinh x)' = \cosh x, \quad (\cosh x)' = \sinh x
   $$

   $$
   (\tanh x)' = \operatorname{sech}^2 x, \quad (\coth x)' = -\operatorname{csch}^2 x
   $$

---

# 📒 五、高阶导数法则

1. **n 阶导数定义**

   $$
   f^{(n)}(x) = \frac{d^n}{dx^n}f(x)
   $$

2. **常见模式**

   * $(e^{ax})^{(n)} = a^n e^{ax}$
   * $(\sin ax)^{(n)}$、$(\cos ax)^{(n)}$ 周期性：每 4 次循环一次。
   * $(x^m)^{(n)} = \frac{m!}{(m-n)!}x^{m-n}, \quad m\ge n$，否则为 0。

---

# 📔 六、特别公式

1. **对数求导法**
   若 $y=f(x)=u(x)^{v(x)}$，可取对数：

   $$
   \ln y = v(x)\ln u(x) \quad \Rightarrow \quad \frac{y'}{y} = v'(x)\ln u(x) + v(x)\frac{u'(x)}{u(x)}.
   $$

2. **隐函数求导**
   若由方程 $F(x,y)=0$ 定义 $y(x)$，则

   $$
   \frac{dy}{dx} = -\frac{F_x}{F_y}
   $$

---

要不要我帮你整理成一个 **「导数公式表（可打印版）」PDF**？这样你可以直接在学习或工作时查阅。
