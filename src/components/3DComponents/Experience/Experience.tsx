import { SimpleEnvironment } from '@/components/Loaders/Loader.tsx';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';

export function Experience() {
    return (
        <>
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
