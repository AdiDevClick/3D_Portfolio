import { Scene } from '@/components/3DComponents/Scene/Scene';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { ReactNode, Suspense, useEffect, useRef } from 'react';
import { Experience } from '@/components/3DComponents/Experience/Experience';
import { Loader } from '@react-three/drei';
import { useCarousel } from '@/hooks/reducers/useCarousel';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';
import MemoizedHudMenu from '@/components/3DComponents/Header/HudMenu';

interface AppProps {
    children: ReactNode;
    size: number[];
    width?: number;
    SETTINGS?: SettingsType;
    boundaries?: { x: number; y: number; z: number };
    scaleX?: number;
    scaleY?: number;
    isMobile?: boolean;
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
    const reducer = useCarousel();

    useEffect(() => {
        reducer.batchUpdate({
            isMobile: (size[0] ?? 1) < 768,
            isTablet: (size[0] ?? 1) < 1024,
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
                // eventSource={document.getElementById('root')}
                eventPrefix="client"
                onTouchStart={(e) => {
                    // Empêcher le comportement par défaut uniquement sur le canvas
                    if (e.target === e.currentTarget) {
                        e.preventDefault();
                    }
                }}
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
                <Suspense fallback={<PlaceholderIcon />}>
                    <Scene
                        SETTINGS={SETTINGS || ({} as SettingsType)}
                        boundaries={boundaries || { x: 0, y: 0, z: 0 }}
                        reducer={reducer}
                    >
                        {children}
                    </Scene>
                    <Experience reducer={reducer} />
                    {/* <MemoizedHudMenu reducer={reducer} /> */}
                </Suspense>
                {/* </SceneParams> */}
            </Canvas>
            {/* </Suspense> */}
            <Loader
            // containerStyles={{
            //     display: 'none', // Cacher le loader par défaut
            // }}
            // dataStyles={{
            //     color: '#ffffff',
            // }}
            // onStart={() => {
            //     document.getElementById('loader-container')!.style.display =
            //         'flex';
            // }}
            // onProgress={(progress) => {
            //     const fill = document.querySelector(
            //         '.progress-fill'
            //     ) as HTMLElement;
            //     if (fill) {
            //         fill.style.width = `${progress * 100}%`;
            //     }
            // }}
            // onFinish={() => {
            //     const container =
            //         document.getElementById('loader-container');
            //     if (container) {
            //         container.style.opacity = '0';
            //         setTimeout(() => {
            //             container.style.display = 'none';
            //         }, 500); // Fade out animation
            //     }
            // }}
            />
        </main>
    );
}
