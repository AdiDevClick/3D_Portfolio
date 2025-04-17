import React from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import '@css/Main.scss';
import '@css/reset.css';
import App from './App2.tsx';
// import App from './App.tsx';
import { Scene } from './components/3DComponents/Scene/Scene.tsx';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter, NavLink, Outlet } from 'react-router';
import { PageError } from './pages/Error/PageError.tsx';
import { Button } from '@/components/button/Button.tsx';
import { Header } from '@/components/header/Header.tsx';
import Carousel from '@/components/3DComponents/Carousel/Carousel.tsx';
import { useCarousel } from '@/hooks/reducers/useCarousel.tsx';
import { useSettings } from '@/hooks/useSettings.tsx';
import useResize from '@/hooks/useResize.tsx';
import JSONDatas from '@data/exemples.json';
import { CarouselActivator } from '@/components/3DComponents/Carousel/CarouselActivator.tsx';

const router = createBrowserRouter([
    {
        path: '*',
        element: <Root />,
        errorElement: <Root contentType={'error'} />,
        children: [
            // {
            //     index: true,
            //     element: <Scene />,
            // },
            // {
            //     path: 'a-propos',
            //     element: <Scene />,
            //     // element: (
            //     //     <Canvas camera={{ position: [0, 0, 0] }}>
            //     //         {/* <ambientLight /> */}
            //     //         <Experience />
            //     //     </Canvas>
            //     // ),
            // },
            // {
            //     path: 'projets',
            //     // element: <Scene />,
            //     element: <CarouselActivator />,
            // },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </React.StrictMode>
);

/**
 * Layout de la page -
 * App.JSX est le <main> container et est utilisé pour matérialiser le Outlet -
 * Si une erreur est trouvée, il sera remplacé par l'erreur -
 */
export function Root(contentType) {
    const errorContent = contentType.contentType === 'error';
    // General Store
    // const reducer = useCarousel();

    // // Boundaries Settings
    // const SETTINGS = useSettings(JSONDatas);

    // // Specify boundaries & responsive boundaries
    // const { size } = useResize(100);
    // reducer.isMobile = size[0] < 768;
    // // const isMobile = size[0] < 768;

    // const scaleX = Math.max(0.5, size[0] / 1920);
    // const scaleY = Math.max(0.5, size[1] / 1080);
    // const responsiveBoundaries = {
    //     x: SETTINGS.x * scaleX,
    //     y: SETTINGS.y * scaleY,
    //     z: SETTINGS.z,
    // };
    // const contextProps = {
    //     boundaries: responsiveBoundaries,
    //     reducer,
    //     SETTINGS,
    //     datas: JSONDatas,
    // };
    return (
        <>
            <Header />
            {/* <App>{errorContent ? <PageError /> : <Outlet />}</App> */}
            <App>
                {errorContent ? (
                    <PageError />
                ) : (
                    <Scene />
                    // <Outlet />
                )}
            </App>
            {/* <App /> */}
        </>
    );
}
{
    /* <Outlet context={contextProps} /> */
}

{
    /* <MotionPathControls
                ref={motionPathRef}
                object={motionPathObject}
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
            /> */
}
