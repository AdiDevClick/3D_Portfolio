import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning.tsx';
import { useMutationObserver } from '@/hooks/useMutationObserver.tsx';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { g } from 'node_modules/react-router/dist/development/fog-of-war-1hWhK5ey.d.mts';
import { ac } from 'node_modules/react-router/dist/development/route-data-5OzAzQtT.d.mts';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Group, Vector3 } from 'three';

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

    useEffect(() => {
        if (!groupRef.current || !controlsRef.current || !isLoaded) return;

        // Position du groupe
        const groupPosition = groupRef.current.position;

        if (activeURL) {
            // Si page active, positionner la caméra devant le contenu HTML
            targetPosition.current.set(
                groupPosition.x,
                groupPosition.y,
                groupPosition.z + 2.5 // Distance pour voir bien le contenu
            );

            // Point de focus au centre du contenu HTML
            targetLookAt.current.copy(groupPosition);
        } else {
            // Si inactif, revenir à la vue générale
            const { camera } = controlsRef.current;
            targetPosition.current.set(0, 0, 5);
            targetLookAt.current.set(0, 0, 0);
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
        }

        // if (controlsRef.current && isLoaded && activeURL) {
        //     const { camera } = controlsRef.current;

        //     // Animation fluide de la position de la caméra
        //     easing.damp3(camera.position, targetPosition.current, 0.3, delta);

        //     // Animation fluide du point de vue
        //     easing.damp3(
        //         currentLookAt.current,
        //         targetLookAt.current,
        //         0.3,
        //         delta
        //     );
        //     // Faire regarder la caméra vers le point cible
        //     camera.lookAt(currentLookAt.current);

        //     // Si page active, ajuster le FOV pour un meilleur cadrage
        //     easing.damp(camera, 'fov', activeURL ? 40 : 50, 0.5, delta);

        //     // Mettre à jour la matrice de projection après changement de FOV
        //     camera.updateProjectionMatrix();
        // }
    });

    return (
        <group ref={groupRef}>
            <HtmlContainer className="html-container">
                <HomeContent
                    ref={pageRef}
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transform: 'translate(-50%) rotateY(180deg)',
                        transition:
                            'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        height: '500px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 0,
                    }}
                />
            </HtmlContainer>
        </group>
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
