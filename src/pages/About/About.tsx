import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { AboutContent } from '@/pages/About/AboutContent.tsx';
import '@css/About.scss';
import { Center, Float, Text3D } from '@react-three/drei';
import montserrat from '@assets/fonts/Montserrat_Thin_Regular.json';
import { useMemo, useRef } from 'react';
import { Group } from 'three';
import { useLocation } from 'react-router';
import { useFrame, useThree } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import GitIcon from '@models/github_model.glb';
import LinkedIn from '@models/linkedin_model.glb';
import {
    Icons,
    preloadIcon,
} from '@/components/3DComponents/3DIcons/Icons.tsx';
import {
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_ICONS_POSITION_SETTINGS,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { easing } from 'maath';

preloadIcon([GitIcon, LinkedIn]);
let titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
let iconsPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
let contentPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;

export function About({ reducer, margin = 0.5 }) {
    const frameCountRef = useRef(0);
    const contentRef = useRef<Group>(null);
    const titleRef = useRef<Group>(null);
    const iconsRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);

    const { contentWidth, contentHeight } = reducer;

    // const dimensionsRef = useRef({ width, height });
    const refs = [contentRef.current, titleRef.current, iconsRef.current];

    const location = useLocation();
    const isActive = location.pathname === '/a-propos';

    if (isActive) {
        titlePosition = DESKTOP_HTML_TITLE_POSITION_SETTINGS(
            contentHeight,
            margin
        );
        contentPosition = [0, 0 - margin, 0];
        iconsPosition = DESKTOP_HTML_ICONS_POSITION_SETTINGS(
            contentHeight,
            contentWidth,
            margin
        );
    } else {
        titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
        contentPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
        iconsPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
    }

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
            floatingRange: [-0.1, 0.1] as [number, number],
        }),
        []
    );

    useFrame((_, delta) => {
        frameCountRef.current += 1;
        if (
            !groupRef.current ||
            !titleRef.current ||
            !contentRef.current ||
            !iconsRef.current
        )
            return;
        if (frameCountRef.current % (isActive ? 1 : 2) === 0) {
            easing.damp3(titleRef.current.position, titlePosition, 0.3, delta);
            easing.damp3(
                contentRef.current.position,
                contentPosition,
                0.3,
                delta
            );
            easing.damp3(iconsRef.current.position, iconsPosition, 0.3, delta);
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
    });

    return (
        <group ref={groupRef}>
            <Float {...floatOptions}>
                <Center
                    ref={titleRef}
                    rotation={[0, 3.164, 0]}
                    front
                    bottom
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
            <Center ref={contentRef}>
                <PageContainer pageName={'/a-propos'}>
                    <AboutContent onWheel={onScrollHandler} className="about" />
                </PageContainer>
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
            <Center ref={iconsRef}>
                <Float {...floatOptions}>
                    <Icons
                        model={GitIcon}
                        rotation={[0, 3, 0]}
                        position={[0, 0, 0]}
                    />
                </Float>
                <Float {...floatOptions}>
                    <Icons
                        model={LinkedIn}
                        rotation={[0, 3, 0]}
                        position={[-0.6, 0, 0]}
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
        </group>
    );
}
