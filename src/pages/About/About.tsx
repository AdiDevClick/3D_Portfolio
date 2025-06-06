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
import { animateItem } from '@/hooks/animation/useAnimateItems';

const GradientTextMaterial = shaderMaterial(
    {
        color1: new Color('#0d47a1'),
        color2: new Color('#FFFFFF'),
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
    varying vec2 vUv;
    void main() {
            float u_time = time;
            float cycleTime = mod(u_time, 8.0);

            if (cycleTime <= 3.0) {
                float wavePosition = (cycleTime / 3.0) * 2.0 - 0.5; // -0.5 à 1.5
                float distance = abs(vUv.x - wavePosition);
                float wave = 1.0 - smoothstep(0.0, 0.3, distance); // Vague localisée
                
                float fadeIn = smoothstep(0.0, 0.5, cycleTime);
                float fadeOut = 1.0;
                if (cycleTime > 2.5) {
                    fadeOut = 1.0 - smoothstep(2.5, 3.0, cycleTime);
                }
                
                float mixValue = wave * fadeIn * fadeOut;
                gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
            } else {
                gl_FragColor = vec4(color1, 1.0);
            }
        }
    `
);

extend({ GradientTextMaterial });

let isActive = false;

const ANIM_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.3,
    type: 'position' as const,
};

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
            [
                groupRef.current,
                titleRef.current,
                iconsRef.current,
                contentRef.current,
            ],
            state,
            frameCountRef.current,
            false
        );

        if (isActive) {
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
            }

            if (frameCountRef.current % 10 === 0) {
                if (materials.current instanceof Map) {
                    materials.current.forEach((material) => {
                        if (material && material.uniforms) {
                            material.uniforms.time.value =
                                state.clock.getElapsedTime();
                        }
                    });
                }
            }
        }

        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: contentRef,
                effectOn: contentPositionRef.current,
            },
            isActive,
            groupRef,
            delta,
        });

        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: titleRef,
                effectOn: titlePositionRef.current,
            },
            isActive,
            groupRef,
            delta,
        });

        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: iconsRef,
                effectOn: iconsPositionRef.current,
            },
            isActive,
            groupRef,
            delta,
        });
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
                                                isMobile ? 0.005 : 0.004
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
