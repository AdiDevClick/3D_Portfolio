import MemoizedIconsContainer from '@/components/3DComponents/3DIcons/IconsContainer';
import { DEFAULT_PROJECTS_POSITION_SETTINGS } from '@/configs/3DCarousel.config';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { memo, Suspense, useEffect, useRef } from 'react';
import { Group } from 'three';
import iconsWithText from '@data/techstack.json';
import { frustumChecker } from '@/utils/frustrumChecker';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import { HomePageTitle } from '@/components/3DComponents/Title/HomePageTitle';
import { ContactShadows } from '@react-three/drei';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';
import { animateItem } from '@/hooks/animation/useAnimateItems';
import { useVirtualPageCount } from '@/hooks/pageScrolling/useVirtualPageCount';

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

const ANIM_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.2,
    type: 'position' as const,
};

const gridOptions = {
    columnsNumber: 3,
    rowOffset: 0.5,
    marginX: 2.5,
    marginY: 1.5,
    windowMargin: 1,
};

const animations = {
    propertiesToCheck: ['scale', 'rotation'],
    hovered: true,
    scale: { hovered: 1.2, default: 1 },
    rotation: { hovered: [0, -0.5, -0.05], default: [0, 0, 0] },
    animatePosition: { from: [0, -10, 0], default: [0, 0, 0] },
    config: {
        mass: 1.5,
        tension: 100,
        friction: 26,
        precision: 0.001,
        duration: 200,
    },
    delay: 100,
} as any;

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
    const { calculateVirtualPageCount, setIsPageActive } =
        useVirtualPageCount();
    const isActive = visible === 'home';

    const titleRef = useRef<Group>(null!);
    const ref = useRef<Group>(null!);
    const stackRef = useRef<Group>(null!);

    currentTitlePos = isActive
        ? currentTitlePos.set(0, 0, 0)
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
    currentStackPos = isActive
        ? currentStackPos.set(0, yPosition, 0)
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

    useEffect(() => {
        if (isActive) {
            calculateVirtualPageCount({
                groupRef: ref,
                contentHeight,
                isActive,
            });
        } else {
            setIsPageActive(false);
        }
    }, [visible, isActive]);

    useFrame((state, delta) => {
        if (!ref.current || !titleRef.current || !stackRef.current) return;
        frameCountRef.current += 1;

        // Check if the objects are in the frustum
        frustumChecker(
            [ref.current, stackRef.current, titleRef.current],
            state,
            frameCountRef.current,
            isMobile
        );

        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: stackRef,
                effectOn: currentStackPos,
            },
            isActive,
            groupRef: ref,
            delta,
        });

        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: titleRef,
                effectOn: currentTitlePos,
            },
            isActive,
            groupRef: ref,
            delta,
        });
    });

    return (
        <group visible={isActive} ref={ref}>
            <HomePageTitle ref={titleRef} scalar={generalScaleX} />
            <Suspense fallback={<PlaceholderIcon ref={stackRef} />}>
                <group name={'stack-container'} ref={stackRef}>
                    <FloatingTitle
                        text="Ma stack technique"
                        scalar={generalScaleX}
                        size={30}
                        textProps={{
                            height: 20,
                        }}
                        name="home-page-stack-title"
                    />
                    <MemoizedIconsContainer
                        width={contentWidth ?? 1}
                        icons={iconsWithText}
                        scalar={generalScaleX}
                        gridOptions={gridOptions}
                        position-y={
                            isMobile
                                ? -2 * generalScaleX - margin
                                : -2.5 * generalScaleX - margin
                        }
                        isMobile={isMobile}
                        animations={animations}
                        iconScale={90 * generalScaleX}
                        rotation={[0, 3.164, 0]}
                    />
                </group>
            </Suspense>

            {visible === 'home' && (
                <ContactShadows
                    frames={60}
                    position={[0, -2.5, 0]}
                    blur={1}
                    opacity={0.6}
                />
            )}
        </group>
    );
});

export default MemoizedHome;
