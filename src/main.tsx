import React from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import '@css/Main.scss';
import '@css/reset.css';
import App from './App2.tsx';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter, Outlet } from 'react-router';
import { PageError } from './pages/Error/PageError.tsx';
import { Header } from '@/components/HTML/header/Header.js';
import useResize from '@/hooks/useResize.tsx';

const router = createBrowserRouter([
    {
        path: '*',
        element: <Root />,
        errorElement: <Root contentType={'error'} />,
        children: [
            // {
            //     path: 'error',
            //     element: <ErroPage />,
            // },
        ],
    },
]);

const rootElement = createRoot(document.getElementById('root') as HTMLElement);
rootElement.render(
    <React.StrictMode>
        <RouterProvider router={router} />
        {/* <RouterProvider router={router} future={{ v7_startTransition: true }} /> */}
    </React.StrictMode>
);

/**
 * Layout de la page -
 * App.JSX est le <main> container et est utilisé pour matérialiser le Outlet -
 * Si une erreur est trouvée, il sera remplacé par l'erreur -
 */
export function Root(contentType: { contentType?: string }) {
    const errorContent = contentType.contentType === 'error';
    const { size } = useResize(100);
    const isTouchDevice = size[0] < 968;

    console.log('je render le root');
    return (
        <>
            <Header isTouchDevice={isTouchDevice} />
            <App size={size}>{errorContent ? <PageError /> : <Outlet />}</App>
        </>
    );
}
