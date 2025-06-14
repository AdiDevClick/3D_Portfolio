import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): T {
    const lastRan = useRef(0);
    const timerRef = useRef<number | null>(null);

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastExecution = lastRan.current + delay;

            // Enought time has passed since the last execution ?
            if (now < timeSinceLastExecution) {
                clearTimeout(timerRef.current ?? undefined);
                timerRef.current = setTimeout(() => {
                    lastRan.current = now;
                    callback(...args);
                }, delay);
            } else {
                // Execute immediately
                lastRan.current = now;
                callback(...args);
            }
        }) as T,
        [callback, delay]
    );
}
