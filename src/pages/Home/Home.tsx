import MemoizedIconsContainer from '@/components/3DComponents/3DIcons/IconsContainer';
import { DEFAULT_PROJECTS_POSITION_SETTINGS } from '@/configs/3DCarousel.config';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { memo, Suspense, useRef } from 'react';
import { Group } from 'three';
import iconsWithText from '@data/techstack.json';
import { frustumChecker } from '@/utils/frustrumChecker';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import { HomePageTitle } from '@/components/3DComponents/Title/HomePageTitle';
import { ContactShadows, useScroll } from '@react-three/drei';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';

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
let count = 0;

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

    if (count > 0) count = 0;

    useFrame((state, delta) => {
        if (!groupRef.current || !titleRef.current || !stackRef.current) return;
        frameCountRef.current += 1;

        if (isActive && count <= 0) {
            scroll.offset = 0;
            scroll.el.scrollTo({ top: 0, behavior: 'smooth' });
            count++;
        }

        if (!isActive && count > 0) {
            count = 0;
        }

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
