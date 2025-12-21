

// 四元数相乘
vec4 multiplyQuaternions(vec4 a,vec4 b){

	vec4 quat;
	// 利用复数中的虚数性质：i^2=j^2=k^2=-1 
	// 这里相当,i=x轴,j=y轴,k=z轴. 
	// 以右手坐标系为准，xy叉乘=z=k yx叉乘=-k
	// ij= k  jk= i ki= j
	// ji=-k  kj=-i ik=-j
	float aw=a.w,ax=a.x,ay=a.y,az=a.z;
	float bw=b.w,bx=b.x,by=b.y,bz=b.z;
	
	// 这里符号是负或是正，是根据上面的性质
	// out.w=a.w*b.w-dot(a.xyz,b.xyz)
	// out.xyz=a.w*b.xyz+b.w*a.xyz+cross(a.xyz,b.xyz)
	quat.w=aw*bw-ax*bx-ay*by-ax*bz;
	quat.x=aw*bx+ax*bw+ay*bz-az*by;// 如这里 ayj*bzk是正,因为jk=+i ，azk*bxi,因为ki=-j ，所以是负
	quat.y=aw*by+ay*bw-ax*bz+az*bx;
	quat.z=aw*bz+az*bw+ax*by-ay*bx;
	return quat;
}
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
    float c1 = cos(euler.x * 0.5);
    float c2 = cos(euler.y * 0.5);
    float c3 = cos(euler.z * 0.5);

    float s1 = sin(euler.x * 0.5);
    float s2 = sin(euler.y * 0.5);
    float s3 = sin(euler.z * 0.5);
    
    vec4 q;

    if (order == ivec3(0, 1, 2)) {  // 'XYZ' 顺序
        q.x = s1 * c2 * c3 + c1 * s2 * s3;
        q.y = c1 * s2 * c3 - s1 * c2 * s3;
        q.z = c1 * c2 * s3 + s1 * s2 * c3;
        q.w = c1 * c2 * c3 - s1 * s2 * s3;
    } 
    else if (order == ivec3(2, 1, 0)) { // 'ZYX' 顺序
        q.x = s1 * c2 * c3 - c1 * s2 * s3;
        q.y = c1 * s2 * c3 + s1 * c2 * s3;
        q.z = c1 * c2 * s3 - s1 * s2 * c3;
        q.w = c1 * c2 * c3 + s1 * s2 * s3;
    } 
    else if (order == ivec3(0, 2, 1)) { // 'XZY' 顺序
        q.x = s1 * c2 * c3 - c1 * s2 * s3;
        q.y = c1 * s2 * c3 - s1 * c2 * s3;
        q.z = c1 * c2 * s3 + s1 * s2 * c3;
        q.w = c1 * c2 * c3 + s1 * s2 * s3;
    }
    // 可以按需要添加更多的旋转顺序

    return q;
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
    float lenSquared = dot(q, q);
    return quatConjugate(q) / lenSquared; // 四元数的逆
}

// 四元数的长度
float quatLength(vec4 q) {
    return sqrt(dot(q, q)); // 四元数的长度
}

// 生成纯虚四元数
vec4 quatFromVector(vec3 v) {
    return vec4(v, 0.0); // 实部为0，虚部为向量v
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
vec3 applyQuat(vec4 q,vec3 v) {
    // 将向量转换为四元数的形式 (0, v)
    vec4 vq = vec4(v,0);

    // 计算 q * vq
    vec4 qv;
    qv.w = -dot(q.v, v); // w component
    qv.v = q.w * v + cross(q.v, v); // xyz component

    // 计算 (q * vq) * q^(-1)
    vec4 qConj = quatConjugate(q);
    vec4 rotatedQ;
    rotatedQ.w = qv.w * qConj.w - dot(qv.xyz, qConj.xyz);
    rotatedQ.xyz = qv.w * qConj.xyz + qConj.w * qv.xyz + cross(qv.xyz, qConj.xyz);
    // 返回旋转后的向量部分
    return rotatedQ.v;
}

// 欧拉角转四元数 
vec3 quatFromEulerOrder2(vec3 euler,ivec3 order){
	Quaternion quat;
	// 四元数绕x轴旋转 Qx=quat(cos(a/2),sin(a/2),0,0)
	// 四元数绕y轴旋转 Qy=quat(cos(a/2),0,sin(a/2),0)
	// 四元数绕z轴旋转 Qz=quat(cos(a/2),0,0,sin(a/2))
	// euler xyz->Qz*(Qy*Qx)
	vec4 qx=quatFromAxis(vec3(1,0,0),euler.x);
	vec4 qy=quatFromAxis(vec3(0,1,0),euler.y);
	vec4 qz=quatFromAxis(vec3(0,0,1),euler.z);
	
    vec3 qxyz[3]
    if(order==ivec3(0,1,2)){ // xyz
        qxyz[0]=qx;
        qxyz[1]=qy;
        qxyz[2]=qz;
    }
    else if(order==ivec3(1,0,2)){ // ZYX
        qxyz[0]=qz;
        qxyz[1]=qy;
        qxyz[2]=qx;
    }  
    else if(order==ivec3(1,0,2)){ // XZY
        qxyz[0]=qx;
        qxyz[1]=qz;
        qxyz[2]=qy;
    }
	return quatMultiply(qxyz[2],quatMultiply(qxyz[1],qxyz[0]));;
}