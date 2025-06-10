import { loadCardByURL } from '@/components/3DComponents/Experience/ExperienceFunctions';
import { ExperienceProps } from '@/components/3DComponents/Experience/ExperienceTypes';
import { DEFAULT_CAMERA_POSITION } from '@/configs/3DCarousel.config';
import { CAMERA_FOV_DESKTOP, CAMERA_FOV_MOBILE } from '@/configs/Camera.config';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning';
import { cameraLookAt } from '@/utils/cameraLooktAt';
import { CameraControls, Environment } from '@react-three/drei';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';
import { easing } from 'maath';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Box3, Vector3 } from 'three';
// import {
//     Bloom,
//     ChromaticAberration,
//     EffectComposer,
//     Noise,
//     Vignette,
//     BrightnessContrast,
//     SSAO,
//     ToneMapping,
// } from '@react-three/postprocessing';

let minAngle = -Infinity;
let maxAngle = Infinity;
const initialCameraFov = 20;

let cameraResults;

const cameraPositions = {
    home: {
        position: DEFAULT_CAMERA_POSITION.clone(),
        target: new Vector3(0, 0, 0),
        fov: initialCameraFov,
    },
    carousel: {
        position: DEFAULT_CAMERA_POSITION.clone(),
        target: new Vector3(0, 0, 0),
        fov: initialCameraFov,
    },
};

export function Experience({ reducer }: ExperienceProps) {
    const {
        activeContent,
        isMobile,
        showElements,
        setViewMode,
        activateElement,
        clickElement,
        contentHeight,
        visible,
    } = reducer;
    const ref = useRef<CameraControls>(null!);
    const prevCamPosRef = useRef(DEFAULT_CAMERA_POSITION.clone());

    const [isURLLoaded, setIsURLLoaded] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { positionCameraToCard } = useCameraPositioning();

    /**
     * Camera positioning -
     * @description : Camera is positionned on the active page or content
     */
    useEffect(() => {
        if (!ref.current) return;
        const { camera } = ref.current;

        // camera.layers.enable(0); // Scene normale
        // camera.layers.enable(2); // Carousel layer

        cameraPositions.carousel.fov = isMobile
            ? CAMERA_FOV_MOBILE
            : CAMERA_FOV_DESKTOP;
        cameraPositions.home.fov = isMobile
            ? CAMERA_FOV_MOBILE
            : CAMERA_FOV_DESKTOP;

        // Resets the max camera angles to infinity
        ref.current.minAzimuthAngle = minAngle;
        ref.current.maxAzimuthAngle = maxAngle;
        // const cameraPosOnRoute = async () => {
        switch (visible) {
            case 'home':
            // cameraLookAt(
            //     new Vector3(0, 0, -200),
            //     cameraPositions.home,
            //     ref.current
            // );
            // setTimeout(() => {
            //     const timer = cameraLookAt(
            //         cameraPositions.home.position,
            //         cameraPositions.home,
            //         ref.current
            //     );

            //     return () => {
            //         clearTimeout(timer);
            //     };
            // }, 1000);
            // break;
            case 'about':
            // cameraLookAt(
            //     new Vector3(0, 0, -200),
            //     cameraPositions.home,
            //     ref.current
            // );
            case 'contact':
            case 'error':
                cameraLookAt(
                    cameraPositions.home.position,
                    cameraPositions.home,
                    ref.current
                );
                break;

            case 'carousel':
                cameraLookAt(
                    prevCamPosRef.current.y < 0
                        ? cameraPositions.carousel.position
                        : prevCamPosRef.current,
                    cameraPositions.carousel,
                    ref.current
                );

                break;

            case 'card-opened':
            case 'card-detail':
            case 'URLRequested':
                if (activeContent) {
                    prevCamPosRef.current = camera.position.clone();
                    const results = positionCameraToCard(
                        ref,
                        { ...activeContent, viewportHeight: contentHeight },
                        isMobile,
                        activeContent.isClicked
                    );

                    cameraResults = results;
                    // Set the max camera angles to the active card
                    // Forbids the user to rotate the camera more than the angle limit !
                    if (activeContent.isClicked && results?.angleLimits) {
                        // !! IMPORTANT FOR CLICKED CARD !! - Forces the camera to rotate without
                        // animation to avoid a clipping bug when the camera is not in its right position
                        ref.current.rotateTo(
                            results.angleLimits.default ?? 0,
                            ref.current.polarAngle,
                            false
                        );
                        ref.current.minAzimuthAngle = results.angleLimits.min;
                        ref.current.maxAzimuthAngle = results.angleLimits.max;

                        if (isMobile && results.truckLimits) {
                            const boundary = new Box3(
                                new Vector3(
                                    results.truckLimits.minX,
                                    results.truckLimits.minY,
                                    results.truckLimits.minZ
                                ),
                                new Vector3(
                                    results.truckLimits.maxX,
                                    results.truckLimits.maxY,
                                    results.truckLimits.maxZ
                                )
                            );

                            ref.current.setBoundary(boundary);
                            // ref.current.truckSpeed = 3;
                        }
                    }
                    break;
                }
                if (!activeContent) {
                    // useEffect Camera positioning on URL loading will take effect
                }
                break;
            default:
                cameraLookAt(
                    new Vector3(0, 0, -200),
                    cameraPositions.home,
                    ref.current
                );
                break;
        }
        // };
        // cameraPosOnRoute();
    }, [visible, activeContent, isMobile]);

    /**
     * Detect route change -
     * @description : This will automatically
     * set the camera's position on route change
     */
    useEffect(() => {
        if (location.pathname === '/') {
            if (visible !== 'home') setViewMode('home');
        } else if (location.pathname.includes('projets')) {
            if (activeContent) {
                // if (params.id && activeContent.isClicked) {
                if (visible !== 'card-detail') setViewMode('card-detail');
                // }
                // if (params.id && activeContent.isActive) {
                //     activeContent.isActive = false;
                // }
                // if (
                //     !params.id &&
                //     activeContent.isActive &&
                //     !activeContent.isClicked
                // ) {
                // if (visible !== 'card-detail') setViewMode('card-detail');
                // }
            }

            if (!activeContent) {
                if (
                    params.id &&
                    visible === 'carousel' &&
                    showElements.length > 0
                ) {
                    setViewMode('URLRequested');
                }
                if (visible !== 'carousel' && visible !== 'URLRequested') {
                    setViewMode('carousel');
                }
            }
        } else if (location.pathname.includes('a-propos')) {
            if (visible !== 'about') setViewMode('about');
        } else if (location.pathname.includes('contact')) {
            if (visible !== 'contact') setViewMode('contact');
        } else {
            if (visible !== 'error') setViewMode('error');
        }
    }, [location.pathname, params.id, activeContent]);

    /**
     * Camera positioning on URL loading -
     * @description : Camera is positionned on the active card
     * if the URLparams contains a card ID -
     */
    useEffect(() => {
        if (
            !ref.current ||
            !params.id ||
            activeContent ||
            // isURLLoaded ||
            visible !== 'URLRequested'
        ) {
            return;
        }
        const options = {
            id: params.id,
            showElements,
            activateElement,
            clickElement,
            setViewMode,
            navigate,
            setIsURLLoaded,
            visible,
        };
        const initialDelay = 600;

        // Awaits the initialization of the elements (initialDelay)
        // And then activate the card
        const timer = setTimeout(() => {
            loadCardByURL(5, initialDelay, options);
        }, initialDelay);
        return () => clearTimeout(timer);
    }, [showElements, visible]);

    // useEffect(() => {
    //     if (ref.current) {
    //         // ✅ Reset via CameraControls API
    //         ref.current.setPosition(0, 0, -20, true);
    //         ref.current.setTarget(0, 0, 0, true);

    //         console.log('✅ Camera reset via CameraControls');
    //     }
    // }, [visible]);

    return (
        <>
            <directionalLight
                castShadow={false}
                intensity={0.8}
                position={[10, 5, 3]}
                shadow-mapSize={[2048, 2048]}
                color="grey"
                shadow-bias={-0.0001}
                shadow-normalBias={0.02}
                shadow-camera-near={0.1}
                shadow-camera-far={50}
            >
                {/* <orthographicCamera
                    // attach="shadow-camera"
                    left={-20}
                    right={20}
                    top={20}
                    bottom={-20}
                /> */}
                <orthographicCamera
                    attach="shadow-camera"
                    args={[-15, 15, 15, -15, 0.1, 30]} // [left, right, top, bottom, near, far]
                />
                <CameraControls
                    // attach="shadow-camera"
                    makeDefault
                    // no Y-axis
                    polarRotateSpeed={0}
                    // no zoom
                    dollySpseed={0}
                    // Max angle on active is given by the camera
                    maxAzimuthAngle={maxAngle}
                    // Min angle on active is given by the camera
                    minAzimuthAngle={minAngle}
                    ref={ref}
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
                        // one: 2,
                        one:
                            visible === 'card-detail' &&
                            activeContent?.isClicked
                                ? 2
                                : 1,
                        two: 0,
                        three: 0,
                    }}
                />
            </directionalLight>
            <ambientLight intensity={0.4} color="#fff6f0" />
            {/* <fog attach="fog" args={['#17171b', 30, 40]} /> */}
            <pointLight position={[3, 5, 4]} intensity={0.6} color="#ffe0d0" />
            <pointLight
                position={[-4, 6, -5]}
                intensity={0.5}
                color="#f5f5ff"
            />
            <spotLight
                position={[0, 5, 3]}
                angle={Math.PI / 4}
                penumbra={0.5}
                intensity={0.7}
                color="#ffffff"
                distance={10}
                decay={1}
            />
            <spotLight
                position={[0, 10, 0]}
                angle={Math.PI / 3}
                penumbra={0.7}
                intensity={0.8}
                color="#ffffff"
                castShadow={false} // Ne pas projeter d'ombres pour éviter les conflits
                distance={20}
                decay={2}
                target-position={[0, -1, 0]} // Pointer vers le sol
            />
            <hemisphereLight
                args={['#ffffff', '#ffe0d0', 0.6]} // [couleur ciel, couleur sol, intensité]
                position={[0, 10, 0]}
            />
            {/* <fog attach="fog" args={['black', 8.5, 12]} /> */}
            <fog attach="fog" args={[0xfff0ea, 10, 100]} />
            <color attach="background" args={[0xfff0ea]} />
            {/* <color attach="background" args={['#17171b']} /> */}
            {/* <color attach="background" args={['#191920']} /> */}
            {/* <ambientLight intensity={0.1} /> */}
            {/* <pointLight position={[10, 10, 10]} intensity={1} /> */}
            {/* <pointLight
                position={[0, 2, -1]}
                intensity={0.2}
                // color="#0066ff"
            /> */}
            {/* <Suspense
                fallback={
                    <SimpleEnvironment />
                    // <Environment preset="city" background={false} />
                }
            > */}
            {/* <Environment preset="dawn" background blur={0.5} /> */}
            {/* <Environment blur={0.4} /> */}
            <Environment preset="sunset" background blur={0.4} />
            {/* <Environment preset="park" background blur={0.5} /> */}
            {/* </Suspense> */}
            {/* <EffectComposer>
                <Bloom
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    intensity={0.15} // Légèrement augmenté
                />
                <Noise opacity={0.01} />
                <BrightnessContrast brightness={0.08} contrast={0.1} /> //
                Légèrement plus lumineux
                <ToneMapping
                    adaptive={true}
                    resolution={256}
                    middleGrey={0.6}
                    maxLuminance={2.5}
                />
            </EffectComposer> */}
            {/* <EffectComposer enableNormalPass>
                <Noise opacity={0.01} />
                <BrightnessContrast brightness={0.1} contrast={0.15} />
                <ToneMapping
                    adaptive={true}
                    resolution={256}
                    middleGrey={0.7}
                    maxLuminance={2.5}
                />

                <SSAO
                    samples={16}
                    radius={0.1}
                    intensity={0.25}
                    luminanceInfluence={0.6}
                />
            </EffectComposer> */}
            {/* <ParticlesEffect /> */}
            {/* <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            /> */}
            {/* <SunsetGradientBackground /> */}
            {/* <ShadowCatcher /> */}
        </>
    );
}

// function ParticlesEffect() {
//     // Créer 500 particules dispersées dans l'espace
//     const particleCount = 500;
//     const particlesPositions = new Float32Array(particleCount * 3);

//     for (let i = 0; i < particleCount; i++) {
//         particlesPositions[i * 3] = (Math.random() - 0.5) * 30; // x
//         particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
//         particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
//     }

//     return (
//         <points>
//             <bufferGeometry>
//                 <float32BufferAttribute
//                     attach="attributes-position"
//                     args={[particlesPositions, 3]}
//                 />
//             </bufferGeometry>
//             <pointsMaterial
//                 size={0.08}
//                 color="#ffffff"
//                 transparent
//                 opacity={0.6}
//             />
//         </points>
//     );
// }
function ShadowCatcher() {
    return (
        // <mesh
        //     receiveShadow
        //     position={[0, -1.6, 0]}
        //     rotation={[-Math.PI / 2, 0, 0]}
        //     scale={[30, 30, 1]}
        // >
        //     <planeGeometry />
        //     <shadowMaterial
        //         // transparent
        //         alphaTest={0}
        //         opacity={0.2}
        //         // opacity={0.2}
        //         color="#000000"
        //     />
        // </mesh>
        <mesh
            name="shadow-catcher"
            receiveShadow
            castShadow={false}
            position={[0, -1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[40, 40, 1]}
        >
            {/* <planeGeometry /> */}
            <shadowMaterial
                // clipShadows
                // transparent
                alphaTest={0}
                opacity={0.3}
                // opacity={0.2}
                color="#000000"
                depthWrite={false}
            />
        </mesh>
    );
}

// function SunsetGradientBackground() {
//     return (
//         <mesh scale={[100, 100, 1]} position={[0, 0, -50]}>
//             <planeGeometry />
//             <shaderMaterial
//                 uniforms={{
//                     uTime: { value: 0 },
//                     uTopColor: { value: new Color('#ff6b35') },
//                     uMiddleColor: { value: new Color('#f7931e') },
//                     uBottomColor: { value: new Color('#ffdc00') },
//                 }}
//                 vertexShader={`
//                     varying vec2 vUv;
//                     void main() {
//                         vUv = uv;
//                         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//                     }
//                 `}
//                 fragmentShader={`
//                     uniform vec3 uTopColor;
//                     uniform vec3 uMiddleColor;
//                     uniform vec3 uBottomColor;
//                     varying vec2 vUv;

//                     void main() {
//                         float mixValue1 = smoothstep(0.0, 0.5, vUv.y);
//                         float mixValue2 = smoothstep(0.5, 1.0, vUv.y);

//                         vec3 color = mix(uBottomColor, uMiddleColor, mixValue1);
//                         color = mix(color, uTopColor, mixValue2);

//                         gl_FragColor = vec4(color, 1.0);
//                     }
//                 `}
//                 side={2} // DoubleSide
//             />
//         </mesh>
//     );
// }
let positionX = 0;
let count = 0;
function onControlStart(e, activeContent, isMobile, visible) {
    // useFrame((state, delta) => {
    if (!e.target) return;
    if (isMobile && visible === 'card-detail' && activeContent?.isClicked) {
        // Prevent camera rotation on card detail view
        console.log(e, '📍 onControlStart');

        if (count === 0) {
            count++;
            positionX = e.target.camera.position.x;
        }
        // if (e.target.camera.position.x !== positionX) {
        //     console.log('truckSpeed', e.target.truckSpeed);
        //     e.target.camera.position.x = positionX;
        //     // e.target.truckSpeed = 0;
        // if (state.camera.position.x !== positionX) {
        // state.camera.position.x = positionX;
        easing.damp(
            e.target.camera.position,
            'x',
            positionX,
            // positionX * 3, // ✅ Facteur de scroll
            0.5,
            0.1
        );
        // e.target.truckSpeed = 0;
        // }
    } else {
        // Reset positionX and count when not in card-detail view
        if (count > 0) {
            count = 0;
        }
    }
    // });
    // let positionX = 0;
    // if (visible === 'card-detail' && activeContent?.isClicked) {
    // Prevent camera rotation on card detail view
    // console.log(e, '📍 onControlStart');

    // if (count === 0) {
    //     count++;
    //     positionX = e.target.camera.position.x;
    // }
    // if (e.target.camera.position.x !== positionX) {
    //     console.log('truckSpeed', e.target.truckSpeed);
    //     e.target.camera.position.x = positionX;
    //     // e.target.truckSpeed = 0;
    // }
    // } else {
    //     // Reset positionX and count when not in card-detail view
    //     if (count > 0) {
    //         count = 0;
    //     }
    // }
}
