import MemoizedIconsContainer from '@/components/3DComponents/3DIcons/IconsContainer';
import { DEFAULT_PROJECTS_POSITION_SETTINGS } from '@/configs/3DCarousel.config';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { memo, RefObject, Suspense, useLayoutEffect, useRef } from 'react';
import { Group } from 'three';
import iconsWithText from '@data/techstack.json';
import { frustumChecker } from '@/utils/frustrumChecker';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import { HomePageTitle } from '@/components/3DComponents/Title/HomePageTitle';
import { ContactShadows, useScroll } from '@react-three/drei';

type HomeTypes = {
    contentWidth: ReducerType['contentWidth'];
    contentHeight: ReducerType['contentHeight'];
    isMobile: ReducerType['isMobile'];
    generalScaleX: ReducerType['generalScaleX'];
    visible: ReducerType['visible'];
    /** @defaultValue 0.5 */
    margin?: number;
};

let currentTitlePos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
let currentStackPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

/**
 * Home page component.
 *
 * @param contentWidth - Width of the content
 * @param contentHeight - Height of the content
 * @param isMobile - Is the device mobile
 * @param generalScaleX - General scale factor for the content from the reducer
 * @param margin - **Default=0.5** - Margin between the title and the stack.
 * @param visible - Visibility of the current active page in the reducer
 */
const MemoizedHome = memo(function Home({
    contentWidth,
    contentHeight,
    isMobile,
    generalScaleX,
    visible,
    /** @defaultValue 0.5 */
    margin = 0.5,
}: HomeTypes) {
    const frameCountRef = useRef(0);
    const yPosition = -(contentHeight ?? 10) * generalScaleX - margin;

    const isActive = visible === 'home';

    const titleRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);
    const stackRef = useRef<Group>(null);
    const scroll = useScroll();

    currentTitlePos = isActive
        ? currentTitlePos.set(0, 0, 0)
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
    currentStackPos = isActive
        ? currentStackPos.set(0, yPosition, 0)
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

    /**
     * Reset scroll position to reinitialize the camera
     */
    useLayoutEffect(() => {
        scroll.el.scrollTo({ top: 1, behavior: 'instant' });
    }, [visible]);

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
                currentStackPos,
                0.2,
                delta
            );
        }
        if (titleRef.current.visible || isActive) {
            easing.damp3(
                titleRef.current.position,
                currentTitlePos,
                0.2,
                delta
            );
        }
    });

    return (
        <group visible={isActive} ref={groupRef}>
            {/* <SpotLight
                castShadow
                position={[-3.5, 4.5, -1.5]}
                distance={10}
                intensity={10}
                angle={0.5}
                attenuation={5}
                anglePower={5}
            /> */}

            {/* <Stars
                radius={100}
                depth={100}
                count={4000}
                factor={4}
                saturation={0}
                fade
                speed={0.2}
            /> */}
            {/* <Sparkles
                count={300}
                size={3}
                speed={0.02}
                opacity={1}
                scale={10}
                color="#fff3b0"
            /> */}

            <HomePageTitle
                ref={titleRef as RefObject<Group>}
                scale={generalScaleX}
            />

            <group ref={stackRef}>
                <FloatingTitle
                    scale={generalScaleX}
                    size={30}
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
                        position-y={
                            isMobile
                                ? -2 * generalScaleX - margin
                                : -2.5 * generalScaleX - margin
                        }
                        isMobile={isMobile}
                    />
                </Suspense>
            </group>
            <ContactShadows
                frames={1}
                position={[0, -2.3, 0]}
                blur={1}
                opacity={0.6}
            />
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
