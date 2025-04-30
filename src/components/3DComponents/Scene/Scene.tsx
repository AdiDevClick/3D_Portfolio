import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    useScroll,
    useTexture,
    CameraControls,
    ScrollControls,
    Scroll,
} from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import '../../../utils/util.tsx';
import JSONDatas from '@data/exemples.json';
import { MathUtils, Vector3 } from 'three';
import { useCarousel } from '@/hooks/reducers/useCarousel.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_CAMERA_POSITION,
} from '@/configs/3DCarousel.config.ts';
import { useLocation, useNavigate, useParams } from 'react-router';
import Carousel from '@/components/3DComponents/Carousel/Carousel.tsx';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning.tsx';
import { Home } from '@/pages/Home/Home.tsx';
import { About } from '@/pages/About/About.tsx';
import { Contact } from '@/pages/Contact/Contact.tsx';
import { Leva } from 'leva';
import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';

const initialCameraFov = 20;
let minAngle = -Infinity;
let maxAngle = Infinity;

export function Scene({ SETTINGS, size }) {
    const params = useParams();
    const navigate = useNavigate();
    const id = params['*']?.split('/')[1];

    const location = useLocation();

    const controlsRef = useRef(null!);
    const menuRef = useRef(null!);

    const [viewMode, setViewMode] = useState('home');
    const [forceMeasure, setForceMeasure] = useState(false);

    // Default camera position if no controlsRef
    const [prevCamPos, setPrevCamPos] = useState(() =>
        controlsRef.current
            ? controlsRef.current.camera.position.clone()
            : DEFAULT_CAMERA_POSITION
    );

    const cameraPositions = {
        home: {
            position: DEFAULT_CAMERA_POSITION.clone(),
            target: new Vector3(0, 0, 0),
            fov: initialCameraFov,
        },
        carousel: {
            position: prevCamPos.clone(),
            target: new Vector3(0, 0, 0),
            fov: initialCameraFov,
        },
    };

    // General Store
    const reducer = useCarousel();

    reducer.isMobile = size[0] < 768;
    reducer.isTablet = size[0] < 1024;

    const aspectRatio = size[0] / size[1];
    const vFov = (initialCameraFov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * 20; // 14 = distance caméra
    const width = height * aspectRatio;

    reducer.contentSizes = size;
    reducer.contentWidth = width;
    reducer.contentHeight = height;

    const scaleX = Math.max(0.5, size[0] / 1920);
    const scaleY = Math.max(0.5, size[1] / 1080);
    const responsiveBoundaries = {
        x: SETTINGS.x * scaleX,
        y: SETTINGS.y * scaleY,
        z: SETTINGS.z,
    };

    // Hook for camera positioning on hovered/clicked card
    const { positionCameraToCard } = useCameraPositioning();

    // const compensationRatio = size[0] / size[1];
    // document.documentElement.style.setProperty(
    //     '--compensation-scale',
    //     compensationRatio
    // );

    /**
     * Detect route change -
     * @description : Sets the camera position on route change
     */
    useEffect(() => {
        if (
            location.pathname === '/' ||
            location.pathname.includes('a-propos') ||
            location.pathname.includes('contact')
        ) {
            setViewMode('home');
        } else if (
            location.pathname.includes('projets') &&
            !id &&
            !reducer.activeContent
        ) {
            setViewMode('carousel');
        } else if (id || reducer.activeContent) {
            setViewMode('card-detail');
            // } else if (location.pathname.includes('a-propos')) {
            //     setViewMode('about');
        }
    }, [location, id, reducer.activeContent, viewMode]);

    /**
     * Camera positioning -
     * @description : Camera is positionned on the active page or content
     */
    useEffect(() => {
        if (!controlsRef.current) return;

        const { camera } = controlsRef.current;

        switch (viewMode) {
            case 'home':
                camera.fov = cameraPositions.home.fov;
                controlsRef.current.setLookAt(
                    cameraPositions.home.position.x,
                    cameraPositions.home.position.y,
                    cameraPositions.home.position.z,
                    cameraPositions.home.target.x,
                    cameraPositions.home.target.y,
                    cameraPositions.home.target.z,
                    true
                );
                camera.updateProjectionMatrix();
                break;

            case 'carousel':
                camera.fov = cameraPositions.carousel.fov;
                controlsRef.current.setLookAt(
                    cameraPositions.carousel.position.x,
                    cameraPositions.carousel.position.y,
                    cameraPositions.carousel.position.z,
                    cameraPositions.carousel.target.x,
                    cameraPositions.carousel.target.y,
                    cameraPositions.carousel.target.z,
                    true
                );
                camera.updateProjectionMatrix();
                break;

            case 'card-detail':
                if (reducer.activeContent) {
                    setPrevCamPos(camera.position.clone());
                    const { isClicked } = reducer.activeContent;

                    positionCameraToCard(
                        controlsRef,
                        reducer.activeContent,
                        reducer.isMobile,
                        isClicked
                    );
                    camera.updateProjectionMatrix();
                }
                break;
        }
    }, [viewMode, reducer.activeContent]);

    /**
     * Camera positioning on URL loading -
     * @description : Camera is positionned on the active card
     * if the URLparams contains a card ID -
     */
    useEffect(() => {
        if (
            // !menuRef.current ||
            !controlsRef.current ||
            !params['*']?.includes('projets') ||
            !id ||
            reducer.activeContent
        ) {
            return;
        }
        const initialDelay = 500;

        // !! IMPORTANT !! Sets the camera to the carousel position
        // before activating the card to fix a camera bug
        setViewMode('carousel');

        const activateCardByURL = () => {
            // Card exists ?
            const targetCard = reducer.showElements.find(
                (element) => element.id === id
            );

            if (targetCard) {
                // !! IMPORTANT !! Activate card to focus
                reducer.activateElement(targetCard, true);
                // Camera turns to the active card
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

                    // Opening card animation
                    setTimeout(() => {
                        // Expand the card
                        reducer.clickElement(targetCard);

                        setTimeout(() => {
                            camera.fov = reducer.isMobile ? 19 : 20;
                            camera.updateProjectionMatrix();
                        }, 300);
                    }, 600);
                }, 300);
            } else {
                // Retry
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

        // init animations
        const timer = setTimeout(activateCardByURL, initialDelay);

        return () => clearTimeout(timer);
    }, [reducer.showElements, viewMode]);

    /**
     * Disable scrolling on the page -
     * @description : Only when the card is clicked
     */
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (reducer.activeContent?.isClicked) {
                e.preventDefault();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [reducer.activeContent]);

    return (
        // <div
        //     id="canvas-container"
        //     style={{ height: '100%', minHeight: 'min-content' }}
        // >
        <>
            <Leva hidden={true} />

            <Canvas
                // frameloop="demand"
                // style={{ position: 'relative', height: '90vh', width: '100%' }}
                style={{ position: 'relative', height: '100%', width: '100%' }}
                id="canva"
                camera={{ position: [0, 0, -14], fov: 50 }}
                // camera={{ position: [0, 0, -20], fov: 20 }}
                // dpr={[1, 1]}
                dpr={window.devicePixelRatio}
                // onScroll={(e) => e.stopPropagation()}
                // onWheel={onScrollHandler}
                // camera={{ position: [0, 0, 5], fov: 70 }}
            >
                <color attach="background" args={['#191920']} />
                {/* <fog attach="fog" args={['#a79', 8.5, 12]} /> */}
                {/* <fog attach="fog" args={['black', 8.5, 12]} /> */}

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
                    mouseButtons={{
                        // Activate left click for rotation
                        left: 1,
                        middle: 0,
                        right: 0,
                        // !! IMPORTANT !! DISABLE SCROLL WHEEL for camera
                        // to activate the scroll on the page
                        wheel: 0,
                    }}
                    touches={{
                        // Allows 1 finger touch for rotation
                        one: 1,
                        two: 0,
                        three: 0,
                    }}
                    onStart={(e) =>
                        onControlStart(e, reducer.activeContent?.isClicked)
                    }
                />
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
                {/* <group ref={homeRef}> */}
                <ScrollControls pages={1.3} distance={0.3} damping={0.5}>
                    {/* <ScrollControls pages={1.15} distance={0.3} damping={0.5}> */}
                    <Scroll>
                        <Home />
                        <About reducer={reducer} />
                        {/* <Contact /> */}
                    </Scroll>
                    {/* <Scroll html>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'white',
                        }}
                    >
                        ↓ Scroll pour explorer
                    </div>
                </Scroll> */}
                </ScrollControls>

                {/* <div
                        style={{
                            position: 'absolute',
                            transform: 'translate(-50%) rotateY(180deg)',
                            top: '10px',
                            right: '10px',
                            color: 'white',
                            height: '100vh',
                            width: '200vw',
                            background: 'rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        Navigation fixe HTML
                    </div> */}
                {/* </group> */}
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

                {/* <fog attach="fog" args={['#a79', 8.5, 12]} /> */}
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
                {/* <group ref={menuRef}> */}
                <Carousel
                    reducer={reducer}
                    boundaries={responsiveBoundaries}
                    datas={JSONDatas}
                    SETTINGS={SETTINGS}
                    // isActive={isCarouselActive}
                    // updateFrequency={isCarouselActive ? 1 : 100}
                />
                {/* </group> */}
                {/* </Rig> */}

                {/* {children} */}
                {/* </SceneContext.Provider> */}
                {/* <Banner position={[0, -0.15, 0]} /> */}
                <Environment preset="dawn" background blur={0.5} />
                {/* <ambientLight />
            <Experience /> */}
            </Canvas>
        </>

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
