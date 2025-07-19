import { measure } from '@/components/3DComponents/Html/Functions';
import { HtmlContainerTypes } from '@/components/3DComponents/Html/HtmlPagesTypes';
import { FOCUS_DELAY_MOBILE } from '@/configs/Camera.config';
import { animated, useSpring } from '@react-spring/three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

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
    ref,
    ...props
}: HtmlContainerTypes) {
    const [scaleRatio, setScaleRatio] = useState(1);
    const [done, setDone] = useState(false);

    const htmlRef = useRef<HTMLDivElement>(null);
    const actualRef = ref || htmlRef;

    const frameCountRef = useRef(0);

    // Scale animation
    const springProps = useSpring({
        from: { scale: scaleRatio / 2 },
        to: { scale: scaleRatio },
        // scale: scaleRatio,
        config: {
            mass: 1,
            tension: 120,
            friction: 14,
        },
        delay: props.isMobile ? FOCUS_DELAY_MOBILE : 100,
    });

    useFrame(() => {
        if (done || !actualRef.current) return;
        frameCountRef.current += 1;
        // Update every 20 frames or 200 on mobile
        if (
            frameCountRef.current %
                (props.isMobile ? FOCUS_DELAY_MOBILE / 2 : 70) ===
            0
        ) {
            // if (frameCountRef.current % 50 === 0) {
            measure(actualRef.current, {
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
            actualRef.current?.removeAttribute('style');
            setDone(false);
            frameCountRef.current = 0;
        }
    }, [dynamicContent, forceMeasure]);

    return (
        <animated.group scale={springProps.scale}>
            <Html
                ref={actualRef}
                transform
                distanceFactor={distanceFactor}
                {...props}
            >
                {children}
            </Html>
        </animated.group>
    );
}
