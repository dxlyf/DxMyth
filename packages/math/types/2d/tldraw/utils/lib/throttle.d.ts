/**
 * Creates a throttled version of a function that executes at most once per frame (60fps).
 * Subsequent calls within the same frame are ignored, ensuring smooth performance
 * for high-frequency events like mouse movements or scroll events.
 *
 * @param fn - The function to throttle, optionally with a cancel method
 * @returns A throttled function with an optional cancel method to remove pending calls
 *
 * @example
 * ```ts
 * const updateCanvas = fpsThrottle(() => {
 *   // This will run at most once per frame (~16.67ms)
 *   redrawCanvas()
 * })
 *
 * // Call as often as you want - automatically throttled to 60fps
 * document.addEventListener('mousemove', updateCanvas)
 *
 * // Cancel pending calls if needed
 * updateCanvas.cancel?.()
 * ```
 *
 * @internal
 */
export declare function fpsThrottle(fn: {
    (): void;
    cancel?(): void;
}): {
    (): void;
    cancel?(): void;
};
/**
 * Schedules a function to execute on the next animation frame, targeting 60fps.
 * If the same function is passed multiple times before the frame executes,
 * it will only be called once, effectively batching multiple calls.
 *
 * @param fn - The function to execute on the next frame
 * @returns A cancel function that can prevent execution if called before the next frame
 *
 * @example
 * ```ts
 * const updateUI = throttleToNextFrame(() => {
 *   // Batches multiple calls into the next animation frame
 *   updateStatusBar()
 *   refreshToolbar()
 * })
 *
 * // Multiple calls within the same frame are batched
 * updateUI() // Will execute
 * updateUI() // Ignored (same function already queued)
 * updateUI() // Ignored (same function already queued)
 *
 * // Get cancel function to prevent execution
 * const cancel = updateUI()
 * cancel() // Prevents execution if called before next frame
 * ```
 *
 * @internal
 */
export declare function throttleToNextFrame(fn: () => void): () => void;
