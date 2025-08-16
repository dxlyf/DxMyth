function toInt(value:string|number): number {
    let v=parseFloat(value as string)
    return Number.isFinite(v)?v:0
}

export function getMargins(element:HTMLElement) {
    const styles = window.getComputedStyle(element);
    return {
      top: toInt(styles.marginTop),
      right: toInt(styles.marginRight),
      bottom: toInt(styles.marginBottom),
      left: toInt(styles.marginLeft)
    };
  }