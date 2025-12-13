// ==================== 类型定义 ====================
export type Point = {
  x: number;
  y: number;
};

export type Circle = {
  radius: number;
  center?: Point;
};

export type Rectangle = {
  width: number;
  height: number;
  position?: Point;
};

export type Triangle = {
  sideA: number;
  sideB: number;
  sideC: number;
  vertices?: [Point, Point, Point];
};

export type Square = {
  side: number;
  position?: Point;
};

export type Ellipse = {
  radiusX: number;
  radiusY: number;
  center?: Point;
};

export type Polygon = {
  vertices: Point[];
};

export type Sector = {
  radius: number;
  angle: number; // 角度，单位：度
  center?: Point;
};

export type Ring = {
  outerRadius: number;
  innerRadius: number;
  center?: Point;
};

export type Trapezoid = {
  base1: number;
  base2: number;
  height: number;
  position?: Point;
};

// ==================== 数学常数 ====================
const PI = Math.PI;

// ==================== 通用工具函数 ====================
/**
 * 检查数值是否为正数
 */
const validatePositive = (value: number, name: string): void => {
  if (value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
};

/**
 * 检查数值是否为非负数
 */
const validateNonNegative = (value: number, name: string): void => {
  if (value < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
};

/**
 * 检查三角形边长是否合法
 */
const validateTriangleSides = (a: number, b: number, c: number): void => {
  validatePositive(a, 'sideA');
  validatePositive(b, 'sideB');
  validatePositive(c, 'sideC');
  
  if (a + b <= c || a + c <= b || b + c <= a) {
    throw new Error('Invalid triangle sides: the sum of any two sides must be greater than the third side');
  }
};

/**
 * 计算两点之间的距离
 */
export const distance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 角度转弧度
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * PI) / 180;
};

/**
 * 弧度转角度
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / PI;
};

// ==================== 基本图形面积计算 ====================
/**
 * 计算圆的面积
 */
export const circleArea = (circle: Circle): number => {
  validatePositive(circle.radius, 'radius');
  return PI * circle.radius * circle.radius;
};

/**
 * 计算圆的周长
 */
export const circleCircumference = (circle: Circle): number => {
  validatePositive(circle.radius, 'radius');
  return 2 * PI * circle.radius;
};

/**
 * 计算圆的直径
 */
export const circleDiameter = (circle: Circle): number => {
  validatePositive(circle.radius, 'radius');
  return 2 * circle.radius;
};

/**
 * 计算矩形的面积
 */
export const rectangleArea = (rectangle: Rectangle): number => {
  validatePositive(rectangle.width, 'width');
  validatePositive(rectangle.height, 'height');
  return rectangle.width * rectangle.height;
};

/**
 * 计算矩形的周长
 */
export const rectanglePerimeter = (rectangle: Rectangle): number => {
  validatePositive(rectangle.width, 'width');
  validatePositive(rectangle.height, 'height');
  return 2 * (rectangle.width + rectangle.height);
};

/**
 * 计算矩形的对角线长度
 */
export const rectangleDiagonal = (rectangle: Rectangle): number => {
  validatePositive(rectangle.width, 'width');
  validatePositive(rectangle.height, 'height');
  return Math.sqrt(rectangle.width * rectangle.width + rectangle.height * rectangle.height);
};

/**
 * 使用海伦公式计算三角形面积
 */
export const triangleArea = (triangle: Triangle): number => {
  validateTriangleSides(triangle.sideA, triangle.sideB, triangle.sideC);
  
  const { sideA, sideB, sideC } = triangle;
  const s = (sideA + sideB + sideC) / 2; // 半周长
  return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
};

/**
 * 计算三角形周长
 */
export const trianglePerimeter = (triangle: Triangle): number => {
  validateTriangleSides(triangle.sideA, triangle.sideB, triangle.sideC);
  
  const { sideA, sideB, sideC } = triangle;
  return sideA + sideB + sideC;
};

/**
 * 通过底和高计算三角形面积
 */
export const triangleAreaByBaseHeight = (base: number, height: number): number => {
  validatePositive(base, 'base');
  validatePositive(height, 'height');
  return (base * height) / 2;
};

/**
 * 计算正方形的面积
 */
export const squareArea = (square: Square): number => {
  validatePositive(square.side, 'side');
  return square.side * square.side;
};

/**
 * 计算正方形的周长
 */
export const squarePerimeter = (square: Square): number => {
  validatePositive(square.side, 'side');
  return 4 * square.side;
};

/**
 * 计算正方形的对角线长度
 */
export const squareDiagonal = (square: Square): number => {
  validatePositive(square.side, 'side');
  return square.side * Math.sqrt(2);
};

/**
 * 计算椭圆面积
 */
export const ellipseArea = (ellipse: Ellipse): number => {
  validatePositive(ellipse.radiusX, 'radiusX');
  validatePositive(ellipse.radiusY, 'radiusY');
  return PI * ellipse.radiusX * ellipse.radiusY;
};

/**
 * 计算椭圆周长（近似公式）
 */
export const ellipseCircumference = (ellipse: Ellipse): number => {
  validatePositive(ellipse.radiusX, 'radiusX');
  validatePositive(ellipse.radiusY, 'radiusY');
  
  const { radiusX, radiusY } = ellipse;
  const h = Math.pow(radiusX - radiusY, 2) / Math.pow(radiusX + radiusY, 2);
  return PI * (radiusX + radiusY) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
};

// ==================== 多边形相关计算 ====================
/**
 * 计算任意多边形面积（使用鞋带公式）
 */
export const polygonArea = (polygon: Polygon): number => {
  if (polygon.vertices.length < 3) {
    throw new Error('Polygon must have at least 3 vertices');
  }
  
  const { vertices } = polygon;
  let area = 0;
  
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    area += current.x * next.y - next.x * current.y;
  }
  
  return Math.abs(area) / 2;
};

/**
 * 计算多边形周长
 */
export const polygonPerimeter = (polygon: Polygon): number => {
  if (polygon.vertices.length < 2) {
    throw new Error('Polygon must have at least 2 vertices');
  }
  
  const { vertices } = polygon;
  let perimeter = 0;
  
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    perimeter += distance(current, next);
  }
  
  return perimeter;
};

/**
 * 判断点是否在多边形内（使用射线法）
 */
export const pointInPolygon = (point: Point, polygon: Polygon): boolean => {
  const { x, y } = point;
  const { vertices } = polygon;
  let inside = false;
  
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y;
    const xj = vertices[j].x, yj = vertices[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

// ==================== 其他特殊图形计算 ====================
/**
 * 计算扇形面积
 */
export const sectorArea = (sector: Sector): number => {
  validatePositive(sector.radius, 'radius');
  validateNonNegative(sector.angle, 'angle');
  
  if (sector.angle > 360) {
    throw new Error('Angle must be between 0 and 360 degrees');
  }
  
  const angleRadians = degreesToRadians(sector.angle);
  return (angleRadians / (2 * PI)) * PI * sector.radius * sector.radius;
};

/**
 * 计算扇形弧长
 */
export const sectorArcLength = (sector: Sector): number => {
  validatePositive(sector.radius, 'radius');
  validateNonNegative(sector.angle, 'angle');
  
  if (sector.angle > 360) {
    throw new Error('Angle must be between 0 and 360 degrees');
  }
  
  const angleRadians = degreesToRadians(sector.angle);
  return sector.radius * angleRadians;
};

/**
 * 计算圆环面积
 */
export const ringArea = (ring: Ring): number => {
  validatePositive(ring.outerRadius, 'outerRadius');
  validatePositive(ring.innerRadius, 'innerRadius');
  
  if (ring.innerRadius >= ring.outerRadius) {
    throw new Error('Inner radius must be less than outer radius');
  }
  
  return PI * (ring.outerRadius * ring.outerRadius - ring.innerRadius * ring.innerRadius);
};

/**
 * 计算梯形面积
 */
export const trapezoidArea = (trapezoid: Trapezoid): number => {
  validatePositive(trapezoid.base1, 'base1');
  validatePositive(trapezoid.base2, 'base2');
  validatePositive(trapezoid.height, 'height');
  
  return ((trapezoid.base1 + trapezoid.base2) * trapezoid.height) / 2;
};

/**
 * 计算平行四边形面积
 */
export const parallelogramArea = (base: number, height: number): number => {
  validatePositive(base, 'base');
  validatePositive(height, 'height');
  return base * height;
};

/**
 * 计算菱形面积（通过对角线）
 */
export const rhombusAreaByDiagonals = (diagonal1: number, diagonal2: number): number => {
  validatePositive(diagonal1, 'diagonal1');
  validatePositive(diagonal2, 'diagonal2');
  return (diagonal1 * diagonal2) / 2;
};

/**
 * 计算菱形面积（通过边长和高）
 */
export const rhombusAreaBySideHeight = (side: number, height: number): number => {
  validatePositive(side, 'side');
  validatePositive(height, 'height');
  return side * height;
};

// ==================== 图形关系判断 ====================
/**
 * 判断点是否在圆内
 */
export const pointInCircle = (point: Point, circle: Circle): boolean => {
  if (!circle.center) return false;
  
  const dx = point.x - circle.center.x;
  const dy = point.y - circle.center.y;
  const distanceSquared = dx * dx + dy * dy;
  
  return distanceSquared <= circle.radius * circle.radius;
};

/**
 * 判断点是否在矩形内
 */
export const pointInRectangle = (point: Point, rectangle: Rectangle): boolean => {
  if (!rectangle.position) return false;
  
  return point.x >= rectangle.position.x &&
    point.x <= rectangle.position.x + rectangle.width &&
    point.y >= rectangle.position.y &&
    point.y <= rectangle.position.y + rectangle.height;
};

/**
 * 判断两个圆是否相交
 */
export const circlesIntersect = (circle1: Circle, circle2: Circle): boolean => {
  if (!circle1.center || !circle2.center) return false;
  
  const dist = distance(circle1.center, circle2.center);
  const radiusSum = circle1.radius + circle2.radius;
  
  return dist <= radiusSum;
};

/**
 * 判断两个矩形是否相交
 */
export const rectanglesIntersect = (rect1: Rectangle, rect2: Rectangle): boolean => {
  if (!rect1.position || !rect2.position) return false;
  
  return rect1.position.x < rect2.position.x + rect2.width &&
    rect1.position.x + rect1.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height > rect2.position.y;
};


export default {

  
  // 工具函数
  distance,
  degreesToRadians,
  radiansToDegrees,
  
  // 基本图形面积
  circleArea,
  circleCircumference,
  circleDiameter,
  rectangleArea,
  rectanglePerimeter,
  rectangleDiagonal,
  triangleArea,
  trianglePerimeter,
  triangleAreaByBaseHeight,
  squareArea,
  squarePerimeter,
  squareDiagonal,
  ellipseArea,
  ellipseCircumference,
  
  // 多边形
  polygonArea,
  polygonPerimeter,
  pointInPolygon,
  
  // 特殊图形
  sectorArea,
  sectorArcLength,
  ringArea,
  trapezoidArea,
  parallelogramArea,
  rhombusAreaByDiagonals,
  rhombusAreaBySideHeight,
  
  // 图形关系
  pointInCircle,
  pointInRectangle,
  circlesIntersect,
  rectanglesIntersect,
  
  
};