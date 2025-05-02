import { IconsContainer } from '@/components/3DComponents/3DIcons/IconsContainer.tsx';
import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import {
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { HomeContent } from '@/pages/Home/HomeContent.tsx';
import { CenterProps, Float, Scroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { Group } from 'three/examples/jsm/libs/tween.module.js';
// import iconsWithText from '@data/techstacktest.json';
import iconsWithText from '@data/techstack.json';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';

type HomeTypes = {
    reducer: ReducerType;
};

let titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
let stackPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;

export function Home({ reducer, margin = 0.5 }: HomeTypes) {
    const frameCountRef = useRef(0);
    const titleRef = useRef<CenterProps>(null);
    const groupRef = useRef<Group>(null);
    const stackRef = useRef<Group>(null);

    const isActive = location.pathname === '/';
    const { contentWidth, contentHeight, isMobile, generalScaleX } = reducer;

    const floatOptions = useMemo(
        () => ({
            autoInvalidate: true,
            speed: 1.5,
            rotationIntensity: 0.5,
            floatIntensity: 0.5,
            floatingRange: [-0.1, 0.1] as [number, number],
        }),
        []
    );

    if (isActive) {
        titlePosition = [0, 0, 0];
        // titlePosition = new Vector3(0, 0, 0);
        stackPosition = [0, -contentHeight * generalScaleX + margin, 0];
        // stackPosition = new Vector3(
        //     0,
        //     -contentHeight * generalScaleX + margin,
        //     0
        // );
    } else {
        titlePosition = [0, -100, 0];
        // titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
        stackPosition = [0, -100, 0];
        // stackPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
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
            {/* <group ref={groupRef} renderOrder={-100}> */}

            {/* <HtmlContainer className="html-container">
                <div
                    // className="about"
                    id="scroll-container"
                    style={{
                        height: '1000vh',
                        width: '100vw',
                        // overflow: 'auto',
                        WebkitOverflowScrolling: 'touch', // Important pour iOS
                        position: 'fixed',
                        scale: 4,
                        // inset: 0,
                        backgroundColor: 'black',
                        // transform: 'translate(-50%)',
                        // zIndex: 10000000000,
                        // pointerEvents: reducer.activeContent?.isClicked
                        //     ? 'none'
                        //     : 'auto',
                    }}
                ></div>
            </HtmlContainer> */}

            <group ref={titleRef}>
                <Float position-y={1 * generalScaleX} {...floatOptions}>
                    <Title
                        rotation={[0, 3.164, 0]}
                        size={80}
                        textProps={{ height: 40, scale: 0.01 * generalScaleX }}
                    >
                        Bienvenue
                    </Title>
                </Float>

                <Float position-y={0 * generalScaleX} {...floatOptions}>
                    <Title
                        rotation={[0, 3.164, 0]}
                        size={60}
                        back
                        textProps={{ height: 40, scale: 0.01 * generalScaleX }}
                    >
                        sur mon
                    </Title>
                </Float>

                <Float position-y={-1 * generalScaleX} {...floatOptions}>
                    <Title
                        rotation={[0, 3.164, 0]}
                        size={80}
                        back
                        textProps={{ height: 40, scale: 0.01 * generalScaleX }}
                    >
                        Portfolio !
                    </Title>
                </Float>
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
            <group ref={stackRef}>
                <Float {...floatOptions}>
                    <Title
                        rotation={[0, 3.164, 0]}
                        size={30}
                        isMobile={isMobile}
                        textProps={{ height: 20, scale: 0.01 * generalScaleX }}
                    >
                        Ma stack technique
                    </Title>
                </Float>
                <IconsContainer
                    // rotation={[0, 3.164, 0]}
                    width={contentWidth}
                    icons={iconsWithText}
                    scalar={generalScaleX}
                    position-y={-1 * generalScaleX - margin}
                />
            </group>
        </group>
    );
}
