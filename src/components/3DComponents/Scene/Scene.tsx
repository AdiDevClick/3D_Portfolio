import { ScrollControls, Scroll } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import '../../../utils/util.tsx';
import Carousel from '@/components/3DComponents/Carousel/Carousel';
import MemoizedAbout from '@/pages/About/About';
import { PageScroller } from '@/components/3DComponents/Html/PageScroller';
import MemoizedHome from '@/pages/Home/Home';
import MemoizedContact from '@/pages/Contact/Contact';
import { SceneProps } from '@/components/3DComponents/Scene/SceneTypes';
import { useFrame } from '@react-three/fiber';
import { ScrollReset } from '@/components/3DComponents/Scrolling/ScrollReset';

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
                    <ScrollReset visible={visible} />
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
            {/* <Rig rotation={[0, 0, 0]} reducer={reducer}> */}
            <Carousel
                reducer={reducer}
                boundaries={boundaries}
                SETTINGS={SETTINGS}
            />
            {/* </Rig> */}
            {/* </Suspense> */}

            {children}
        </group>
    );
}
