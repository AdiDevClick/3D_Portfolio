import { debounce } from '@/functions/promises.js';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { ReactNode, useMemo, useRef, useState } from 'react';

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
    const htmlRef = useRef<HTMLElement>(null);
    // useMutationObserver(handleObserver, htmlRef);
    const [scaleRatio, setScaleRatio] = useState(1);
    const [done, setDone] = useState(false);

    const debouncedUpdateScale = useMemo(
        () =>
            debounce((newScale: number) => {
                setScaleRatio(newScale);
            }, 15),
        []
    );

    const measure = () => {
        if (!htmlRef.current) {
            return;
        }
        const rect = htmlRef.current.getBoundingClientRect();
        const viewportWidth = htmlRef.current.clientWidth;
        const newRatio = viewportWidth / rect.width;

        if (rect.width !== viewportWidth && newRatio !== scaleRatio && !done) {
            setScaleRatio(newRatio);
        } else {
            setDone(true);
        }
    };

    useFrame(() => {
        if (done) return;
        if (htmlRef.current) {
            measure();
        }
    });

    return (
        <Html
            // fullscreen
            // portal={document.body.main}
            // sprite
            ref={htmlRef}
            transform
            distanceFactor={1}
            style={{ '--data-custom-scale': scaleRatio }}
            // rotatio n={[0, 3.2, 0]}
            // anchorX={1}
            // anchorY={1}
            {...props}
        >
            {/* {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child, {
                          'data-custom-scale': scaleRatio,
                      })
                    : child
            )} */}
            {children}
        </Html>
    );
}
// const relativePos = new Vector3().subVectors(camera.position, target);
// const spherical = new Spherical();
// spherical.setFromVector3(relativePos);
// // Définir les limites à ±30° en radians
// const minAzimuth = MathUtils.degToRad(-30);
// const maxAzimuth = MathUtils.degToRad(30);

// // On « clampe » l'azimut (theta) entre ces deux valeurs
// spherical.theta = MathUtils.clamp(spherical.theta, minAzimuth, maxAzimuth);

// // Reconvertir en coordonnées cartésiennes
// const newRelativePos = new Vector3().setFromSpherical(spherical);

// // La nouvelle position de la caméra est la cible plus la nouvelle position relative
// camera.position.copy(target).add(newRelativePos);

// // Si nécessaire, forcer le rafraîchissement des matrices
// camera.updateMatrixWorld();
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
    return (node: T) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref != null) {
                ref.current = node;
            }
        });
    };
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
