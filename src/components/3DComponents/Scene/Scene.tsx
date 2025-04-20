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
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import { Home } from '@/pages/Home/Home.tsx';
// import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';

const initialCameraFov = 20;
let minAngle = -Infinity;
let maxAngle = Infinity;

// export function Scene({ children }) {
export function Scene({ SETTINGS, size }) {
    const params = useParams();
    const navigate = useNavigate();
    const id = params['*']?.split('/')[1];

    const location = useLocation();
    // const isCarouselActive = location.pathname.includes('projets');

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
    // const sceneContext = useMemo(
    //     () => ({
    //         isActive: isCarouselActive,
    //         // ...autres propriétés de contexte
    //     }),
    //     [isCarouselActive]
    // );

    // General Store
    const reducer = useCarousel();

    // Boundaries Settings
    // const SETTINGS = useSettings(JSONDatas);

    // Specify boundaries & responsive boundaries
    // const { size } = useResize(100);
    reducer.isMobile = size[0] < 768;
    reducer.isTablet = size[0] < 1024;
    // const isMobile = size[0] < 768;

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

    /**
     * Camera positioning -
     * @description : Camera is positionned on the active card
     */
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
            }
        }
    }, [reducer.activeContent, size]);

    /**
     * Camera positioning on URL loading -
     * @description : Camera is positionned on the active card
     * if the URL contains a card ID -
     */
    useEffect(() => {
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
                // !! IMPORTANT !! Activate card to focus
                reducer.activateElement(targetCard, true);
                setTimeout(() => {
                    if (!targetCard.ref?.current) {
                        // Retry
                        return activateCardByURL();
                    }

                    const { camera } = controlsRef.current;
                    // Force camera position
                    positionCameraToCard(
                        controlsRef,
                        targetCard,
                        reducer.isMobile,
                        false,
                        1.0
                    );

                    setTimeout(() => {
                        // Expand the card
                        reducer.clickElement(targetCard);

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
    }, [reducer.showElements]);

    // console.log('je crer la Scene');
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
            {/* <HtmlContainer
                reducer={reducer}
                // position={[0, 0, 0]}
                className="html-container"
            >
                <div
                    style={{
                        transform: 'translate(-50%) rotateY(180deg)',
                        height: '500px',
                        width: '600px',
                        background: 'rgba(255, 255, 255, 0.95)',
                    }}
                    // className="lateral-menu"
                >
                    <h1 style={{ color: 'black' }}>Accueil</h1>
                    <p style={{ color: 'black' }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quisquam, voluptatibus. Lorem ipsum dolor sit amet{' '}
                    </p>
                </div>
            </HtmlContainer> */}
            <Home controlsRef={controlsRef} reducer={reducer} />
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
                    // isActive={isCarouselActive}
                    // updateFrequency={isCarouselActive ? 1 : 100}
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
