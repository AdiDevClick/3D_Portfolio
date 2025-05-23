import { loadCardByURL } from '@/components/3DComponents/Experience/ExperienceFunctions';
import { ExperienceProps } from '@/components/3DComponents/Experience/ExperienceTypes';
import { SimpleEnvironment } from '@/components/Loaders/Loader';
import { DEFAULT_CAMERA_POSITION } from '@/configs/3DCarousel.config';
import { CAMERA_FOV_DESKTOP, CAMERA_FOV_MOBILE } from '@/configs/Camera.config';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning';
import { cameraLookAt } from '@/utils/cameraLooktAt';
import { CameraControls, Environment, Stars } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Vector3 } from 'three';
import {
    Bloom,
    ChromaticAberration,
    EffectComposer,
    Noise,
    Vignette,
    BrightnessContrast,
    SSAO,
    ToneMapping,
} from '@react-three/postprocessing';

let minAngle = -Infinity;
let maxAngle = Infinity;
const initialCameraFov = 20;

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
        visible,
    } = reducer;
    const ref = useRef<CameraControls>(null!);
    const prevCamPosRef = useRef(DEFAULT_CAMERA_POSITION.clone());

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
        cameraPositions.carousel.fov = isMobile
            ? CAMERA_FOV_MOBILE
            : CAMERA_FOV_DESKTOP;
        cameraPositions.home.fov = isMobile
            ? CAMERA_FOV_MOBILE
            : CAMERA_FOV_DESKTOP;

        switch (visible) {
            case 'home':
            case 'about':
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
                // Resets the max camera angles to infinity
                ref.current.minAzimuthAngle = minAngle;
                ref.current.maxAzimuthAngle = maxAngle;
                break;

            case 'card-opened':
            case 'card-detail':
                if (activeContent) {
                    prevCamPosRef.current = camera.position.clone();
                    const results = positionCameraToCard(
                        ref,
                        activeContent,
                        isMobile,
                        activeContent.isClicked
                    );
                    // Set the max camera angles to the active card
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
                    }
                    break;
                }
                if (!activeContent) {
                    // useEffect Camera positioning on URL loading will take effect
                }
                break;
        }
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
            if (params.id) {
                if (visible !== 'card-detail') setViewMode('card-detail');
            } else if (activeContent?.isActive && !activeContent?.isClicked) {
                if (visible !== 'card-detail') setViewMode('card-detail');
            } else {
                if (visible !== 'carousel') setViewMode('carousel');
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
        if (!ref.current || !params.id || activeContent) {
            return;
        }
        const options = {
            id: params.id,
            showElements,
            activateElement,
            clickElement,
            setViewMode,
            navigate,
        };
        setViewMode('carousel');
        const initialDelay = 800;

        // Awaits the initialization of the elements (initialDelay)
        // And then activate the card
        const timer = setTimeout(() => {
            loadCardByURL(5, initialDelay, options);
        }, initialDelay);
        return () => clearTimeout(timer);
    }, [params.id, showElements]);

    return (
        <>
            <directionalLight
                castShadow
                intensity={0.8}
                position={[10, 5, 3]}
                shadow-mapSize={[2048, 2048]}
                color="grey"
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
                    // makeDefault
                    // azimuthRotateSpeed={0.5}
                    // no Y-axis
                    polarRotateSpeed={0}
                    // no zoom
                    dollySpeed={0}
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
                        one: 1,
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
            <Suspense
                fallback={
                    <SimpleEnvironment />
                    // <Environment preset="city" background={false} />
                }
            >
                {/* <Environment preset="dawn" background blur={0.5} /> */}
                <Environment preset="sunset" background blur={0.4} />
                {/* <Environment preset="park" background blur={0.5} /> */}
            </Suspense>
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
            <ShadowCatcher />
        </>
    );
}

function ParticlesEffect() {
    // Créer 500 particules dispersées dans l'espace
    const particleCount = 500;
    const particlesPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlesPositions[i * 3] = (Math.random() - 0.5) * 30; // x
        particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
        particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
    }

    return (
        <points>
            <bufferGeometry>
                <float32BufferAttribute
                    attach="attributes-position"
                    args={[particlesPositions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#ffffff"
                transparent
                opacity={0.6}
            />
        </points>
    );
}
function ShadowCatcher() {
    return (
        <mesh
            receiveShadow
            position={[0, -1.6, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[30, 30, 1]}
        >
            <planeGeometry />
            <shadowMaterial
                transparent
                opacity={0.2}
                // opacity={0.2}
                color="#000000"
            />
        </mesh>
    );
}
