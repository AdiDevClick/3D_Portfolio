import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { AboutContent } from '@/pages/About/AboutContent.tsx';
import '@css/About.scss';
import {
    Center,
    Float,
    Html,
    Scroll,
    Text,
    Text3D,
    useScroll,
} from '@react-three/drei';
import montserrat from '@assets/fonts/Montserrat_Thin_Regular.json';
import { useMemo, useRef, useState } from 'react';
import { Group } from 'three/examples/jsm/libs/tween.module.js';
import { useLocation } from 'react-router';
import { useFrame, useThree } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import { SpherePresenceHelper } from '@/components/3DComponents/SpherePresence/SpherePresence.tsx';
import GitIcon from '@models/github_model.glb';
import LinkedIn from '@models/linkedin_model.glb';
import {
    Icons,
    preloadIcon,
} from '@/components/3DComponents/3DIcons/Icons.tsx';
import {
    DEFAULT_HTML_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_CONTAINER_ROTATION,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { easing } from 'maath';

preloadIcon([GitIcon, LinkedIn]);

export function About({ margin = 0.5 }) {
    const frameCountRef = useRef(0);
    const contentRef = useRef<Group>(null);
    const titleRef = useRef<Group>(null);
    const iconsRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);

    const scroll = useScroll();
    const [hovered, setHovered] = useState(false);
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

    useFrame((_, delta) => {
        if (groupRef.current) {
            if (frameCountRef.current % 50 === 0) {
                easing.damp3(
                    titleRef.current?.position,
                    isActive
                        ? DESKTOP_HTML_TITLE_POSITION_SETTINGS(height, margin)
                        : DEFAULT_PROJECTS_POSITION_SETTINGS,
                    0.3,
                    delta
                );
                easing.damp3(
                    contentRef.current?.position,
                    isActive
                        ? [0, 0 - margin, 0]
                        : DEFAULT_PROJECTS_POSITION_SETTINGS,
                    0.3,
                    delta
                );
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
            {/* <Scroll> */}
            <Float {...floatOptions}>
                <Center
                    ref={titleRef}
                    rotation={[0, 3.164, 0]}
                    front
                    bottom
                    // position={[2 / width, height / 2 + margin, 0]}
                    // position={[0, height / 2 + margin, 0]}
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
                    {/* <SpherePresenceHelper
                        visible={HTMLSETTINGS.PRESENCE_CIRCLE}
                        radius={[
                            0.01 * 30,
                            // SETTINGS.PRESENCE_RADIUS * titleRef.current?.scale,
                            32,
                        ]}
                        position={[1.5, 0.1, 0]}
                        color={'red'}
                    /> */}
                </Center>
            </Float>
            {/* </Scroll> */}
            <Center ref={contentRef}>
                <PageContainer pageName={'/a-propos'}>
                    <AboutContent onWheel={onScrollHandler} className="about" />
                </PageContainer>
                {/* <Text fontSize={0.2} anchorY="bottom" color={'black'}>
                    test
                </Text> */}
                {/* <SpherePresenceHelper
                        // position={[0, -10, 0]}
                        // position={[0, 0.8, 0]}
                        visible={HTMLSETTINGS.PRESENCE_CIRCLE}
                        radius={[
                            0.7 * 4.168184893509044,
                            // SETTINGS.PRESENCE_RADIUS * titleRef.current?.scale,
                            32,
                        ]}
                        color={'red'}
                    /> */}
            </Center>
            {/* <Scroll> */}
            <Center
                position={[width / 2 - margin * 2.5, -height / 2 - margin, 0]}
            >
                {/* <Center bottom right position={[2, -4.19, 0]}> */}
                {/* <group ref={iconsRef} position={[2, -4.19, 0]}> */}
                <Float {...floatOptions}>
                    {/* {hovered && (
                        <Text
                            fontSize={0.1}
                            color="black"
                            anchorX="left"
                            rotation={[0, 3, 0]}
                            position={[0, 0.6, 0]}
                        >
                            Visiter GitHub
                        </Text>
                    )} */}
                    <Icons
                        model={GitIcon}
                        rotation={[0, 3, 0]}
                        position={[0, 0, 0]}
                        // onPointerOver={() => setHovered(true)}
                        // onPointerOut={() => setHovered(false)}
                    />
                </Float>
                <Float {...floatOptions}>
                    {/* {hovered && (
                        // <Text
                        //     fontSize={0.1}
                        //     color="black"
                        //     anchorX="left"
                        //     rotation={[0, 3, 0]}
                        //     position={[-0.6, 0.6, 0]}
                        // >
                        //     Visiter Linked In
                        // </Text>
                        <Html
                            position={[0, -1.8, 0]}
                            // center
                            pointerEvents="none"
                        >
                            <div
                                style={{
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '3px',
                                    fontSize: '12px',
                                    whiteSpace: 'nowrap',
                                    // transform: 'translateY(-120%)',
                                    fontFamily: 'sans-serif',
                                }}
                            >
                                {'linkInfo.name'}
                            </div>
                        </Html>
                    )} */}
                    <Icons
                        model={LinkedIn}
                        rotation={[0, 3, 0]}
                        position={[-0.6, 0, 0]}
                        // onPointerOver={() => setHovered(true)}
                        // onPointerOut={() => setHovered(false)}
                    />
                </Float>

                {/* <SpherePresenceHelper
                    visible={HTMLSETTINGS.PRESENCE_CIRCLE}
                    radius={[
                        HTMLSETTINGS.PRESENCE_RADIUS * HTMLSETTINGS.SCALE,
                        32,
                    ]}
                    color={'red'}
                /> */}
            </Center>
            {/* </Scroll> */}
        </group>
    );
}
