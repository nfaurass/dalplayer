export function throttle(fn: () => void, delay: number): (() => void) {
    let timeout: number | null = null;
    return () => {
        if (timeout === null) {
            timeout = setTimeout(() => {
                timeout = null;
            }, delay);
            fn();
        }
    };
}