import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@css/index.css';
import { App as AppTest } from './components/test.tsx';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppTest />
        {/* <App /> */}
    </StrictMode>
);
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
