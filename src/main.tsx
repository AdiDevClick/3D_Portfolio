import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import '@css/Main.scss';
import '@css/reset.css';
import App from './App2';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { PageError } from './pages/Error/PageError';
import { Header } from '@/components/HTML/header/Header';
import useResize from '@/hooks/useResize';
import datas from '@data/exemples.json';
import { useSettings } from '@/hooks/useSettings';
import { Error404 } from '@/pages/Error/404/Error404';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';

const baseUrl = import.meta.env.BASE_URL;

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root />,
            errorElement: <Root contentType={'error'} />,
            children: [
                { index: true, element: <Outlet /> },
                {
                    path: 'projets',
                    element: <Outlet />,
                    children: [
                        {
                            path: ':id',
                            element: <Outlet />,
                        },
                    ],
                },
                {
                    path: 'contact',
                    element: <Outlet />,
                },
                {
                    path: 'a-propos',
                    element: <Outlet />,
                },
                {
                    path: 'error',
                    element: (
                        <Suspense fallback={<PlaceholderIcon />}>
                            <Error404 />
                        </Suspense>
                    ),
                },
                {
                    path: '*',
                    element: <Navigate to="/error" replace />,
                },
            ],
        },
    ],
    { basename: baseUrl }
);

const rootElement = createRoot(document.getElementById('root') as HTMLElement);
rootElement.render(
    <React.StrictMode>
        <RouterProvider router={router} />
        {/* <RouterProvider router={router} future={{ v7_startTransition: true }} /> */}
    </React.StrictMode>
);

const initialCameraFov = 20;
const vFov = (initialCameraFov * Math.PI) / 180;
const height = 2 * Math.tan(vFov / 2) * initialCameraFov;
/**
 * Layout de la page -
 * App.JSX est le <main> container et est utilisé pour matérialiser le Outlet -
 * Si une erreur est trouvée, il sera remplacé par l'erreur -
 */
export function Root(contentType: { contentType?: string }) {
    const errorContent = contentType.contentType === 'error';
    const { size } = useResize(100);
    const isTouchDevice = (size[0] ?? 1) < 1024;
    const isMobile = (size[0] ?? 1) < 576;
    const isTablet = (size[0] ?? 1) < 768;
    const SETTINGS = useSettings(datas);

    // // Specify boundaries & responsive boundaries
    const aspectRatio = (size[0] ?? 1) / (size[1] ?? 1);
    const width = height * aspectRatio;

    const scaleX = Math.max(0.5, (size[0] ?? 1) / 1920);
    const scaleY = Math.max(0.5, (size[1] ?? 1) / 1080);

    const responsiveBoundaries = {
        x: SETTINGS.x * scaleX,
        y: SETTINGS.y * scaleY,
        z: SETTINGS.z,
    };

    const contextProps = {
        isMobile,
        scaleX,
    };

    /**
     * Création des propriétés des cartes -
     */
    // const cardsMemo = useMemo(() => {
    //     return new Array(SETTINGS.CARDS_COUNT)
    //         .fill(null)
    //         .map((_, i, self) =>
    //             createCardProperties(SETTINGS, datas, i, self, id, isMobile)
    //         );
    // }, [SETTINGS.CARDS_COUNT]);

    return (
        <>
            <Header isMobile={isMobile} />
            <App
                width={width}
                // cards={cardsMemo}
                SETTINGS={SETTINGS}
                size={size}
                boundaries={responsiveBoundaries}
                scaleX={scaleX}
                scaleY={scaleY}
            >
                {errorContent ? (
                    <PageError />
                ) : (
                    <Outlet context={contextProps} />
                )}
            </App>
        </>
    );
}
