import { onControlStart } from '@/components/3DComponents/Scene/Scene.tsx';
import { SimpleEnvironment } from '@/components/Loaders/Loader.tsx';
import { CameraControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

let minAngle = -Infinity;
let maxAngle = Infinity;

export function Experience() {
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
