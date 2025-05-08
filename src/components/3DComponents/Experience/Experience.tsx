import { ReducerContext } from '@/App2.tsx';
import { SimpleEnvironment } from '@/components/Loaders/Loader.tsx';
import { DEFAULT_CAMERA_POSITION } from '@/configs/3DCarousel.config.ts';
import { useCameraPositioning } from '@/hooks/camera/useCameraPositioning.tsx';
import { CameraControls, Environment } from '@react-three/drei';
import { Suspense, use, useEffect, useState } from 'react';
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

export function Experience({ ref }) {
    // const params = useParams();
    // const navigate = useNavigate();
    // const id = params['*']?.split('/')[1];

    // const location = useLocation();
    // const [viewMode, setViewMode] = useState('home');
    // const [prevCamPos, setPrevCamPos] = useState(
    //     DEFAULT_CAMERA_POSITION.clone()
    // );
    // const { positionCameraToCard } = useCameraPositioning();

    // /**
    //  * Camera positioning -
    //  * @description : Camera is positionned on the active page or content
    //  */
    // useEffect(() => {
    //     if (!ref.current) return;

    //     const { camera } = ref.current;
    //     console.log(reducer.visible, 'reducer.viewMode');
    //     switch (reducer.visible) {
    //         // switch (viewMode) {
    //         // switch () {
    //         case 'home':
    //             camera.fov = cameraPositions.home.fov;
    //             ref.current.setLookAt(
    //                 cameraPositions.home.position.x,
    //                 cameraPositions.home.position.y,
    //                 cameraPositions.home.position.z,
    //                 cameraPositions.home.target.x,
    //                 cameraPositions.home.target.y,
    //                 cameraPositions.home.target.z,
    //                 true
    //             );
    //             camera.updateProjectionMatrix();
    //             break;

    //         case 'carousel':
    //             camera.fov = cameraPositions.carousel.fov;
    //             ref.current.setLookAt(
    //                 prevCamPos.x,
    //                 prevCamPos.y,
    //                 prevCamPos.z,
    //                 cameraPositions.carousel.target.x,
    //                 cameraPositions.carousel.target.y,
    //                 cameraPositions.carousel.target.z,
    //                 true
    //             );
    //             camera.updateProjectionMatrix();
    //             break;

    //         case 'card-detail':
    //             if (reducer.activeContent) {
    //                 setPrevCamPos(camera.position.clone());
    //                 const { isClicked } = reducer.activeContent;

    //                 positionCameraToCard(
    //                     ref,
    //                     reducer.activeContent,
    //                     reducer.isMobile,
    //                     isClicked
    //                 );
    //                 camera.updateProjectionMatrix();
    //             }
    //             break;
    //     }
    // }, [reducer.activeContent, reducer.visible, reducer.isMobile, ref]);

    // /**
    //  * Detect route change -
    //  * @description : Sets the camera position on route change
    //  */
    // useEffect(() => {
    //     if (
    //         location.pathname === '/' ||
    //         location.pathname.includes('a-propos') ||
    //         location.pathname.includes('contact')
    //     ) {
    //         // setViewMode('home');
    //         reducer.setViewMode('home');

    //         // if (location.pathname.includes('a-propos'))
    //         //     setVirtualPageCount(1.3);
    //         // if (location.pathname === '/') setVirtualPageCount(5);
    //     } else if (
    //         location.pathname.includes('projets') &&
    //         !id &&
    //         !reducer.activeContent
    //     ) {
    //         // setViewMode('carousel');
    //         reducer.setViewMode('carousel');
    //         console.log(
    //             'JE SUIS EN TRAIN DE VIEWMODE CAROUSEL:',
    //             location.pathname,
    //             ' active content ? => '
    //             // reducer.activeContent
    //         );
    //         // setVirtualPageCount(0);
    //         // reducer.visible = 'carousel';
    //     } else if (id || reducer.activeContent) {
    //         // setViewMode('card-detail');
    //         reducer.setViewMode('card-detail');
    //         console.log(
    //             'JE SUIS EN TRAIN DE VIEWMODE CARD DETAIL:',
    //             location.pathname,
    //             ' active content ? => => => '
    //             // reducer.activeContent
    //         );

    //         // } else if (location.pathname.includes('a-propos')) {
    //         //     setViewMode('about');
    //     } else {
    //         // setViewMode('error');
    //         reducer.setViewMode('error-detail');
    //     }
    //     // }, [location, id, viewMode]);
    // }, [location, id, reducer.activeContent]);

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
    console.log('Je render l experience');
    return (
        <>
            {/* <CameraControls
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
                // onStart={(e) =>
                //     onControlStart(e, reducer.activeContent?.isClicked)
                // }
            /> */}
            <color attach="background" args={['#191920']} />
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight
                position={[-10, -10, -10]}
                intensity={0.5}
                // color="#0066ff"
            />
            <Suspense
                fallback={
                    <SimpleEnvironment />
                    // <Environment preset="city" background={false} />
                }
            >
                <Environment preset="park" background blur={0.5} />
            </Suspense>
        </>
    );
}
