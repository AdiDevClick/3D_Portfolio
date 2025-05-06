import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { AboutContent } from '@/pages/About/AboutContent.tsx';
import '@css/About.scss';
import { Center, Float } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { Group } from 'three';
import { useLocation } from 'react-router';
import { useFrame } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import GitIcon from '@models/optimized/Github_mobile_model.glb';
import LinkedIn from '@models/optimized/Linkedin_model.glb';
import {
    Icons,
    preloadIcons,
} from '@/components/3DComponents/3DIcons/Icons.tsx';
import {
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_ICONS_POSITION_SETTINGS,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { easing } from 'maath';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { frustumChecker } from '@/utils/frustrumChecker.ts';

preloadIcons([GitIcon, LinkedIn]);

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

let titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
let iconsPosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
let contentPosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

type AboutTypes = {
    reducer: ReducerType;
    /** @defaultValue 0.5 */
    margin?: number;
};

/**
 * Contains the about page content/informations.
 *
 * @param reducer - Reducer type for the carousel
 * @param margin **@default=0.5** - Margin between the elements
 */
export function About({ reducer, margin = 0.5 }: AboutTypes) {
    const frameCountRef = useRef(0);
    const contentRef = useRef<Group>(null);
    const titleRef = useRef<Group>(null);
    const iconsRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);

    const titlePositionRef = useRef(DEFAULT_PROJECTS_POSITION_SETTINGS.clone());
    const iconsPositionRef = useRef(DEFAULT_PROJECTS_POSITION_SETTINGS.clone());
    const contentPositionRef = useRef(
        DEFAULT_PROJECTS_POSITION_SETTINGS.clone()
    );

    const { contentWidth, contentHeight } = reducer;

    const location = useLocation();
    const isActive = location.pathname === '/a-propos';

    // if (isActive) {
    //     const titlePos = DESKTOP_HTML_TITLE_POSITION_SETTINGS(
    //         contentHeight ?? 0,
    //         margin
    //     );

    //     titlePosition.set(titlePos[0], titlePos[1], titlePos[2]);
    //     contentPosition.set(0, 0 - margin, 0);
    //     const iconPos = DESKTOP_HTML_ICONS_POSITION_SETTINGS(
    //         contentHeight ?? 0,
    //         contentWidth ?? 0,
    //         margin
    //     );
    //     iconsPosition.set(iconPos[0], iconPos[1], iconPos[2]);
    // } else {
    //     titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
    //     contentPosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
    //     iconsPosition = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
    // }

    useEffect(() => {
        if (isActive && contentHeight && contentWidth) {
            const titlePos = DESKTOP_HTML_TITLE_POSITION_SETTINGS(
                contentHeight,
                margin
            );

            titlePositionRef.current.set(titlePos[0], titlePos[1], titlePos[2]);
            contentPositionRef.current.set(0, 0 - margin, 0);

            const iconPos = DESKTOP_HTML_ICONS_POSITION_SETTINGS(
                contentHeight,
                contentWidth,
                margin
            );
            iconsPositionRef.current.set(iconPos[0], iconPos[1], iconPos[2]);
        } else {
            titlePositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
            contentPositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
            iconsPositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
        }
    }, [isActive, contentWidth, contentHeight, margin]);

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

    useFrame((state, delta) => {
        if (
            !groupRef.current ||
            !titleRef.current ||
            !contentRef.current ||
            !iconsRef.current
        )
            return;
        frameCountRef.current += 1;

        frustumChecker(
            [titleRef.current, iconsRef.current, contentRef.current],
            state,
            frameCountRef.current,
            false
        );

        if (
            frameCountRef.current %
                (isActive || groupRef.current.visible ? 1 : 200) ===
            0
        ) {
            if (contentRef.current.visible || groupRef.current.visible) {
                easing.damp3(
                    contentRef.current.position,
                    contentPositionRef.current,
                    0.3,
                    delta
                );
            }
            if (iconsRef.current.visible || groupRef.current.visible) {
                easing.damp3(
                    iconsRef.current.position,
                    iconsPositionRef.current,
                    0.3,
                    delta
                );
            }
            if (titleRef.current.visible || groupRef.current.visible) {
                easing.damp3(
                    titleRef.current.position,
                    titlePositionRef.current,
                    0.3,
                    delta
                );
            }
        }
    });

    return (
        <group visible={isActive} ref={groupRef}>
            <Float {...floatOptions}>
                <Title
                    ref={titleRef}
                    rotation={[0, 3.164, 0]}
                    bottom
                    scale={HTMLSETTINGS.SCALE}
                >
                    A propos de moi
                </Title>
            </Float>

            <group ref={contentRef}>
                <Center>
                    <PageContainer pageName={'/a-propos'}>
                        <AboutContent
                            onWheel={onScrollHandler}
                            className="about"
                        />
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
            </group>

            <group ref={iconsRef}>
                <Center>
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
        </group>
    );
}
