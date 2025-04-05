import { useEffect, useState } from 'react';
import { debounce } from '../functions/promises.js';

/**
 * Window "resize" listener -
 * Renvoi [window.innerWidth, window.innerHeight]
 */
export default function useResize(delay: 100 = 100) {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const onResizeHandler = debounce(() => {
            setSize([window.innerWidth, window.innerHeight]);
        }, delay);
        window.addEventListener('resize', onResizeHandler);

        return () => {
            window.removeEventListener('resize', onResizeHandler);
        };
    }, []);

    return { size: size };
}
