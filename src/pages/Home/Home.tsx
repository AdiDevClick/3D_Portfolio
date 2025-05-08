import MemoizedIconsContainer from '@/components/3DComponents/3DIcons/IconsContainer.tsx';
import { DEFAULT_PROJECTS_POSITION_SETTINGS } from '@/configs/3DCarousel.config.ts';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { memo, RefObject, Suspense, useEffect, useRef } from 'react';
import { Group } from 'three';
import iconsWithText from '@data/techstack.json';
import { frustumChecker } from '@/utils/frustrumChecker.ts';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon.tsx';
import { useLocation } from 'react-router';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle.tsx';
import { HomePageTitle } from '@/components/3DComponents/Title/HomePageTitle.tsx';

type HomeTypes = {
    contentWidth: ReducerType['contentWidth'];
    contentHeight: ReducerType['contentHeight'];
    isMobile: ReducerType['isMobile'];
    generalScaleX: ReducerType['generalScaleX'];
    /** @defaultValue 0.5 */
    margin?: number;
};

/**
 * Home page component.
 *
 * @param contentWidth - Width of the content
 * @param contentHeight - Height of the content
 * @param isMobile - Is the device mobile
 * @param generalScaleX - General scale factor for the content from the reducer
 * @param margin - **Default=0.5** - Margin between the title and the stack.
 */
const MemoizedHome = memo(function Home({
    contentWidth,
    contentHeight,
    isMobile,
    generalScaleX,
    margin = 0.5,
}: HomeTypes) {
    const frameCountRef = useRef(0);

    const location = useLocation();
    const isActive = location.pathname === '/';

    const titleRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);
    const stackRef = useRef<Group>(null);

    const titlePositionRef = useRef(DEFAULT_PROJECTS_POSITION_SETTINGS.clone());
    const stackPositionRef = useRef(DEFAULT_PROJECTS_POSITION_SETTINGS.clone());

    useEffect(() => {
        if (isActive) {
            titlePositionRef.current.set(0, 0, 0);
            stackPositionRef.current.set(
                0,
                -(contentHeight ?? 1) * generalScaleX + margin,
                0
            );
        } else {
            titlePositionRef.current.set(0, -100, 0);
            stackPositionRef.current.set(0, -100, 0);
        }
    }, [location.pathname, isActive]);

    useFrame((state, delta) => {
        if (!groupRef.current || !titleRef.current || !stackRef.current) return;
        frameCountRef.current += 1;

        // Check if the objects are in the frustum
        frustumChecker(
            [stackRef.current, titleRef.current],
            state,
            frameCountRef.current,
            isMobile
        );

        if (stackRef.current.visible || isActive) {
            easing.damp3(
                stackRef.current.position,
                stackPositionRef.current,
                0.3,
                delta
            );
        }
        if (titleRef.current.visible || isActive) {
            easing.damp3(
                titleRef.current.position,
                titlePositionRef.current,
                0.3,
                delta
            );
        }
    });

    console.log('Je render le home');
    return (
        <group visible={isActive} ref={groupRef}>
            <HomePageTitle ref={titleRef as RefObject<Group>} />
            <group ref={stackRef}>
                <FloatingTitle
                    scale={generalScaleX}
                    size={30}
                    yPosition={0}
                    isMobile={isMobile}
                    textProps={{
                        height: 20,
                    }}
                >
                    Ma stack technique
                </FloatingTitle>
                <Suspense
                    fallback={
                        <PlaceholderIcon
                            position-y={-1 * generalScaleX - margin}
                        />
                    }
                >
                    <MemoizedIconsContainer
                        width={contentWidth ?? 1}
                        icons={iconsWithText}
                        scalar={generalScaleX}
                        position-y={-1 * generalScaleX - margin}
                        isMobile={isMobile}
                    />
                </Suspense>
            </group>
        </group>
    );
});

export default MemoizedHome;
// export default memo(MemoizedHome, (prevProps, nextProps) => {
//     // Log des changements
//     if (prevProps.contentWidth !== nextProps.contentWidth)
//         console.log('width changed');
//     if (prevProps.contentHeight !== nextProps.contentHeight)
//         console.log('height changed');
//     if (prevProps.generalScaleX !== nextProps.generalScaleX)
//         console.log('scale changed');

//     return (
//         prevProps.contentWidth === nextProps.contentWidth &&
//         prevProps.contentHeight === nextProps.contentHeight &&
//         prevProps.generalScaleX === nextProps.generalScaleX &&
//         prevProps.isMobile === nextProps.isMobile &&
//         prevProps.margin === nextProps.margin
//     );
// });
