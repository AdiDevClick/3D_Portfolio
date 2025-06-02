import '@css/About.scss';
import { shaderMaterial, Text, useScroll } from '@react-three/drei';
import { memo, Suspense, useEffect, useRef, useState } from 'react';
import { Color, Group } from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import {
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config';
import { easing } from 'maath';
import { frustumChecker } from '@/utils/frustrumChecker';
import { AboutTypes } from '@/components/3DComponents/Html/HtmlPagesTypes';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import { GridLayout } from '@/components/3DComponents/Grid/GridLayout';
import aboutText from '@data/about-texts.json';
import { importedNormalFont } from '@/configs/3DFonts.config';
import { useSpring, animated } from '@react-spring/three';
import { ContactIconsContainer } from '@/components/3DComponents/Contact/ContactIconsContainer';

let isActive = false;
let count = 0;

/**
 * Contains the about page content/informations.
 *
 * @param visible - Current active page in the reducer
 * @param contentWidth - Width of the viewport
 * @param generalScaleX - General scale factor of the viewport scale from the reducer
 * @param contentHeight - Height of the viewport
 * @param margin **@default=0.5** - Margin between the elements
 * @param isMobile - Is the device mobile
 */
const MemoizedAbout = memo(function About({
    contentWidth,
    contentHeight,
    generalScaleX,
    visible,
    isMobile,
    margin = 0.5,
}: AboutTypes) {
    const gridOptions = {
        columnsNumber: 1,
        rowOffset: 0,
        marginX: 2.5,
        marginY: isMobile ? 1.5 : 1.5,
        windowMargin: 1.5,
        dynamicHeightContent: true,
    };

    const frameCountRef = useRef(0);
    const contentRef = useRef<Group>(null);
    const titleRef = useRef<Group>(null);
    const iconsRef = useRef<Group>(null);
    const groupRef = useRef<Group>(null);
    const materials = useRef(new Map());

    const titlePositionRef = useRef(DEFAULT_PROJECTS_POSITION_SETTINGS.clone());
    const iconsPositionRef = useRef(DEFAULT_PROJECTS_POSITION_SETTINGS.clone());
    const contentPositionRef = useRef(
        DEFAULT_PROJECTS_POSITION_SETTINGS.clone()
    );

    const { viewport } = useThree();
    const [animationsEnabled, setAnimationsEnabled] = useState(false);
    const scroll = useScroll();

    isActive = visible === 'about';

    useEffect(() => {
        if (isActive && contentHeight && contentWidth && contentRef.current) {
            const titlePos = DESKTOP_HTML_TITLE_POSITION_SETTINGS(
                contentHeight,
                margin
            );

            titlePositionRef.current.set(
                titlePos[0] ?? 0,
                titlePos[1] ?? 0,
                titlePos[2] ?? 0
            );
            contentPositionRef.current.set(0, contentHeight * 0.1, 0);
        } else {
            titlePositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
            contentPositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
        }
    }, [contentWidth, contentHeight, visible, isActive, margin]);

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
    useEffect(() => {
        if (!iconsRef.current) return;
        iconsRef.current.position.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
        setAnimationsEnabled(true);
    }, []);

    if (count > 0) count = 0;

    useFrame((state, delta) => {
        if (
            !groupRef.current ||
            !titleRef.current ||
            !contentRef.current ||
            !iconsRef.current
        )
            return;
        frameCountRef.current += 1;

        if (isActive && count <= 0) {
            scroll.offset = 0;
            scroll.delta = 0;
            scroll.el.scrollTo({ top: 0, behavior: 'instant' });
            count++;
            // groupRef.current.position.y = 0;
            // groupRef.current.updateMatrixWorld(true);
        }

        if (!isActive && count > 0) {
            count = 0;
        }

        frustumChecker(
            [titleRef.current, iconsRef.current, contentRef.current],
            state,
            frameCountRef.current,
            false
        );

        if (
            // frameCountRef.current %
            isActive ||
            groupRef.current.visible
            // 0
        ) {
            // if (
            //     frameCountRef.current %
            //         (isActive || groupRef.current.visible ? 1 : 200) ===
            //     0
            // ) {
            if (contentRef.current.visible || groupRef.current.visible) {
                easing.damp3(
                    contentRef.current.position,
                    contentPositionRef.current,
                    0.3,
                    delta
                );
            }
            if (iconsRef.current.visible || groupRef.current.visible) {
                if (
                    contentRef.current.userData.contentSize &&
                    frameCountRef.current % 60 === 0
                ) {
                    const contentSizeY =
                        contentRef.current.userData.contentSize.y;
                    if (-contentSizeY - margin !== iconsPositionRef.current.y) {
                        iconsPositionRef.current.set(
                            0,
                            -contentSizeY - margin,
                            0
                        );
                    }
                }

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

            if (frameCountRef.current % 40 === 0) {
                if (materials.current instanceof Map) {
                    materials.current.forEach((material) => {
                        if (material && material.uniforms) {
                            material.uniforms.time.value =
                                state.clock.getElapsedTime();

                            // animating the gradient colors
                            const t = state.clock.getElapsedTime() * 0.2;
                            material.uniforms.color1.value.setHSL(
                                Math.sin(t) * 0.1 + 0.6,
                                0.7,
                                0.5
                            );

                            material.uniforms.color2.value.setHSL(
                                Math.cos(t) * 0.1 + 0.8,
                                0.8,
                                0.6
                            );
                        }
                    });
                }
            }
        }
    });
    return (
        <group visible={isActive} ref={groupRef}>
            <FloatingTitle
                text="A propos de moi"
                ref={titleRef}
                bottom
                size={40}
                name="about-title"
                scalar={isMobile ? generalScaleX * 1.2 : generalScaleX}
            />

            <group
                ref={contentRef}
                userData={{ preventClipping: true }}
                position={DEFAULT_PROJECTS_POSITION_SETTINGS.clone()}
            >
                {aboutText.map((text, index) => {
                    return (
                        <GridLayout
                            width={contentWidth ?? 0}
                            key={'about-' + index + '-grid'}
                            // key={'about-' + index * Math.random() + '-grid'}
                            name={'about-' + index + '-grid'}
                            length={aboutText.length}
                            index={index}
                            scalar={generalScaleX}
                            type={text.type}
                            options={gridOptions}
                        >
                            <animated.group
                                // {...animation}
                                {...useSpring({
                                    from: {
                                        // transform:
                                        // 'scale(0.1) translateY(-20px)',
                                        // scale: 1,
                                        // scale: 0.1,
                                        position: [-20, 10, -80],
                                        opacity: 0,
                                    },
                                    to: {
                                        // transform: 'scale(1) translateY(0px)',
                                        // scale: 1,
                                        position: [0, 0, 0],
                                        opacity: 1,
                                    },
                                    delay: index * 500,
                                    config: {
                                        mass: 1,
                                        tension: 280,
                                        friction: 30,
                                    },
                                })}
                            >
                                <Suspense fallback={null}>
                                    {text.type === 'title' && (
                                        <Text
                                            // lineHeight={1.3}
                                            position={[-0.05, 0, -0.1]}
                                            fontSize={
                                                (isMobile ? 0.6 : 0.5) *
                                                generalScaleX
                                            }
                                            outlineWidth={
                                                isMobile ? 0.002 : 0.002
                                            }
                                            outlineColor="black"
                                            // outlineColor="rgba(0, 0, 0, 0.01)"
                                            anchorY="top"
                                            textAlign="center"
                                            anchorX="center"
                                            maxWidth={contentWidth - 0.6}
                                            // maxWidth={viewport.width - 0.5}
                                            font={importedNormalFont}
                                            userData={{ isWrappedText: true }}
                                        >
                                            {text.text}
                                            <gradientTextMaterial
                                                ref={(ref) => {
                                                    if (ref)
                                                        materials.current.set(
                                                            index,
                                                            ref
                                                        );
                                                }}
                                            />
                                        </Text>
                                    )}
                                    {text.type === 'text' && (
                                        <Text
                                            lineHeight={isMobile ? 1.3 : 1.4}
                                            position={[0, 0, -0.3]}
                                            fontSize={
                                                (isMobile ? 0.4 : 0.2) *
                                                generalScaleX
                                            }
                                            outlineWidth={
                                                isMobile ? 0.002 : 0.002
                                            }
                                            outlineColor="black"
                                            // outlineColor="rgba(0, 0, 0, 0.01)"
                                            color={'black'}
                                            textAlign="left"
                                            anchorY="top"
                                            anchorX="center"
                                            fontWeight={700}
                                            maxWidth={
                                                isMobile
                                                    ? contentWidth - 0.7
                                                    : contentWidth / 2
                                            }
                                            font={importedNormalFont}
                                            userData={{ isWrappedText: true }}
                                        >
                                            {text.text}
                                        </Text>
                                    )}
                                </Suspense>
                            </animated.group>
                        </GridLayout>
                    );
                })}
            </group>

            <ContactIconsContainer
                // key={`about-icons`}
                ref={iconsRef}
                scalar={generalScaleX}
                isMobile={isMobile}
                tooltips={false}
                // position={DEFAULT_PROJECTS_POSITION_SETTINGS.clone()}
            />
        </group>
    );
});

export default MemoizedAbout;

const GradientTextMaterial = shaderMaterial(
    {
        color1: new Color('#4a6fa5'),
        color2: new Color('#6a5acd'),
        time: 0,
    },
    // Vertex shader -
    `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    // Fragment shader -
    `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
            float mixValue = sin(vUv.y * 3.14 + time * 0.5) * 0.5 + 0.5;
            vec3 color = mix(color1, color2, mixValue);
            gl_FragColor = vec4(color, 1.0);
        }
    `
);

extend({ GradientTextMaterial });
