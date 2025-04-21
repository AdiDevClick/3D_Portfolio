import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning.tsx';
import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';
import { useMutationObserver } from '@/hooks/useMutationObserver.tsx';
import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { g } from 'node_modules/react-router/dist/development/fog-of-war-1hWhK5ey.d.mts';
import { ac } from 'node_modules/react-router/dist/development/route-data-5OzAzQtT.d.mts';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Group, Matrix4, Quaternion, Vector3 } from 'three';

const handleObserver = (mutationsList, observer) => {
    console.log('Mutation détectée:', mutationsList.length);
    mutationsList.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            console.log('Nœuds ajoutés:', mutation.addedNodes.length);
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

export function Home({ controlsRef, reducer }) {
    const pageRef = useRef(null);
    const groupRef = useRef<Group>(null);
    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeURL, setActiveURL] = useState(false);

    const targetPosition = useRef(new Vector3());
    const targetLookAt = useRef(new Vector3());
    const currentLookAt = useRef(new Vector3(0, 0, 0));

    const { positionCameraToCard } = useCameraPositioning();
    const { lookAtSmooth } = useLookAtSmooth();
    // const homeRef = useRef(null);
    // const { setRef, node, observer } = useMutationObserver(handleObserver);

    /**
     * Activate page URL and content loaded
     */
    useEffect(() => {
        if (!pageRef.current) return;
        setIsLoaded(true);
        !location.pathname.includes('projets')
            ? setActiveURL(true)
            : setActiveURL(false);
    }, [pageRef.current, location]);

    /**
     * Positioning camera to the page on load
     */
    useEffect(() => {
        if (!groupRef.current || !isLoaded || !pageRef.current) return;

        if (activeURL) {
            lookAtSmooth(groupRef.current.position);
        }
    }, [activeURL, isLoaded]);

    /**
     * POSITIONING IF URL IS ACTIVE / NON ACTIVE -
     */
    useFrame((state, delta) => {
        if (groupRef.current && isLoaded) {
            easing.damp3(
                groupRef.current.position,
                activeURL
                    ? ACTIVE_PROJECTS_POSITION_SETTINGS
                    : DEFAULT_PROJECTS_POSITION_SETTINGS,
                0.3,
                delta
            );

            // if (pageRef.current && activeURL) {
            //     const cameraPosition = state.camera.position.clone();

            //     // Créer un vecteur de direction vers la caméra
            //     const directionToCamera = cameraPosition
            //         .clone()
            //         .sub(groupRef.current.position)
            //         .normalize();

            //     // Calculer la rotation nécessaire pour regarder la caméra
            //     const lookAtMatrix = new Matrix4().lookAt(
            //         directionToCamera,
            //         new Vector3(0, 0, 0),
            //         new Vector3(0, 1, 0)
            //     );
            //     const lookAtQuaternion = new Quaternion().setFromRotationMatrix(
            //         lookAtMatrix
            //     );

            //     groupRef.current.quaternion.copy(lookAtQuaternion);

            //     const targetDistance = 20;
            //     const currentDistance =
            //         groupRef.current.position.distanceTo(cameraPosition);

            //     if (Math.abs(currentDistance - targetDistance) > 0.1) {
            //         // Calculer la position idéale à la distance cible
            //         const idealPosition = cameraPosition
            //             .clone()
            //             .sub(directionToCamera.multiplyScalar(targetDistance));

            //         // Interpoler vers cette position avec amortissement pour éviter les sauts
            //         easing.damp3(
            //             groupRef.current.position,
            //             [idealPosition.x, idealPosition.y, idealPosition.z],
            //             1,
            //             delta
            //         );
            //     }
            // }
        }
    });

    return (
        // <group>
        <Billboard
            ref={groupRef}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
            position={[0, 0, 0]}
        >
            <HtmlContainer
                distanceFactor={1}
                portal={document.body}
                className="html-container"
            >
                <HomeContent
                    ref={pageRef}
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transform: 'translate(-50%)',
                        transition:
                            'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        height: '500px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 0,
                    }}
                />
            </HtmlContainer>
        </Billboard>
        // </group>
    );
}
export function HomeContent({ ...props }) {
    return (
        <div
            {...props}
            // className="lateral-menu"
        >
            <h1 style={{ color: 'black' }}>Accueil</h1>
            <p style={{ color: 'black' }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, voluptatibus. Lorem ipsum dolor sit amet{' '}
            </p>
        </div>
    );
}
