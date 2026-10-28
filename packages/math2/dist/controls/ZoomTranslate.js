class ZoomTranslate {
  x = 0;
  y = 0;
  zoom = 100;
  minZoom = 10;
  maxZoom = 1e3;
  get scaleFactor() {
    return this.zoom / 100;
  }
  scale(zoom) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
  }
  scaleOrigin(zoom, x, y) {
    const oldZoom = this.zoom;
    this.scale(zoom);
    const zoomScale = this.zoom / oldZoom;
    const mx = x - this.x;
    const my = y - this.y;
    const newX = x - mx * zoomScale;
    const newY = y - my * zoomScale;
    this.x = newX;
    this.y = newY;
  }
  translate(x, y) {
    this.x += x;
    this.y += y;
  }
}
export {
  ZoomTranslate
};
