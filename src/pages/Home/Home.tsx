import { IconsContainer } from '@/components/3DComponents/3DIcons/IconsContainer.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { DEFAULT_PROJECTS_POSITION_SETTINGS } from '@/configs/3DCarousel.config.ts';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { Suspense, useRef } from 'react';
import { Group } from 'three';
import iconsWithText from '@data/techstack.json';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon.tsx';

type HomeTypes = {
    reducer: ReducerType;
    /** @defaultValue 0.5 */
    margin?: number;
};

let titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
let stackPosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

/**
 * Home page component.
 *
 * @param reducer - ReducerType
 * @param margin - **Default=0.5** - Margin between the title and the stack.
 */
export function Home({ reducer, margin = 0.5 }: HomeTypes) {
    const frameCountRef = useRef(0);
    const titleRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);
    const stackRef = useRef<Group>(null);

    const isActive = location.pathname === '/';
    const { contentWidth, contentHeight, isMobile, generalScaleX } = reducer;

    if (isActive) {
        titlePosition.set(0, 0, 0);
        stackPosition.set(0, -(contentHeight ?? 1) * generalScaleX + margin, 0);
    } else {
        titlePosition.set(0, -100, 0);
        stackPosition.set(0, -100, 0);
    }

    useFrame((_, delta) => {
        frameCountRef.current += 1;
        if (!groupRef.current || !titleRef.current || !stackRef.current) return;

        if (frameCountRef.current % (isActive ? 1 : 2) === 0) {
            easing.damp3(titleRef.current.position, titlePosition, 0.3, delta);
            easing.damp3(stackRef.current.position, stackPosition, 0.3, delta);
        }
    });

    return (
        <group ref={groupRef}>
            <group ref={titleRef}>
                <group position-y={1 * generalScaleX}>
                    <Float {...floatOptions}>
                        <Suspense fallback={null}>
                            <Title
                                rotation={[0, 3.164, 0]}
                                size={80}
                                textProps={{
                                    height: 40,
                                    scale: 0.01 * generalScaleX,
                                }}
                            >
                                Bienvenue
                            </Title>
                        </Suspense>
                    </Float>
                </group>

                <group position-y={0 * generalScaleX}>
                    <Float {...floatOptions}>
                        <Suspense fallback={null}>
                            <Title
                                rotation={[0, 3.164, 0]}
                                size={60}
                                back
                                textProps={{
                                    height: 40,
                                    scale: 0.01 * generalScaleX,
                                }}
                            >
                                sur mon
                            </Title>
                        </Suspense>
                    </Float>
                </group>

                <group position-y={-1 * generalScaleX}>
                    <Float {...floatOptions}>
                        <Title
                            rotation={[0, 3.164, 0]}
                            size={80}
                            back
                            textProps={{
                                height: 40,
                                scale: 0.01 * generalScaleX,
                            }}
                        >
                            Portfolio !
                        </Title>
                    </Float>
                </group>
            </group>

            {/* <Center>
                <PageContainer pageName={'/'}>
                    <HomeContent
                        onWheel={onScrollHandler}
                        className="home"
                        style={{
                            // opacity: isLoaded ? 1 : 0,
                            transform: 'translate(-50%)',
                            transition:
                                'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                            height: '500px',
                            width: 'clamp(min(52%, 100%), 100%, 52vw)',
                            background: 'rgba(255, 255, 255, 0.95)',
                            zIndex: 0,
                        }}
                    />
                </PageContainer>
            </Center> */}
            <group ref={stackRef} renderOrder={-100}>
                <group>
                    <Float {...floatOptions}>
                        <Suspense fallback={null}>
                            <Title
                                rotation={[0, 3.164, 0]}
                                size={30}
                                isMobile={isMobile}
                                textProps={{
                                    height: 20,
                                    scale: 0.01 * generalScaleX,
                                }}
                            >
                                Ma stack technique
                            </Title>
                        </Suspense>
                    </Float>
                </group>
                <Suspense
                    fallback={
                        <PlaceholderIcon
                            position-y={-1 * generalScaleX - margin}
                        />
                    }
                >
                    <IconsContainer
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
}
