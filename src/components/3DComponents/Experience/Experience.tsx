import { loadCardByURL } from '@/components/3DComponents/Experience/ExperienceFunctions';
import { ExperienceProps } from '@/components/3DComponents/Experience/ExperienceTypes';
import { SimpleEnvironment } from '@/components/Loaders/Loader';
import { DEFAULT_CAMERA_POSITION } from '@/configs/3DCarousel.config';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning';
import { cameraLookAt } from '@/utils/cameraLooktAt';
import { CameraControls, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Vector3 } from 'three';

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
                        // !! IMPORTANT !! - Forces the camera to rotate without
                        // animation to avoid a clipping bug when the camera is not in the right position
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
    }, [visible, activeContent]);

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

        const initialDelay = 500;

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
                intensity={2}
                position={[10, 6, 6]}
                shadow-mapSize={[1024, 1024]}
            >
                {/* <orthographicCamera
                    // attach="shadow-camera"
                    left={-20}
                    right={20}
                    top={20}
                    bottom={-20}
                /> */}
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
                    // onEnd={() => {
                    //     // Réactiver le défilement de la page après l'interaction
                    //     document.body.style.overflow = '';
                    // }}
                    // dragToOffset={false}
                    // smoothTime={0.25}
                />
            </directionalLight>

            {/* <fog attach="fog" args={['#17171b', 30, 40]} /> */}

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
                <Environment preset="park" background blur={0.5} />
            </Suspense>
        </>
    );
}
