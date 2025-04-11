import { measure } from '@/components/3DComponents/Html/Functions';
import { debounce } from '@/functions/promises.js';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type HtmlContainerTypes = {
    width: number;
    reducer: ReducerType;
    children: ReactNode;
};

/**
 * Contient un <group /> qui sera transformé en élément 3D par défaut -
 * Il faut lui passer un children contenant les éléments voulus -
 */
export function HtmlContainer({
    children,
    reducer,
    ...props
}: HtmlContainerTypes) {
    const [scaleRatio, setScaleRatio] = useState(1);
    const [done, setDone] = useState(false);

    const htmlRef = useRef<HTMLElement>(null);
    const frameCountRef = useRef(0);
    // const observer = useMutationObserver(handleObserver, measure, {
    //     scaleRatio,
    //     setScaleRatio,
    //     done,
    //     setDone,
    // });
    // const htmlRef = mergeRefs(html, observer);

    const measureContent = useMemo(
        () =>
            debounce((element: HTMLElement | null, currentScale: number) => {
                if (!element) return;
                console.log('object');
                measure(element, {
                    scaleRatio: currentScale,
                    setScaleRatio,
                    done,
                    setDone,
                });
            }, 100),
        [done]
    );

    useFrame(() => {
        if (done || !htmlRef.current) return;
        frameCountRef.current += 1;
        // Update every 4 frames
        if (frameCountRef.current % 4 === 0) {
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
        setDone(false);
        frameCountRef.current = 0;
    }, [children]);

    return (
        <Html
            ref={htmlRef}
            transform
            distanceFactor={1}
            style={{ '--data-custom-scale': scaleRatio }}
            {...props}
        >
            {children}
        </Html>
    );
}

const handleObserver = (mutationsList, observer) => {
    console.log(observer);
    mutationsList.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            console.log('object');
            const addedNodes = mutation.addedNodes[0].children;
            for (const node of addedNodes) {
                // if (this.#inputsToListen.includes(node.type)) {
                // Setting which input can be empty
                // setObjectPropertyTo(
                //     this.options.whichInputCanBeEmpty,
                //     node,
                //     node.name,
                //     'canBeEmpty',
                //     true
                // );
                // Setting which input can accept special char
                // setObjectPropertyTo(
                //     this.options.whichInputAllowSpecialCharacters,
                //     node,
                //     node.name,
                //     'allowSpecialCharacters',
                //     true
                // );
                // Creating valid / invalid icon for each inputs
                // this.#createIconContainer(node);
                // // Main dynamic checker
                // node.addEventListener(
                //     'input',
                //     debounce((e) => {
                //         this.#dynamicCheck(e.target);
                //     }, this.debounceDelay)
                // );
                // }
            }
        }
    });
};
