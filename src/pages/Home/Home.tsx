import { CardMainTitle } from '@/components/3DComponents/Cards/CardMainTitle.tsx';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_CAMERA_POSITION,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning.tsx';
import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';
import { useMutationObserver } from '@/hooks/useMutationObserver.tsx';
import { Billboard } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
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

    const { camera } = useThree();
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeURL, setActiveURL] = useState(false);
    const [forceMeasure, setForceMeasure] = useState(false);
    const cameraPositionRef = useRef<Vector3>(null);
    const initialCameraStateRef = useRef({
        position: null,
        target: new Vector3(),
        fov: 0,
        near: 0,
        far: 0,
    });

    const initialDistanceRef = useRef(null);

    const targetPosition = useRef(new Vector3());
    const targetLookAt = useRef(new Vector3());
    const currentLookAt = useRef(new Vector3(0, 0, 0));

    const { positionCameraToCard } = useCameraPositioning();
    const { lookAtSmooth, isCompleted } = useLookAtSmooth();
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

        // if (!initialDistanceRef.current && groupRef.current) {
        //     initialDistanceRef.current = camera.position.distanceTo(
        //         groupRef.current.position
        //     );
        //     cameraPositionRef.current = camera.position.clone();
        //     console.log(
        //         'position initiale sauvegardée:',
        //         cameraPositionRef.current
        //     );
        // }
    }, [pageRef.current, location]);

    /**
     * Positioning camera to the page on load
     */
    // useEffect(() => {
    //     if (
    //         !groupRef.current ||
    //         !isLoaded ||
    //         !pageRef.current ||
    //         !cameraPositionRef.current
    //     )
    //         return;
    //     // pageRef.current.parentElement
    //     // .getAttribute('style')
    //     // .includes('--data-custom-scale')
    //     if (activeURL) {
    //         // if (camera.position !== cameraPositionRef.current) {
    //         // if (cameraPositionRef.current) {
    //         // camera.position.copy(cameraPositionRef.current);
    //         // groupRef.current.position.set(0, 0, 0);
    //         // IMPORTANT: Augmenter le seuil pour tester
    //         // lookAtSmooth(groupRef.current.position);
    //         // 2. Créer un timer pour vérifier régulièrement si lookAtSmooth est terminé
    //         // const checkCompletion = setInterval(() => {
    //         //     if (isCompleted) {
    //         //         clearInterval(checkCompletion);
    //         //         // 3. Une fois lookAtSmooth terminé, ajuster la distance
    //         //         console.log(
    //         //             'LookAtSmooth terminé, ajustement de la distance...'
    //         //         );
    //         //         // 4. Calculer la distance actuelle
    //         //         const currentDistance = camera.position.distanceTo(
    //         //             groupRef.current.position
    //         //         );
    //         //         // 5. Calculer la position idéale en préservant la direction actuelle
    //         //         if (
    //         //             Math.abs(currentDistance - initialDistanceRef.current) >
    //         //             0.3
    //         //         ) {
    //         //             console.log(
    //         //                 'Ajustement distance:',
    //         //                 currentDistance,
    //         //                 '→',
    //         //                 initialDistanceRef.current
    //         //             );
    //         //             // Récupérer la direction actuelle (après lookAtSmooth)
    //         //             const direction = new Vector3()
    //         //                 .subVectors(
    //         //                     camera.position,
    //         //                     groupRef.current.position
    //         //                 )
    //         //                 .normalize();
    //         //             // Position idéale : partir du groupe et reculer dans la direction opposée
    //         //             const idealCamPos = groupRef.current.position
    //         //                 .clone()
    //         //                 .add(
    //         //                     direction.multiplyScalar(
    //         //                         initialDistanceRef.current
    //         //                     )
    //         //                 );
    //         //             // Appliquer avec un léger décalage Y si nécessaire
    //         //             controlsRef.current.setLookAt(
    //         //                 idealCamPos.x,
    //         //                 idealCamPos.y - 3, // Ajustement vertical si nécessaire
    //         //                 idealCamPos.z,
    //         //                 groupRef.current.position.x,
    //         //                 groupRef.current.position.y,
    //         //                 groupRef.current.position.z,
    //         //                 true // Animation fluide
    //         //             );
    //         //         }
    //         //     }
    //         // }, 100); // Vérifier toutes les 100ms
    //         // // Nettoyer le timer si le composant est démonté
    //         // return () => clearInterval(checkCompletion);
    //         // camera.updateProjectionMatrix();
    //         // }
    //         // Restaurer le FOV et les plans near/far
    //         // camera.fov = initialCameraStateRef.current.fov;
    //         // camera.near = initialCameraStateRef.current.near;
    //         // camera.far = initialCameraStateRef.current.far;
    //         // console.log('force measure :', forceMeasure);
    //         // console.log('group position :', groupRef.current.position);
    //         // groupRef.current.position.copy(ACTIVE_PROJECTS_POSITION_SETTINGS);
    //         // // camera.position.copy(cameraPositionRef.current);
    //         // camera.position.copy(initialCameraStateRef.current.position);
    //         // camera.lookAt(groupRef.current.position);
    //         // console.log(
    //         //     'camera position :',
    //         //     camera.position.distanceTo(groupRef.current.position)
    //         // );
    //         // setForceMeasure(true);
    //         // groupRef.current.position.set(
    //         //     DEFAULT_PROJECTS_POSITION_SETTINGS.x,
    //         //     DEFAULT_PROJECTS_POSITION_SETTINGS.y,
    //         //     DEFAULT_PROJECTS_POSITION_SETTINGS.z
    //         // );
    //         // setTimeout(() => {
    //         //     setForceMeasure(true);
    //         //     setTimeout(() => setForceMeasure(false), 100);
    //         // }, 100);
    //         // } console.log('je suis trop loin de lobjet');
    //         // Forcer une position à 10 unités devant le groupe
    //         // const forcedPos = groupRef.current.position.clone();
    //         // forcedPos.z -= 10; // Éloigner la caméra sur l'axe Z
    //         // camera.position.copy(forcedPos);
    //         // camera.lookAt(groupRef.current.position);
    //     }
    // }, [activeURL, isLoaded, isCompleted]);

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
    });

    return (
        <Billboard
            ref={groupRef}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
        >
            <HtmlContainer
                key={'home'}
                className="html-container"
                forceMeasure={forceMeasure}
            >
                <HomeContent
                    ref={pageRef}
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transform: 'translate(-50%)',
                        transition:
                            'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        height: '500px',
                        width: 'clamp(min(52%, 100%), 100%, 52vw)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 0,
                    }}
                />
            </HtmlContainer>
        </Billboard>
    );

    // </group>
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
