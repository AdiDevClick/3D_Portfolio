import { SimpleEnvironment } from '@/components/Loaders/Loader.tsx';
import { DEFAULT_CAMERA_POSITION } from '@/configs/3DCarousel.config.ts';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning.tsx';
import { cameraLookAt } from '@/utils/cameraLooktAt.ts';
import { CameraControls, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { MathUtils, Vector3 } from 'three';

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

export function Experience({ ref, reducer }) {
    const {
        generalScaleX,
        contentHeight,
        contentWidth,
        activeContent,
        isMobile,
        showElements,
        activateElement,
        clickElement,
        visible,
    } = reducer;

    const params = useParams();
    const navigate = useNavigate();
    const id = params['*']?.split('/')[1];

    const location = useLocation();
    // const [viewMode, setViewMode] = useState('home');
    const prevCamPosRef = useRef(DEFAULT_CAMERA_POSITION.clone());
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

            case 'card-hovered':
            case 'card-opened':
            case 'card-detail':
                if (activeContent) {
                    console.log('je suis pourtant active');
                    prevCamPosRef.current = camera.position.clone();

                    positionCameraToCard(
                        ref,
                        activeContent,
                        isMobile,
                        activeContent.isClicked
                    );
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
            reducer.setViewMode('home');
            // setVirtualPageCount(5);
        } else if (
            //     location.pathname.includes('projets') &&
            //     !id &&
            //     !activeContent
            // ) {
            location.pathname.includes('projets')
        ) {
            // setVirtualPageCount(0);
            reducer.setViewMode('carousel');
            console.log('je suis revenu ici');
            if (activeContent) {
                reducer.setViewMode('card-hovered');
            }

            if (id) {
                // } else if (id || activeContent) {
                //     reducer.setViewMode('card-detail');
                reducer.setViewMode('card-opened');

                // } else if (location.pathname.includes('projets') && id) {
                //     // } else if (id) {
                //     reducer.setViewMode('card-opened');

                // setVirtualPageCount(1.3);
            }
            // } else if (id || activeContent) {
            //     reducer.setViewMode('card-detail');
        } else if (location.pathname.includes('a-propos')) {
            reducer.setViewMode('about');
            // setVirtualPageCount(1.3);
        } else if (location.pathname.includes('contact')) {
            reducer.setViewMode('contact');
        } else {
            reducer.setViewMode('error');
        }
        console.log('reducer.viewMode', reducer.visible);
    }, [location, id, activeContent]);

    // // useEffect(() => {
    // //     reducer.setViewMode(viewMode);
    // // }, [viewMode]);

    // useEffect(() => {
    //     if (
    //         // !menuRef.current ||
    //         !ref.current ||
    //         !params['*']?.includes('projets') ||
    //         !id ||
    //         reducer.activeContent
    //     ) {
    //         return;
    //     }
    //     const initialDelay = 500;

    //     // !! IMPORTANT !! Sets the camera to the carousel position
    //     // before activating the card to fix a camera bug
    //     // setViewMode('carousel');
    //     reducer.setViewMode('carousel');
    //     const activateCardByURL = () => {
    //         // Card exists ?
    //         const targetCard = reducer.showElements.find(
    //             (element) => element.id === id
    //         );

    //         if (targetCard) {
    //             // !! IMPORTANT !! Activate card to focus
    //             reducer.activateElement(targetCard, true);
    //             // Camera turns to the active card
    //             setTimeout(() => {
    //                 if (!targetCard.ref?.current) {
    //                     // Retry
    //                     return activateCardByURL();
    //                 }

    //                 const { camera } = ref.current;
    //                 // Force camera position
    //                 positionCameraToCard(
    //                     ref,
    //                     targetCard,
    //                     reducer.isMobile,
    //                     false,
    //                     1.0
    //                 );

    //                 // Opening card animation
    //                 setTimeout(() => {
    //                     // Expand the card
    //                     reducer.clickElement(targetCard);

    //                     setTimeout(() => {
    //                         camera.fov = reducer.isMobile ? 19 : 20;
    //                         camera.updateProjectionMatrix();
    //                     }, 300);
    //                 }, 600);
    //             }, 300);
    //         } else {
    //             // Retry
    //             if (reducer.showElements.length > 0) {
    //                 // Si nous avons déjà des cartes mais pas celle demandée, rediriger
    //                 setTimeout(() => {
    //                     if (
    //                         !reducer.showElements.find(
    //                             (element) => element.id === id
    //                         )
    //                     ) {
    //                         navigate('/projets', { replace: true });
    //                     }
    //                 }, 1000);
    //             } else {
    //                 console.log(
    //                     'Attente du chargement des cartes avant de réessayer...'
    //                 );
    //                 setTimeout(activateCardByURL, 300);
    //             }
    //         }
    //     };

    //     // init animations
    //     const timer = setTimeout(activateCardByURL, initialDelay);

    //     return () => clearTimeout(timer);
    // }, [reducer.showElements, viewMode]);
    // const reducer = use(ReducerContext);
    // console.log(reducer, 'reducer');
    /**
     * Camera positioning on URL loading -
     * @description : Camera is positionned on the active card
     * if the URLparams contains a card ID -
     */
    useEffect(() => {
        if (
            !ref.current ||
            !params['*']?.includes('projets') ||
            !id ||
            activeContent
        ) {
            return;
        }

        let attempts = 0;
        const maxAttempts = 5;
        const initialDelay = 500;

        const activateCardByURL = () => {
            attempts++;

            // !! IMPORTANT !! Sets the camera to the carousel position
            // reducer.setViewMode('carousel');

            if (attempts > maxAttempts) {
                // Max attempts reached - redirect to carousel
                reducer.setViewMode('carousel');
                navigate('/projets', { replace: true });
                return;
            }

            if (showElements.length === 0) {
                // Retry
                return setTimeout(activateCardByURL, 300);
            }

            const targetCard = showElements.find(
                (element) => element.id === id
            );

            if (!targetCard) {
                // No cards ? - redirect to carousel
                reducer.setViewMode('carousel');
                navigate('/projets', { replace: true });
                return;
            }

            // Laisser le temps au mode carousel de s'établir
            setTimeout(() => {
                // Activate card to focus
                activateElement(targetCard, true);

                // Activate click after a short delay
                setTimeout(() => {
                    clickElement(targetCard);
                }, 600);
            }, 400);
        };

        // Awaits the initialization of the elements (initialDelay)
        // And then activate the card
        const timer = setTimeout(activateCardByURL, initialDelay);

        return () => clearTimeout(timer);
    }, [id, showElements, ref.current]);
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
                    onStart={(e) =>
                        onControlStart(e, reducer.activeContent?.isClicked)
                    }
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
