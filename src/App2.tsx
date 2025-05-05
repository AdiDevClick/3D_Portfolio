import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { PropsWithChildren, useEffect } from 'react';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';

/**
 * Render le contenu principal de l'App
 * Il prend en paramètre un Children JSX
 */
export default function App({ children }: PropsWithChildren) {
    // Global Draco config
    useEffect(() => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);
    }, []);

    return (
        <main className="main-container">
            <Leva hidden={true} />
            <Canvas
                // frameloop="demand"
                gl={{
                    antialias: true,
                    preserveDrawingBuffer: true,
                }}
                style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                }}
                id="canva"
                camera={{ position: [0, 0, -14], fov: 50 }}
                // camera={{ position: [0, 0, -20], fov: 20 }}
                // dpr={[1, 1]}
                dpr={
                    isMobile
                        ? window.devicePixelRatio * 0.8
                        : window.devicePixelRatio
                }
                // onScroll={(e) => e.stopPropagation()}
                // onWheel={onScrollHandler}
                // camera={{ position: [0, 0, 5], fov: 70 }}
            >
                {children}
            </Canvas>
        </main>
    );
}
