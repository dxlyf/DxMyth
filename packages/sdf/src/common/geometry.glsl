// 生成单位立方体的8个顶点（-0.5到0.5）
// 方法1：生成轴对齐包围盒（AABB）的8个顶点
// 适用于需要顶点数据的场景（如渲染）
vec3[8] generateAABBVertices(vec3 center, vec3 halfSize) {
    return vec3[8](
        // 前面四个顶点 (Z为正方向)
        center + vec3(-halfSize.x, -halfSize.y,  halfSize.z), // 左下前
        center + vec3( halfSize.x, -halfSize.y,  halfSize.z), // 右下前
        center + vec3( halfSize.x,  halfSize.y,  halfSize.z), // 右上前
        center + vec3(-halfSize.x,  halfSize.y,  halfSize.z), // 左上前
        // 后面四个顶点 (Z为负方向)
        center + vec3(-halfSize.x, -halfSize.y, -halfSize.z), // 左下后
        center + vec3( halfSize.x, -halfSize.y, -halfSize.z), // 右下后
        center + vec3( halfSize.x,  halfSize.y, -halfSize.z), // 右上后
        center + vec3(-halfSize.x,  halfSize.y, -halfSize.z)  // 左上后
    );
}
// 检查点p是否在轴对齐包围盒内
// center: 盒中心, halfSize: 盒的半边长(从中心到各面的距离)
bool isPointInAABB(vec3 p, vec3 center, vec3 halfSize) {
    // 计算点到中心在各轴上的距离
    vec3 d = abs(p - center);
    // 判断距离是否在各轴半长范围内
    return all(lessThanEqual(d, halfSize));
}