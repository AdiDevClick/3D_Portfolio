import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    useScroll,
    useTexture,
    CameraControls,
} from '@react-three/drei';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import '../../../utils/util.tsx';
import JSONDatas from '@data/exemples.json';
import useResize from '../../../hooks/useResize.tsx';
import { Box3, MathUtils, Vector3 } from 'three';
import { useCarousel } from '@/hooks/reducers/useCarousel.tsx';
import { useSettings } from '@/hooks/useSettings.tsx';
import { DEFAULT_CAMERA_POSITION } from '@/configs/3DCarousel.config.ts';
import { useLocation, useNavigate, useParams } from 'react-router';
import Carousel from '@/components/3DComponents/Carousel/Carousel.tsx';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning.tsx';
// import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';

const initialCameraFov = 20;
let minAngle = -Infinity;
let maxAngle = Infinity;

// export function Scene({ children }) {
export function Scene() {
    const params = useParams();
    const navigate = useNavigate();
    const id = params['*']?.split('/')[1];

    const location = useLocation();
    const isCarouselActive = location.pathname.includes('projets');

    const controlsRef = useRef(null!);
    const menuRef = useRef(null!);
    const initialCameraConfig = useRef({
        position: new Vector3(0, 0, -20),
        fov: 20,
    });

    // Default camera position if no controlsRef
    const [prevCamPos, setPrevCamPos] = useState(() =>
        controlsRef.current
            ? controlsRef.current.camera.position.clone()
            : DEFAULT_CAMERA_POSITION
    );

    // Partager l'état "isActive" avec tous les composants enfants
    const sceneContext = useMemo(
        () => ({
            isActive: isCarouselActive,
            // ...autres propriétés de contexte
        }),
        [isCarouselActive]
    );

    // General Store
    const reducer = useCarousel();

    // Boundaries Settings
    const SETTINGS = useSettings(JSONDatas);

    // Specify boundaries & responsive boundaries
    const { size } = useResize(100);
    reducer.isMobile = size[0] < 768;
    const isMobile = size[0] < 768;

    const scaleX = Math.max(0.5, size[0] / 1920);
    const scaleY = Math.max(0.5, size[1] / 1080);
    const responsiveBoundaries = {
        x: SETTINGS.x * scaleX,
        y: SETTINGS.y * scaleY,
        z: SETTINGS.z,
    };

    // Hook for camera positioning
    const { positionCameraToCard } = useCameraPositioning();

    const compensationRatio = size[0] / size[1];
    document.documentElement.style.setProperty(
        '--compensation-scale',
        compensationRatio
    );

    useEffect(() => {
        if (controlsRef.current) {
            const { camera } = controlsRef.current;
            camera.updateProjectionMatrix();
            reducer.contentSizes = size;

            if (reducer.activeContent) {
                setPrevCamPos(camera.position.clone());
                const { isClicked, isActive } = reducer.activeContent;

                if (isActive || isClicked) {
                    positionCameraToCard(
                        controlsRef,
                        reducer.activeContent,
                        reducer.isMobile,
                        isClicked
                    );
                }
            } else {
                // minAngle = -Infinity;
                // maxAngle = Infinity;
                camera.fov = initialCameraFov;
                controlsRef.current.setLookAt(
                    prevCamPos.x,
                    prevCamPos.y,
                    prevCamPos.z,
                    0,
                    0,
                    0,
                    true // Option d'animation
                );
                camera.updateProjectionMatrix();
                // if (
                //     location.pathname === '/projets/' + card.id &&
                //     reducer.activeContent?.id === undefined &&
                //     !card.isClicked
                // ) {
                //     console.log('jactive mon contenu');
                //     reducer.activateElement(card, true);
                // }
                // if (params['*']?.includes('projets') && id) {
                //     JSONDatas.forEach((element) => {
                //         if (element.id === id) {
                //             console.log('jactive mon contenu:', element);
                //             reducer.activateElement({ id: element.id }, true);
                //         }
                //     });
                // }
                // JSONDatas.forEach((element) => {
                //     if (element.id === id) {
                //         reducer.activateElement(element, true);
                //     }
                // });
            }
        }
    }, [reducer.activeContent, size]);
    // useLayoutEffect(() => {
    //     if (id === 'projets' && projectsRef.current) {
    //         console.log('object');

    //         // const delta = useThree((state) => state.clock.getDelta());
    //         // console.log(delta);
    //         // easing.damp3(
    //         //     projectsRef.current.position,
    //         //     [-100, -100, 0],
    //         //     0.2,
    //         //     delta
    //         // );
    //     }
    // }, [projectsRef.current]);
    // useEffect(() => {
    //     if (
    //         !menuRef.current ||
    //         !controlsRef.current ||
    //         !params['*']?.includes('projets') ||
    //         !id ||
    //         reducer.activeContent
    //     ) {
    //         return;
    //     }
    //     // Si on a un ID dans l'URL mais pas de carte active
    //     if (params['*']?.includes('projets') && id && !reducer.activeContent) {
    //         console.log("Tentative d'activation par URL, id:", id);

    //         // Parcourir les éléments du reducer (plutôt que JSONDatas)
    //         const targetCard = reducer.showElements.find(
    //             (element) => element.id === id
    //         );

    //         if (targetCard) {
    //             console.log('Carte trouvée, activation:', targetCard);

    //             // D'abord activer
    //             setTimeout(() => {
    //                 reducer.activateElement(targetCard, true);
    //             }, 100);
    //             // Puis marquer comme cliquée pour déclencher l'animation complète
    //             setTimeout(() => {
    //                 reducer.clickElement(targetCard);
    //             }, 100); // Petit délai pour laisser le temps au state de se mettre à jour
    //         } else {
    //             // console.warn('Carte non trouvée dans reducer:', id);
    //             // // Si la carte n'est pas encore chargée dans le reducer
    //             // // Chercher dans les données brutes
    //             // const dataCard = JSONDatas.find((element) => element.id === id);
    //             // if (dataCard) {
    //             //     console.log(
    //             //         'Carte trouvée dans les données brutes, attente du chargement...'
    //             //     );
    //             //     // Attendez que les cartes soient chargées puis réessayez
    //             //     const checkInterval = setInterval(() => {
    //             //         const targetCard = reducer.showElements.find(
    //             //             (element) => element.id === id
    //             //         );
    //             //         if (targetCard) {
    //             //             clearInterval(checkInterval);
    //             //             reducer.activateElement(targetCard, true);
    //             //             setTimeout(
    //             //                 () => reducer.clickElement(targetCard),
    //             //                 100
    //             //             );
    //             //         }
    //             //     }, 300);
    //             //     // Nettoyage
    //             //     setTimeout(() => clearInterval(checkInterval), 5000);
    //             // } else {
    //             //     // Carte invalide, redirection
    //             //     navigate('/projets', { replace: true });
    //             // }
    //             console.log('else: ', reducer.activeContent);
    //         }
    //     }
    // }, [
    //     menuRef.current,
    //     controlsRef.current,
    //     id,
    //     reducer.activeContent,
    //     reducer.showElements.length,
    // ]);

    useEffect(() => {
        // Permettre au système de se stabiliser avant de tenter une activation
        const initialDelay = 500;

        const activateCardByURL = () => {
            if (
                !menuRef.current ||
                !controlsRef.current ||
                !params['*']?.includes('projets') ||
                !id ||
                reducer.activeContent
            ) {
                return;
            }

            // Card exists ?
            const targetCard = reducer.showElements.find(
                (element) => element.id === id
            );

            if (targetCard) {
                // 1. D'abord activer la carte (pour la mettre en avant)
                reducer.activateElement(targetCard, true);

                // 2. Mettre à jour la position de la caméra manuellement après activation
                setTimeout(() => {
                    if (!targetCard.ref?.current) {
                        // Retry
                        return activateCardByURL();
                    }

                    // Forcer une mise à jour de la position de caméra
                    const { camera } = controlsRef.current;

                    positionCameraToCard(
                        controlsRef,
                        targetCard,
                        reducer.isMobile,
                        false, // Pas encore marqué comme cliqué
                        1.0 // Facteur d'interpolation plus direct
                    );

                    // 4. Marquer comme cliquée APRÈS que la caméra ait commencé à bouger
                    setTimeout(() => {
                        reducer.clickElement(targetCard);

                        // 5. Ajustement final après le clic si nécessaire
                        setTimeout(() => {
                            // Réajuster si nécessaire après que tout soit stable
                            camera.fov = reducer.isMobile ? 19 : 20;
                            camera.updateProjectionMatrix();
                        }, 300);
                    }, 600); // Délai suffisant pour que l'animation de caméra ait commencé
                }, 300); // Délai pour laisser activateElement prendre effet
            } else {
                // Attendre que les éléments soient chargés puis réessayer
                if (reducer.showElements.length > 0) {
                    console.warn(
                        'Carte non trouvée dans reducer malgré des éléments présents:',
                        id
                    );

                    // Si nous avons déjà des cartes mais pas celle demandée, rediriger
                    setTimeout(() => {
                        if (
                            !reducer.showElements.find(
                                (element) => element.id === id
                            )
                        ) {
                            navigate('/projets', { replace: true });
                        }
                    }, 1000);
                } else {
                    console.log(
                        'Attente du chargement des cartes avant de réessayer...'
                    );
                    setTimeout(activateCardByURL, 300);
                }
            }
        };

        // Lancer l'activation après un délai initial
        const timer = setTimeout(activateCardByURL, initialDelay);

        return () => clearTimeout(timer);
    }, [id, reducer]);
    return (
        // <div
        //     id="canvas-container"
        //     style={{ height: '100%', minHeight: 'min-content' }}
        // >
        <Canvas
            // frameloop="demand"
            style={{ position: 'relative', height: '100%', width: '100%' }}
            id="canva"
            camera={{ position: [0, 0, -14], fov: 50 }}
            // camera={{ position: [0, 0, -20], fov: 20 }}
            // dpr={[1, 1]}
            dpr={window.devicePixelRatio}
            // camera={{ position: [0, 0, 5], fov: 70 }}
        >
            {/* <Perf minimal={true} antialias={false} position={'bottom-left'} /> */}
            {/* <HtmlContainer className="html-container" position={[0, 0, 0]}>
                <aside
                    style={{
                        transform: 'translate(-50%)',
                        height: '500px',
                        width: '600px',
                        background: 'rgba(255, 255, 255, 0.95)',
                    }}
                    // className="lateral-menu"
                ></aside>
            </HtmlContainer> */}
            {/* <Html
                ref={menuRef}
                // style={{ position: 'relative', height: '100%', width: '100%' }}
                // fullscreen
                transform
                // anchorX={0}

                // portal={document.body}
                // position={
                //     reducer.isMobile ? [0, -1.5, 0] : [-width - 0.1, 0, 0]
                // }
            >
                <aside
                    style={{
                        position: 'relative',
                        display: 'block',
                        top: 0,
                        height: '650px',
                        width: '500px',
                        background: 'rgba(255, 255, 255, 0.95)',
                    }}
                    className="lateral-menu"
                ></aside>
            </Html> */}

            <color attach="background" args={['#191920']} />
            <CameraControls
                // makeDefault
                // no Y-axis
                polarRotateSpeed={0}
                // no zoom
                dollySpeed={0}
                // Max angle on active is given by the camera
                maxAzimuthAngle={maxAngle}
                // Min angle on active is given by the camera
                minAzimuthAngle={minAngle}
                ref={controlsRef}
                onStart={(e) =>
                    onControlStart(e, reducer.activeContent?.isClicked)
                }
            />

            {/* <fog attach="fog" args={['#a79', 8.5, 12]} /> */}
            {/* <ScrollControls pages={4} infinite> */}
            {/* </group> 
            // ref={projectsRef}
            // position={
            //     id === 'projets'
            //         ? easing.damp3(
            //               projectsRef?.current?.position,
            //               ACTIVE_PROJECTS_POSITION,
            //               0.2,
            //               0.1
            //           )
            //         : easing.damp3(
            //               projectsRef?.current?.position,
            //               DEFAULT_PROJECTS_POSITION,
            //               0.2,
            //               0.1
            //           )
            // }
            // position={ACTIVE_PROJECTS_POSITION}
            // position={
            //     id === 'projets'
            //         ? ACTIVE_PROJECTS_POSITION
            //         : DEFAULT_PROJECTS_POSITION
            // }
            >
                {/* <Banner position={[0, -0.15, 0]} /> */}

            {/* <Rig> */}
            {/* <Rig rotation={[0, 0, 0.15]}> */}

            {/* </Rig> */}

            {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={80}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                    />
                </mesh> */}
            {/* </group> */}
            {/* <SceneContext.Provider value={sceneContext}> */}
            <group ref={menuRef}>
                <Carousel
                    reducer={reducer}
                    boundaries={responsiveBoundaries}
                    datas={JSONDatas}
                    SETTINGS={SETTINGS}
                    isActive={isCarouselActive}
                    updateFrequency={isCarouselActive ? 1 : 100}
                />
            </group>

            {/* {children} */}
            {/* </SceneContext.Provider> */}
            {/* <Banner position={[0, -0.15, 0]} /> */}
            {/* </ScrollControls> */}
            <Environment preset="dawn" background blur={0.5} />
            {/* <ambientLight />
            <Experience /> */}
        </Canvas>
        // </div>
    );
}

/**
 * Gère la rotation max de la caméra -
 * @param e
 * @param active
 */
function onControlStart(e, active) {
    // e.target.azimuthAngle = 0;

    e.azimuthAngleLimits = [MathUtils.degToRad(-30), MathUtils.degToRad(30)];
    if (active) {
        // e.target.minAzimuthAngle = minAngle;
        // e.target.maxAzimuthAngle = maxAngle;
        // e.target.maxSpeed = 0.1;
        // e.target.minAzimuthAngle = -Math.PI / 8;
        // e.target.maxAzimuthAngle = Math.PI / 8;
    } else {
        // e.target.maxAzimuthAngle = Infinity;
        // e.target.minAzimuthAngle = -Infinity;
        // e.target.maxSpeed = Infinity;
        // e.target.azimuthRotateSpeed = 0.5;
    }
    // e.target.camera.updateProjectionMatrix();
    console.log(e.target);

    // maxAngle = cardAngles.active + Math.PI / 8;
    // minAngle = cardAngles.active - Math.PI / 8;
}

function Rig(props) {
    const ref = useRef(null);
    const scroll = useScroll();
    useFrame((state, delta) => {
        // ref.current.lookAt(1, 0, -1); // Look at center

        ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
        state.events.update(); // Raycasts every frame rather than on pointer-move
        // Move camera
        // easing.damp3(
        //     state.camera.position,
        //     [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
        //     0.3,
        //     delta
        // );
        // state.camera.lookAt(0, 0, 0); // Look at center
    });
    return <group ref={ref} {...props} />;
}

{
    /* {hovered && (
                <MotionPathControls
                    ref={motionPathRef}
                    object={ref}
                    curves={[
                        new THREE.CubicBezierCurve3(
                            new THREE.Vector3(-5, -5, 0),
                            new THREE.Vector3(-10, 0, 0),
                            new THREE.Vector3(0, 3, 0),
                            new THREE.Vector3(6, 3, 0)
                        ),
                        new THREE.CubicBezierCurve3(
                            new THREE.Vector3(6, 3, 0),
                            new THREE.Vector3(10, 5, 5),
                            new THREE.Vector3(5, 3, 5),
                            new THREE.Vector3(5, 5, 5)
                        ),
                    ]}
                />
            )} */
}

function Banner(props) {
    const ref = useRef();
    const texture = useTexture('../images/work_.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const scroll = useScroll();
    useFrame((state, delta) => {
        ref.current.material.time.value += Math.abs(scroll.delta) * 4;
        ref.current.material.map.offset.x += delta / 2;
    });
    return (
        <mesh ref={ref} {...props}>
            <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
            <meshSineMaterial
                map={texture}
                map-anisotropy={16}
                map-repeat={[30, 1]}
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}
