import React from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import App from './App2.tsx';
// import App from './App.tsx';
import { Scene } from './components/3DComponents/Scene.tsx';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter, NavLink, Outlet } from 'react-router';
import { PageError } from './pages/Error/PageError.tsx';
import { Canvas } from '@react-three/fiber';
import { Experience } from '@/App3.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Root contentType={'error'} />,
        children: [
            {
                index: true,
                element: <Scene />,
            },
            {
                path: 'a-propos',
                // element: (
                //     <Canvas camera={{ position: [0, 0, 0] }}>
                //         {/* <ambientLight /> */}
                //         <Experience />
                //     </Canvas>
                // ),
            },
            {
                // path: ':id',
                // element: <Room />,
            },
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
 * @param {[{}]} contentType
 * @returns {JSX.Element}
 */
export function Root(contentType) {
    let errorContent = false;
    if (contentType.contentType === 'error') {
        errorContent = true;
    }
    return (
        <>
            <header className="main-container">
                <nav>
                    {/* <Logo /> */}
                    <ul>
                        <li>
                            <NavLink
                                id="home-link"
                                aria-labelledby="home-link-text"
                                to="/"
                            >
                                <span id="home-link-text">Accueil</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/a-propos">A Propos</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <App>{errorContent ? <PageError /> : <Outlet />}</App>
            <App />
        </>
    );
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
