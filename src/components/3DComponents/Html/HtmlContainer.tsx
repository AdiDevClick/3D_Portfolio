import { measure } from '@/components/3DComponents/Html/Functions';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { Html } from '@react-three/drei';
import { HtmlProps } from '@react-three/drei/web/Html';
import { useFrame } from '@react-three/fiber';
import { ReactNode, useEffect, useRef, useState } from 'react';

type HtmlContainerTypes = {
    reducer?: ReducerType;
    children: ReactNode;
    dynamicContent?: boolean;
    forceMeasure?: boolean;
    distanceFactor?: number;
} & Omit<HtmlProps, 'ref'>;

/**
 * Contient un <group /> qui sera transformé en élément 3D par défaut -
 * Il faut lui passer un children contenant les éléments voulus -
 *
 * @param children - HTML content to display
 * @param dynamicContent - If true, the content will be measured on each frame
 * @param forceMeasure - If true, will force the measure/re-measure scaling of the content
 * @param distanceFactor - Distance factor for the HTML element (default = 1)
 * @param props - Other HTML properties
 */
export function HtmlContainer({
    children,
    dynamicContent = false,
    forceMeasure = false,
    distanceFactor = 1,
    ...props
}: HtmlContainerTypes) {
    const [scaleRatio, setScaleRatio] = useState(1);
    const [done, setDone] = useState(false);

    const htmlRef = useRef<HTMLDivElement>(null);
    const frameCountRef = useRef(0);

    useFrame(() => {
        if (done || !htmlRef.current) return;
        frameCountRef.current += 1;
        // Update every 50 frames
        if (frameCountRef.current % 50 === 0) {
            measure(htmlRef.current, {
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
        if (dynamicContent || forceMeasure) {
            htmlRef.current?.removeAttribute('style');
            setDone(false);
            frameCountRef.current = 0;
        }
    }, [dynamicContent, forceMeasure]);

    return (
        <Html
            ref={htmlRef}
            transform
            distanceFactor={distanceFactor}
            scale={0.7}
            style={{ ['--data-custom-scale' as string]: scaleRatio }}
            {...props}
        >
            {children}
        </Html>
    );
}
