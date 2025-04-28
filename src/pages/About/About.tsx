import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { AboutContent } from '@/pages/About/AboutContent.tsx';
import '@css/About.scss';
import { Center, Float, Text3D, useCursor } from '@react-three/drei';
import montserrat from '@assets/fonts/Montserrat_Thin_Regular.json';
import linkedIn from '@icons/linkedin.svg';
import { GitHubIcon } from '@/components/3DComponents/3DIcons/GitHubIcon.tsx';
import { use, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Group } from 'three/examples/jsm/libs/tween.module.js';
import { useLocation } from 'react-router';
import { useFrame, useThree } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import { SpherePresenceHelper } from '@/components/3DComponents/SpherePresence/SpherePresence.tsx';
import { LinkedInIcon } from '@/components/3DComponents/3DIcons/LinkedInIcon.tsx';
import GitIcon from '@models/github_model.glb';
import LinkedIn from '@models/linkedin_model.glb';
import { Icons } from '@/components/3DComponents/3DIcons/Icons.tsx';

export function About({ margin = 0.5 }) {
    const frameCountRef = useRef(0);
    const contentRef = useRef<Group>(null);
    const titleRef = useRef<Group>(null);
    const iconsRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);

    const { width, height } = useThree((state) => state.viewport);

    const refs = [contentRef.current, titleRef.current, iconsRef.current];

    const location = useLocation();
    const isActive = location.pathname === '/a-propos';

    const settingsConfig = useMemo(() => {
        return {
            HTMLSettings: folder(
                {
                    SCALE: { value: 1, min: 0, max: 10, step: 0.1 },
                    PRESENCE_CIRCLE: true,
                    PRESENCE_RADIUS: { value: 0.5, min: 0, max: 10, step: 0.1 },
                    COLLISIONS: true,
                },
                { collapsed: true }
            ),
        };
    }, []);

    const [{ ...HTMLSETTINGS }, set] = useControls(
        'HTML SETTINGS',
        () => settingsConfig
    );

    // const { SETTINGS } = useControls({
    //     SETTINGS: {
    //         PRESENCE_CIRCLE: true,
    //         PRESENCE_RADIUS: 0.5,
    //         CONTAINER_SCALE: 1,
    //     },
    // });
    const floatOptions = useMemo(
        () => ({
            autoInvalidate: true,
            speed: 1.5,
            rotationIntensity: 0.5,
            floatIntensity: 0.5,
            floatingRange: [-0.1, 0.1],
        }),
        []
    );

    useCursor(true, 'pointer', 'auto');

    useFrame(() => {
        if (groupRef.current) {
            if (isActive && frameCountRef.current % 10 === 0) {
                // console.log(refs);
                // console.log(groupRef.current.children);
                groupRef.current.children.forEach((element, index) => {
                    // console.log(element);
                    // if (index === i) return;
                    // const inRangeItem =
                    //     position.distanceTo(element.ref.current.position) -
                    //     effectiveRadius(item, element);
                    // // Collision handler
                    // const newScale = handleNeighborCollision(
                    //     i,
                    //     index,
                    //     inRangeItem,
                    //     element.presenceRadius,
                    //     SETTINGS.CONTAINER_SCALE
                    // );
                    // if (newScale !== null) {
                    //     SETTINGS.set({ CONTAINER_SCALE: newScale });
                    // }
                });
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* <Center rotation={[0, 3.22, 0]} front position={[0, 3.8, 0]}> */}
            <Center
                // ref={titleRef}
                rotation={[0, 3.164, 0]}
                front
                bottom
                // position={[2 / width, height / 2 + margin, 0]}
                position={[0, height / 2 + margin, 0]}
                // position={[0, 3.8, 0]}
                scale={HTMLSETTINGS.SCALE}
            >
                <Text3D
                    castShadow
                    bevelEnabled
                    curveSegments={32}
                    bevelSegments={5}
                    bevelThickness={1}
                    bevelSize={1}
                    bevelOffset={0}
                    scale={0.01}
                    size={30}
                    height={1}
                    smooth={1}
                    font={montserrat}
                    as={'H1'}
                >
                    A propos de moi
                    <meshNormalMaterial />
                </Text3D>
                <SpherePresenceHelper
                    visible={HTMLSETTINGS.PRESENCE_CIRCLE}
                    radius={[
                        0.01 * 30,
                        // SETTINGS.PRESENCE_RADIUS * titleRef.current?.scale,
                        32,
                    ]}
                    position={[1.5, 0.1, 0]}
                    color={'red'}
                />
            </Center>
            <Center>
                <group ref={contentRef}>
                    <PageContainer pageName={'/a-propos'}>
                        <AboutContent
                            onWheel={onScrollHandler}
                            className="about"
                        />
                    </PageContainer>
                    <SpherePresenceHelper
                        visible={HTMLSETTINGS.PRESENCE_CIRCLE}
                        radius={[
                            0.7 * 4.184922103794956,
                            // SETTINGS.PRESENCE_RADIUS * titleRef.current?.scale,
                            32,
                        ]}
                        color={'red'}
                    />
                </group>
            </Center>

            <Center
                position={[width / 2 - margin * 2.5, -height / 2 - margin, 0]}
            >
                {/* <Center bottom right position={[2, -4.19, 0]}> */}
                {/* <group ref={iconsRef} position={[2, -4.19, 0]}> */}
                <Float {...floatOptions}>
                    {/* <GitHubIcon scale={70} position={[0, 0, 0]} /> */}
                    <Icons model={GitIcon} position={[0, 0, 0]} />
                </Float>
                <Float {...floatOptions}>
                    <Icons
                        model={LinkedIn}
                        rotation={[0, 3, 0]}
                        position={[-0.3, 0, 0]}
                    />
                </Float>

                <SpherePresenceHelper
                    visible={HTMLSETTINGS.PRESENCE_CIRCLE}
                    radius={[
                        HTMLSETTINGS.PRESENCE_RADIUS * HTMLSETTINGS.SCALE,
                        32,
                    ]}
                    color={'red'}
                />
            </Center>
        </group>
    );
}
