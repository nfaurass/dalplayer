export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    return (...args: Parameters<T>) => {
        if (timeout === null) {
            timeout = window.setTimeout(() => {
                timeout = null;
            }, delay);
            fn(...args);
        }
    };
}