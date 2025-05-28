import { ScrollControls, Scroll } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import '../../../utils/util.tsx';
import Carousel from '@/components/3DComponents/Carousel/Carousel';
import MemoizedAbout from '@/pages/About/About';
import { PageScroller } from '@/components/3DComponents/Html/PageScroller';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';
import MemoizedHome from '@/pages/Home/Home';
import MemoizedContact from '@/pages/Contact/Contact';
import { SceneProps } from '@/components/3DComponents/Scene/SceneTypes';

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
    } = reducer;

    const pagesRef = useRef(null!);

    const [virtualPageCount, setVirtualPageCount] = useState(0);

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
        <>
            {/* <Perf minimal={true} antialias={false} position={'bottom-left'} /> */}
            {/* <Preload all /> */}

            <ScrollControls
                pages={virtualPageCount}
                distance={0.3}
                damping={0.5}
            >
                <Scroll ref={pagesRef}>
                    {/* <Suspense fallback={null}> */}
                    <MemoizedHome {...pagesMemoProps} />
                    {/* </Suspense> */}
                    <MemoizedAbout {...pagesMemoProps} />
                </Scroll>
                {pagesRef.current && isMobile && <PageScroller />}
            </ScrollControls>

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
            <Suspense fallback={null}>
                <Carousel
                    reducer={reducer}
                    boundaries={boundaries}
                    SETTINGS={SETTINGS}
                />
            </Suspense>

            {children}
        </>
    );
}
