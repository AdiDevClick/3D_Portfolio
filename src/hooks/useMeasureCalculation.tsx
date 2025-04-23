import { measure } from '@/components/3DComponents/Html/Functions.ts';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

export function useMeasureCalculation(elementRef, dynamicContent, children) {
    const [scaleRatio, setScaleRatio] = useState(1);
    const [done, setDone] = useState(false);

    const frameCountRef = useRef(0);
    // const observer = useMutationObserver(handleObserver, measure, {
    //     scaleRatio,
    //     setScaleRatio,
    //     done,
    //     setDone,
    // });
    // const htmlRef = mergeRefs(html, observer);

    useFrame(() => {
        if (done || !elementRef.current) return;
        frameCountRef.current += 1;
        // Update every 10 frames
        if (frameCountRef.current % 10 === 0) {
            measure(elementRef.current, {
                scaleRatio,
                setScaleRatio,
                done,
                setDone,
            });
        }
    });

    /**
     * In & Out animation for the HTML element
     * when out of the canvas -
     */
    useEffect(() => {
        if (dynamicContent) {
            setDone(false);
            frameCountRef.current = 0;
        }
    }, [children]);

    return { scaleRatio };
}
