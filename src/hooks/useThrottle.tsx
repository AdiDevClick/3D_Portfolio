import { useEffect, useRef, useState } from 'react';

function useThrottle(value, delay) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastRan = useRef(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRan.current >= delay) {
                setThrottledValue(value);
                lastRan.current = Date.now();
            }
        }, delay - (Date.now() - lastRan.current));

        return () => clearTimeout(handler);
    }, [value, delay]);

    return throttledValue;
}
