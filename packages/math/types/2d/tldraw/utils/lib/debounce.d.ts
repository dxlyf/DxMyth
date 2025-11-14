/**
 * Create a debounced version of a function that delays execution until after a specified wait time.
 *
 * Debouncing ensures that a function is only executed once after a specified delay,
 * even if called multiple times in rapid succession. Each new call resets the timer. The debounced
 * function returns a Promise that resolves with the result of the original function. Includes a
 * cancel method to prevent execution if needed.
 *
 * @param callback - The function to debounce (can be sync or async)
 * @param wait - The delay in milliseconds before executing the function
 * @returns A debounced function that returns a Promise and includes a cancel method
 *
 * @example
 * ```ts
 * // Debounce a search function
 * const searchAPI = (query: string) => fetch(`/search?q=${query}`)
 * const debouncedSearch = debounce(searchAPI, 300)
 *
 * // Multiple rapid calls will only execute the last one after 300ms
 * debouncedSearch('react').then(result => console.log(result))
 * debouncedSearch('react hooks') // This cancels the previous call
 * debouncedSearch('react typescript') // Only this will execute
 *
 * // Cancel pending execution
 * debouncedSearch.cancel()
 *
 * // With async/await
 * const saveData = debounce(async (data: any) => {
 *   return await api.save(data)
 * }, 1000)
 *
 * const result = await saveData({name: 'John'})
 * ```
 *
 * @public
 * @see source - https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
 */
export declare function debounce<T extends unknown[], U>(callback: (...args: T) => PromiseLike<U> | U, wait: number): {
    (...args: T): Promise<U>;
    cancel(): void;
};
