
// 实现 copysign 函数，将 y 的符号复制给 x
float copysign(float x, float y) {
    return y < 0.0 ? -abs(x) : abs(x);
}

// 从旋转矩阵生成欧拉角（XYZ 顺序）
vec3 eulerFromRotationMatrix(mat4 m) {
    float sy = sqrt(m[0][0] * m[0][0] + m[1][0] * m[1][0]);

    bool singular = sy < 1e-6; // 判断是否接近奇异点

    float x, y, z;
    if (!singular) {
        x = atan(m[2][1], m[2][2]);
        y = atan(-m[2][0], sy);
        z = atan(m[1][0], m[0][0]);
    } else {
        x = atan(-m[1][2], m[1][1]);
        y = atan(-m[2][0], sy);
        z = 0.0;
    }
    
    return vec3(x, y, z); // 返回欧拉角 (x, y, z)
}
// 从四元数生成欧拉角（XYZ 顺序）
vec3 eulerFromQuaternion(vec4 q) {
    float sinr_cosp = 2.0 * (q.w * q.x + q.y * q.z);
    float cosr_cosp = 1.0 - 2.0 * (q.x * q.x + q.y * q.y);
    float x = atan(sinr_cosp, cosr_cosp);

    float sinp = 2.0 * (q.w * q.y - q.z * q.x);
    float y;
    if (abs(sinp) >= 1.0)
        y = copysign(PI / 2.0, sinp); // 使用 90 度防止超出范围
    else
        y = asin(sinp);

    float siny_cosp = 2.0 * (q.w * q.z + q.x * q.y);
    float cosy_cosp = 1.0 - 2.0 * (q.y * q.y + q.z * q.z);
    float z = atan(siny_cosp, cosy_cosp);

    return vec3(x, y, z); // 返回欧拉角 (x, y, z)
}
