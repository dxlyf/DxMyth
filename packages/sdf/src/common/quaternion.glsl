
// 四元数与四元数相乘的函数
vec4 quatMultiply(vec4 q1, vec4 q2) {
    vec4 result;
    // 计算新的实部
    result.w = q1.w * q2.w - dot(q1.xyz, q2.xyz);
   
    // 计算新的虚部 (x, y, z)
    result.xyz = q1.w * q2.xyz + q2.w * q1.xyz + cross(q1.xyz, q2.xyz);

    return result;
}

// 四元数和虚四元数相乘
vec4 multiplyImaginaryQuaternions(vec4 q,vec4 vq){
	
	vec4 qv;
    	qv.w = -dot(q.xyz, vq.xyz);  // 计算实部
    	qv.xyz = q.w * vq.xyz + cross(q.xyz, vq.xyz);  // 计算虚部
	return qv;
}

// v 向量转纯虚四元数 q=(0,v.x,v.y,v.z)
// v'=q*vq*p^-1
vec3 applyQuat2(vec4 q,vec3 v){
	vec4 qInverse=vec4(-q.v,q.w);
	vec4 vq=vec4(v,0);
	vec4 qv=multiplyQuaternions(q,vq);
	vec4 qvi=multiplyQuaternions(qv,qInverse);
	return qvi.xyz;
}

// 从欧拉角任意顺序生成四元数
vec4 quatFromEulerOrder(vec3 euler, ivec3 order) {
   
    
    vec4 xAxis=quatFromAxis(vec3(1,0,0),euler.x);
    vec4 yAxis=quatFromAxis(vec3(0,1,0),euler.y);
    vec4 zAxis=quatFromAxis(vec3(0,0,1),euler.z);

    // 获取顺序索引：order.x 是第一个旋转的轴，order.z 是最后一个
    vec4 q[3] = vec4[3](qx, qy, qz);

    // 按照 order 指定的顺序相乘（从最后一个旋转开始向左乘）
    // 例如 order=XYZ(0,1,2)：先转X(0)，再转Y(1)，最后转Z(2)
    // 那么合成四元数应为：q[2] * q[1] * q[0]
    vec4 result = quatMultiply(q[order.y],q[order.z]); // 先乘最后两个
    result = quatMultiply(q[order.x],result); // 再乘第一个
    return result;
}
// 从欧拉角生成四元数
vec4 quatFromEuler(vec3 euler) {
    return quatFromEulerOrder(euler,ivec3(0,1,2));
}

// 绕任意轴旋转的四元数
vec4 quatFromAxis(vec3 axis, float angle) {
    float halfAngle = angle * 0.5;
    float s = sin(halfAngle);
    return vec4(axis * s, cos(halfAngle)); // x, y, z (虚部), w (实部)
}

// 四元数乘法
vec4 quatMultiply2(vec4 q1, vec4 q2) {
    return vec4(
        q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,  // x
        q1.w * q2.y + q1.y * q2.w + q1.z * q2.x - q1.x * q2.z,  // y
        q1.w * q2.z + q1.z * q2.w + q1.x * q2.y - q1.y * q2.x,  // z
        q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z   // w
    );
}
// 四元数乘法
vec4 quatMultiply3(vec4 q1, vec4 q2) {
    // 四元数乘法
    vec4 q;
    q.w=q1.w*q2.w-dot(q1.xyz,q2.xyz); 
    q.xyz=q1.w*q2.xyz+q2.w*q1.xyz+cross(q1.xyz,q2.xyz);
    return q;
}
// 四元数的共轭
vec4 quatConjugate(vec4 q) {
    return vec4(-q.x, -q.y, -q.z, q.w); // 共轭的四元数
}

// 四元数的逆
vec4 quatInverse(vec4 q) {
    return quatConjugate(q) / quatLength(q); // 四元数的逆
}

// 四元数的长度
float quatLength(vec4 q) {
    return sqrt(dot(q, q)); // 四元数的长度
}


// 生成纯虚四元数
vec4 quatFromVector(vec3 v) {
    return vec4(v, 0.0); // 实部为0，虚部为向量v
}
mat3 quatToMat3(vec4 q) { // 输入 q 必须是单位四元数
    float x = q.x, y = q.y, z = q.z, w = q.w;

    // 计算这些中间变量可优化性能（避免重复计算平方项）
    float xx = x * x, yy = y * y, zz = z * z;
    float xy = x * y, xz = x * z, yz = y * z;
    float wx = w * x, wy = w * y, wz = w * z;

    mat3 m;
    // 第一列：旋转后的X轴 (即用q旋转向量(1, 0, 0)的结果)
    m[0][0] = 1.0 - 2.0 * (yy + zz); // 1 - 2y² - 2z²
    m[1][0] = 2.0 * (xy + wz);       // 2xy + 2zw
    m[2][0] = 2.0 * (xz - wy);       // 2xz - 2yw

    // 第二列：旋转后的Y轴 (即用q旋转向量(0, 1, 0)的结果)
    m[0][1] = 2.0 * (xy - wz);       // 2xy - 2zw
    m[1][1] = 1.0 - 2.0 * (xx + zz); // 1 - 2x² - 2z²
    m[2][1] = 2.0 * (yz + wx);       // 2yz + 2xw

    // 第三列：旋转后的Z轴 (即用q旋转向量(0, 0, 1)的结果)
    m[0][2] = 2.0 * (xz + wy);       // 2xz + 2yw
    m[1][2] = 2.0 * (yz - wx);       // 2yz - 2xw
    m[2][2] = 1.0 - 2.0 * (xx + yy); // 1 - 2x² - 2y²

    // 在GLSL中，mat3构造函数按列填充，所以也可以这样写：
    // mat3 m = mat3(
    //     1-2*(yy+zz),  2*(xy+wz),   2*(xz-wy),
    //     2*(xy-wz),   1-2*(xx+zz),  2*(yz+wx),
    //     2*(xz+wy),   2*(yz-wx),   1-2*(xx+yy)
    // );
    return m;
}
// 从旋转矩阵提取四元数
vec4 quatFromRotationMatrix(mat4 m) {
    float trace = m[0][0] + m[1][1] + m[2][2];
    vec4 q;
    if (trace > 0.0) {
        float s = sqrt(trace + 1.0) * 2.0;
        q.w = 0.25 * s;
        q.x = (m[2][1] - m[1][2]) / s;
        q.y = (m[0][2] - m[2][0]) / s;
        q.z = (m[1][0] - m[0][1]) / s;
    } else if ((m[0][0] > m[1][1]) && (m[0][0] > m[2][2])) {
        float s = sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]) * 2.0;
        q.w = (m[2][1] - m[1][2]) / s;
        q.x = 0.25 * s;
        q.y = (m[0][1] + m[1][0]) / s;
        q.z = (m[0][2] + m[2][0]) / s;
    } else if (m[1][1] > m[2][2]) {
        float s = sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]) * 2.0;
        q.w = (m[0][2] - m[2][0]) / s;
        q.x = (m[0][1] + m[1][0]) / s;
        q.y = 0.25 * s;
        q.z = (m[1][2] + m[2][1]) / s;
    } else {
        float s = sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]) * 2.0;
        q.w = (m[1][0] - m[0][1]) / s;
        q.x = (m[0][2] + m[2][0]) / s;
        q.y = (m[1][2] + m[2][1]) / s;
        q.z = 0.25 * s;
    }
    return q;
}

// 四元数插值（球面线性插值, Slerp）
vec4 quatSlerp(vec4 q1, vec4 q2, float t) {
    float dotProd = dot(q1, q2);
    if (dotProd < 0.0) {
        q2 = -q2;
        dotProd = -dotProd;
    }
    const float THRESHOLD = 0.9995;
    if (dotProd > THRESHOLD) {
        return normalize(q1 + t * (q2 - q1));
    }
    float theta = acos(dotProd);
    float sinTheta = sin(theta);
    return (sin((1.0 - t) * theta) * q1 + sin(t * theta) * q2) / sinTheta;
}

// 计算两个四元数之间的夹角
float quatAngleBetween(vec4 q1, vec4 q2) {
    return 2.0 * acos(abs(dot(q1, q2)));
}

// 用四元数旋转向量
// q*p*q^-1 = q*p*q^-1

vec3 applyQuat(vec4 q,vec3 v) {
    //将v定义下纯四元数
    vec4 p=vec4(v,0);
    // 
    vec3 qi=quatInverse(q);
    return quatMultiply(q,quatMultiply(p,qi)).v;
}

