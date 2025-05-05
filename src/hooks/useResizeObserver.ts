import { debounce } from '@/functions/promises.js';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export function useElementWidth() {
    // export function useElementWidth(delay: 100 = 100) {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    // const [[width, height], setSize] = useState([0, 0]);

    useLayoutEffect(() => {
        const node = ref.current;

        if (!node) return;
        console.log('object');
        // Vérification initiale
        setWidth(node.getBoundingClientRect().width);
        // setSize([
        //     node.getBoundingClientRect().width,
        //     node.getBoundingClientRect().height,
        // ]);

        // Création du ResizeObserver
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // if (entry.target === node) {
                // debounce(() => {
                //     setSize([
                //         entry.contentRect.width,
                //         entry.contentRect.height,
                //     ]);
                // }, delay);
                if (entry.target === node && entry.contentRect.width > 0) {
                    setWidth(entry.contentRect.width);
                }
                // }
            }
        });
        resizeObserver.observe(node);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return [ref, width];
    // return [ref, width, height];
}
