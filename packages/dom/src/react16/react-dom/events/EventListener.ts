

export function addEventBubbleListener(
  element: Document | Element,
  eventType: string,
  listener: (...args:any[])=>void,
): void {
  element.addEventListener(eventType, listener, false);
}

export function addEventCaptureListener(
  element: Document | Element,
  eventType: string,
  listener: (...args:any[])=>void,
): void {
  element.addEventListener(eventType, listener, true);
}
