import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import '../../../utils/util.tsx';
import Carousel from '@/components/3DComponents/Carousel/Carousel';
import MemoizedAbout from '@/pages/About/About';
import { PageScroller } from '@/components/3DComponents/Html/PageScroller';
import MemoizedHome from '@/pages/Home/Home';
import MemoizedContact from '@/pages/Contact/Contact';
import { SceneProps } from '@/components/3DComponents/Scene/SceneTypes';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';

/**
 * Scene component
 * @description : Depending on the page, it will create virtual pages
 * so the user can scroll the contents.
 *
 * @param SETTINGS - Settings defined in the 3DCarouselSettingsTypes.tsx
 * @param boundaries - Boundaries of the carousel
 * @param reducer - ReducerType
 * @param children - Children to be rendered if used in the Router
 * @returns
 */
export function Scene({ children, SETTINGS, boundaries, reducer }: SceneProps) {
    const {
        generalScaleX,
        generalScaleY,
        contentHeight,
        contentWidth,
        isMobile,
        visible,
        activeContent,
    } = reducer;

    const pagesRef = useRef(null!);

    const [virtualPageCount, setVirtualPageCount] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [stableIsMobile, setStableIsMobile] = useState(isMobile);

    useEffect(() => {
        if (isMobile !== stableIsMobile) {
            setIsTransitioning(true);

            const timer = setTimeout(() => {
                setStableIsMobile(isMobile);
                setIsTransitioning(false);
                // setTimeout(() => {
                //     setScrollControlsEnabled(true);
                // }, 100);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isMobile]);

    /**
     * Detect route change -
     * @description : This will automatically
     * apply virtual page count to enable scroll and scroll damping
     */
    useEffect(() => {
        switch (visible) {
            case 'home':
                setVirtualPageCount(isMobile ? 2.8 : 3.6);
                break;
            case 'about':
                setVirtualPageCount(isMobile ? 6.5 : 6);
                break;
            // case 'card-detail':
            //     if (isMobile && activeContent?.isClicked) {
            //         console.log('true');
            //         setVirtualPageCount(1.5);
            //     }
            //     break;
            default:
                setVirtualPageCount(0);
        }
    }, [visible, isMobile]);

    const pagesMemoProps = useMemo(
        () => ({
            contentWidth: contentWidth,
            contentHeight: contentHeight,
            isMobile: isMobile,
            generalScaleX: generalScaleX,
            generalScaleY: generalScaleY,
            visible: visible,
        }),
        [contentWidth, contentHeight, isMobile, generalScaleX, visible]
    );

    return (
        <group key={'scene-group'}>
            {/* <Perf minimal={true} antialias={false} position={'bottom-left'} /> */}
            {/* <Preload all /> */}
            {/* <Perf /> */}
            {!isTransitioning && (
                <ScrollControls
                    key={'scroll-controls'}
                    pages={virtualPageCount}
                    distance={0.3}
                    damping={0.5}
                >
                    <Scroll key={'scroll-controls__scroller'} ref={pagesRef}>
                        {/* <Rig rotation={[0, 0, 0]}> */}
                        <MemoizedHome {...pagesMemoProps} />
                        {/* </Rig> */}

                        <MemoizedAbout {...pagesMemoProps} />
                    </Scroll>
                    {pagesRef.current && isMobile && (
                        <PageScroller key={'scroll-controls__page-croller'} />
                    )}
                </ScrollControls>
            )}

            <MemoizedContact {...pagesMemoProps} />

            {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={80}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                    />
                </mesh> */}
            {/* <Suspense fallback={null}> */}
            <Rig rotation={[0, 0, 0]} reducer={reducer}>
                <Carousel
                    reducer={reducer}
                    boundaries={boundaries}
                    SETTINGS={SETTINGS}
                />
            </Rig>
            {/* </Suspense> */}

            {children}
        </group>
    );
}

let positionX = 0;
let count = 0; // Counter to track if the camera control has been activated
function Rig(props) {
    const ref = useRef(null);
    const { visible, activeContent } = props.reducer || {};
    // const scroll = useScroll();
    useFrame((state, delta) => {
        if (!ref.current) return;
        // ✅ Si carte cliquée sur mobile, activer contrôle Y caméra
        // if (visible === 'card-detail' && activeContent?.isClicked) {
        //     if (count === 0) {
        //         count++;
        //         positionX = state.camera.position.x;
        //     }
        //     // Contrôle Y via touches ou gestes
        //     // const keys = state.events.connected; // Accès aux events
        //     // ✅ Scroll via pointer/touch Y movement
        //     // const pointerY = state.pointer.y;
        //     // console.log(positionX, '📍 positionX');
        //     // state.camera.position.x = positionX;
        //     // const smoothY = (state.camera.position.x = state.camera.position.x);
        //     // Smooth camera Y movement basé sur pointer
        //     if (state.camera.position.x !== positionX) {
        //         state.camera.position.x = positionX;
        //         // easing.damp(
        //         //     state.camera.position,
        //         //     'x',
        //         //     positionX,
        //         //     // positionX * 3, // ✅ Facteur de scroll
        //         //     0,
        //         //     delta
        //         // );
        //         // e.target.truckSpeed = 0;
        //     }
        //     // easing.damp(
        //     //     state.camera.position,
        //     //     'x',
        //     //     positionX,
        //     //     // positionX * 3, // ✅ Facteur de scroll
        //     //     0,
        //     //     delta
        //     // );
        //     // const xDrift = Math.abs(state.camera.position.x - positionX);
        //     // if (xDrift > 0.1) {
        //     // Seuil de tolérance
        //     // state.camera.position.x = positionX;
        //     // console.log('🔄 X corrected, drift was:', xDrift);
        //     // }
        //     // console.log('📍 Camera Y control active:', state.camera.position.y);
        // } else {
        //     // Reset positionX and count when not in card-detail view
        //     if (count > 0) {
        //         count = 0;
        //     }
        // }
    });
    return <group ref={ref} {...props} />;
}
