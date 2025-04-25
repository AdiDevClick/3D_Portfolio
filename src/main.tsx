import React from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import '@css/Main.scss';
import '@css/reset.css';
import App from './App2.tsx';
// import App from './App.tsx';
import { Scene } from './components/3DComponents/Scene/Scene.tsx';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter, Outlet } from 'react-router';
import { PageError } from './pages/Error/PageError.tsx';
import { Header } from '@/components/HTML/header/Header.js';
import { useSettings } from '@/hooks/useSettings.tsx';
import useResize from '@/hooks/useResize.tsx';
import JSONDatas from '@data/exemples.json';

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
    const SETTINGS = useSettings(JSONDatas);
    // // Specify boundaries & responsive boundaries
    const { size } = useResize(100);
    // reducer.isMobile = size[0] < 768;
    const isTouchDevice = size[0] < 968;
    return (
        <>
            <Header isTouchDevice={isTouchDevice} />
            {/* <App>{errorContent ? <PageError /> : <Outlet />}</App> */}
            <App>
                {errorContent ? (
                    <PageError />
                ) : (
                    <Scene SETTINGS={SETTINGS} size={size} />
                    // <Outlet />
                )}
            </App>
        </>
    );
}
{
    /* <Outlet context={contextProps} /> */
}
