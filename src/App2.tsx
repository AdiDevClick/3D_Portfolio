import { Scene } from '@/components/3DComponents/Scene/Scene';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { ReactNode, useEffect, useRef } from 'react';
import { Experience } from '@/components/3DComponents/Experience/Experience';
import { CameraControls, Loader } from '@react-three/drei';
import { useCarousel } from '@/hooks/reducers/useCarousel';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes';

interface AppProps {
    children: ReactNode;
    size: number[];
    width?: number;
    SETTINGS?: SettingsType;
    boundaries?: { x: number; y: number; z: number };
    scaleX?: number;
    scaleY?: number;
}

const initialCameraFov = 20;
const vFov = (initialCameraFov * Math.PI) / 180;
const height = 2 * Math.tan(vFov / 2) * 20;
// export const ReducerContext = createContext(null);
/**
 * Render le contenu principal de l'App
 * Il prend en paramètre un Children JSX
 */
export default function App({
    children,
    size,
    SETTINGS,
    isMobile,
    width,
    boundaries,
    scaleX,
    scaleY,
}: AppProps) {
    const cameraRef = useRef<CameraControls>(null!);
    const reducer = useCarousel();

    useEffect(() => {
        // reducer.setViewMode(viewMode);
        reducer.batchUpdate({
            isMobile: size[0] < 768,
            isTablet: size[0] < 1024,
            contentWidth: width,
            contentSizes: size,
            contentHeight: height,
            generalScaleX: scaleX,
            generalScaleY: scaleY,
        });
    }, [size[0]]);

    // Global Draco config
    // useEffect(() => {
    //     const dracoLoader = new DRACOLoader();
    //     dracoLoader.setDecoderPath(
    //         'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    //     );
    //     const gltfLoader = new GLTFLoader();
    //     gltfLoader.setDRACOLoader(dracoLoader);
    // }, []);

    return (
        <main className="main-container">
            <Leva hidden={true} />

            {/* <Suspense fallback={null}> */}
            <Canvas
                // frameloop={isMobile ? 'demand' : 'always'}
                gl={{
                    antialias: isMobile ? false : true,
                    // preserveDrawingBuffer: true,
                    precision: isMobile ? 'lowp' : 'highp',
                    // powerPreference: 'high-performance',
                }}
                style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                }}
                id="canva"
                camera={{ position: [0, 0, -14], fov: 50 }}
                // camera={{ position: [0, 0, -20], fov: 20 }}
                // dpr={[0.9, 1]}
                dpr={window.devicePixelRatio}
                // flat={isMobile ? true : false}
                // dpr={
                //     isMobile
                //         ? window.devicePixelRatio * 0.8
                //         : window.devicePixelRatio
                // }
                // onScroll={(e) => e.stopPropagation()}
                // onWheel={onScrollHandler}
                // camera={{ position: [0, 0, 5], fov: 70 }}
            >
                {/* <StatsGl /> */}
                {/* <Perf position="bottom-right" /> */}

                {/* <Experience /> */}
                {/* <Suspense fallback={<LoadingScene />}> */}
                {/* <Scene
                    SETTINGS={SETTINGS}
                    size={size}
                    width={width}
                    scaleX={scaleX}
                    // boundaries={responsiveBoundaries}
                    // reducer={reducer}
                >
                    {children}
                </Scene> */}
                {/* </Suspense> */}
                {/* <Suspense fallback={null}>
                    <Preload all />
                </Suspense> */}
                {/* <SceneParams SETTINGS={SETTINGS} size={size}> */}
                {/* <Suspense fallback={<LoadingScene />}> */}
                <Scene
                    SETTINGS={SETTINGS}
                    // size={size}
                    // width={width}
                    // scaleX={scaleX}
                    // cards={cards}
                    boundaries={boundaries}
                    reducer={reducer}
                >
                    {children}
                </Scene>
                <Experience ref={cameraRef} reducer={reducer} />

                {/* </Suspense> */}
                {/* </SceneParams> */}
            </Canvas>
            {/* </Suspense> */}
            <Loader />
        </main>
    );
}
