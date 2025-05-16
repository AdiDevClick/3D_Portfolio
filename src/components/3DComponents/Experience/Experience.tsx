import { SimpleEnvironment } from '@/components/Loaders/Loader';
import { DEFAULT_CAMERA_POSITION } from '@/configs/3DCarousel.config';
import { wait } from '@/functions/promises.js';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { cameraLookAt } from '@/utils/cameraLooktAt';
import { CameraControls, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { MathUtils, Vector3 } from 'three';

interface ErrorWithCause extends Error {
    cause?: { status: number };
}

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

export function Experience({ reducer }: { reducer: ReducerType }) {
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
                break;

            case 'card-opened':
            case 'card-detail':
                if (activeContent) {
                    prevCamPosRef.current = camera.position.clone();

                    positionCameraToCard(
                        ref,
                        activeContent,
                        isMobile,
                        activeContent.isClicked
                    );
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
        // const options = {
        //     id: params.id,
        //     showElements,
        //     activateElement,
        //     clickElement,
        //     setViewMode,
        //     navigate,
        // };

        const initialDelay = 500;

        const activateCardByURL = async (retries = 5, delay = 500) => {
            try {
                if (showElements.length === 0) {
                    throw createHttpError('Try again', 403);
                }

                const targetCard = showElements.find(
                    (element: { id: string }) => element.id === params.id
                    // (element: { id: string }) => element.id === id
                );

                if (!targetCard) {
                    throw createHttpError('No project found', 404);
                }

                // Wait for the carousel mode to establish
                await wait(400);

                // Activate card to focus
                activateElement(targetCard, true);

                await wait(600);

                // Activate click after a short delay
                clickElement(targetCard);
            } catch (error) {
                const typedError = error as ErrorWithCause;

                if (retries > 0 && typedError.cause?.status === 403) {
                    await wait(delay, 'Attente pour un nouvel essai');
                    return activateCardByURL(retries - 1, delay * 2);
                }

                if (typedError.cause?.status === 404) {
                    setViewMode('carousel');
                    return navigate('/error', { replace: false });
                }
                console.error('Erreur non gérée :', typedError, error);
            }
        };

        // Awaits the initialization of the elements (initialDelay)
        // And then activate the card

        // activateCardByURL(5, initialDelay, options);
        const timer = setTimeout(activateCardByURL, initialDelay);
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
                    onStart={(e) => onControlStart(e, activeContent?.isClicked)}
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

/**
 * Gère la rotation max de la caméra -
 * @param e
 * @param active
 */
export function onControlStart(e, active) {
    // e.target.azimuthAngle = 0;
    // document.body.style.overflow = 'hidden';
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
function createHttpError(message: string, status: number): Error {
    const error = new Error(message);

    Object.defineProperty(error, 'cause', {
        value: { status },
        enumerable: true,
    });
    return error;
}

// async function activateCardByURL(retries = 5, delay = 500, options) {
//     const {
//         id,
//         showElements,
//         activateElement,
//         clickElement,
//         setViewMode,
//         navigate,
//     } = options;
//     try {
//         // await wait(delay, 'Attente pour un nouvel essai');
//         if (showElements.length === 0) {
//             throw createHttpError('Try again', 403);
//         }

//         const targetCard = showElements.find(
//             (element: { id: string }) => element.id === id
//             // (element: { id: string }) => element.id === id
//         );

//         if (!targetCard) {
//             throw createHttpError('No project found', 404);
//         }

//         // Wait for the carousel mode to establish
//         await wait(400);

//         // Activate card to focus
//         activateElement(targetCard, true);
//         // navigate('/projets', { replace: false });
//         await wait(600);

//         // Activate click after a short delay
//         clickElement(targetCard);
//         // navigate('/projets/' + params.id, { replace: false });
//         // navigate('/projets/' + id, { replace: false });
//     } catch (error) {
//         const typedError = error as ErrorWithCause;

//         if (retries > 0 && typedError.cause?.status === 403) {
//             console.log('Je vais réessayer');
//             await wait(delay, 'Attente pour un nouvel essai');
//             return activateCardByURL(retries - 1, delay * 2, options);
//         }

//         if (typedError.cause?.status === 404) {
//             setViewMode('carousel');
//             // navigate('/projets', { replace: false });
//             return navigate('/error', { replace: false });
//         }
//         console.error('Erreur non gérée :', typedError, error);
//     }
// }
