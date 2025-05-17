import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer';
import { AboutContent } from '@/pages/About/AboutContent';
import '@css/About.scss';
import { Center, Float, useScroll } from '@react-three/drei';
import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Icons } from '@/components/3DComponents/3DIcons/Icons';
import {
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_ICONS_POSITION_SETTINGS,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config';
import { easing } from 'maath';
import { Title } from '@/components/3DComponents/Title/Title';
import { frustumChecker } from '@/utils/frustrumChecker';
import { PagesTypes } from '@/components/3DComponents/Scene/Scene';

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

type AboutTypes = {
    /** @defaultValue 0.5 */ margin?: number;
} & PagesTypes;

const LinkedIn = `${
    import.meta.env.BASE_URL
}assets/models/optimized/Linkedin_model.glb`;
const GitHub = `${
    import.meta.env.BASE_URL
}assets/models/optimized/Github_model.glb`;
let isActive = false;

/**
 * Contains the about page content/informations.
 *
 * @param visible - Current active page in the reducer
 * @param contentWidth - Width of the viewport
 * @param generalScaleX - General scale factor of the viewport scale from the reducer
 * @param contentHeight - Height of the viewport
 * @param margin **@default=0.5** - Margin between the elements
 */
const MemoizedAbout = memo(function About({
    contentWidth,
    contentHeight,
    generalScaleX,
    visible,
    margin = 0.5,
}: AboutTypes) {
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

    const scroll = useScroll();

    isActive = visible === 'about';

    useEffect(() => {
        if (isActive && contentHeight && contentWidth) {
            const titlePos = DESKTOP_HTML_TITLE_POSITION_SETTINGS(
                contentHeight,
                margin
            );
            titlePositionRef.current.set(
                titlePos[0] ?? 0,
                titlePos[1] ?? 0,
                titlePos[2] ?? 0
            );
            contentPositionRef.current.set(0, 0 - margin, 0);

            const iconPos = DESKTOP_HTML_ICONS_POSITION_SETTINGS(
                contentHeight,
                contentWidth,
                margin
            );
            iconsPositionRef.current.set(
                iconPos[0] ?? 0,
                iconPos[1] ?? 0,
                iconPos[2] ?? 0
            );
        } else {
            titlePositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
            contentPositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
            iconsPositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
        }
    }, [contentWidth, contentHeight, visible]);

    /**
     * Reset scroll position to reinitialize the camera
     */
    useLayoutEffect(() => {
        scroll.el.scrollTo({ top: 1, behavior: 'instant' });
    }, [visible]);
    // const settingsConfig = useMemo(() => {
    //     return {
    //         HTMLSettings: folder(
    //             {
    //                 SCALE: { value: 1, min: 0, max: 10, step: 0.1 },
    //                 PRESENCE_CIRCLE: true,
    //                 PRESENCE_RADIUS: { value: 0.5, min: 0, max: 10, step: 0.1 },
    //                 COLLISIONS: true,
    //             },
    //             { collapsed: true }
    //         ),
    //     };
    // }, []);

    // const [{ ...HTMLSETTINGS }, set] = useControls(
    //     'HTML SETTINGS',
    //     () => settingsConfig
    // );

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
                    scale={generalScaleX}
                >
                    A propos de moi
                </Title>
            </Float>

            <group ref={contentRef}>
                {contentRef && (
                    <Center>
                        <PageContainer pageName={'/a-propos'}>
                            <AboutContent
                                onWheel={onScrollHandler}
                                className="about"
                            />
                        </PageContainer>
                    </Center>
                )}
            </group>

            <group ref={iconsRef}>
                <Center>
                    <Float {...floatOptions}>
                        <Icons
                            model={GitHub}
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
                </Center>
            </group>
        </group>
    );
});

export default MemoizedAbout;
