import '@css/About.scss';
import {
    Center,
    Float,
    shaderMaterial,
    Text,
    useScroll,
} from '@react-three/drei';
import { memo, useEffect, useRef } from 'react';
import { Color, Group } from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { Icons } from '@/components/3DComponents/3DIcons/Icons';
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

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

const LinkedIn = `${
    import.meta.env.BASE_URL
}assets/models/optimized/Linkedin_model.glb`;
const GitHub = `${
    import.meta.env.BASE_URL
}assets/models/optimized/Github_model.glb`;
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
            // contentPositionRef.current.set(
            //     2.8 * generalScaleX,
            //     contentHeight * 0.1,
            //     0
            // );
            // contentPositionRef.current.set(0, 0 - margin, 0);

            // const iconPos = DESKTOP_HTML_ICONS_POSITION_SETTINGS(
            //     contentRef.current.userData.contentSize.y,
            //     contentWidth,
            //     margin
            // );
            // iconsPositionRef.current.set(
            //     iconPos[0] ?? 0,
            //     iconPos[1] ?? 0,
            //     iconPos[2] ?? 0
            // );
        } else {
            titlePositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
            contentPositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
            iconsPositionRef.current.copy(DEFAULT_PROJECTS_POSITION_SETTINGS);
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
            scroll.el.scrollTo({ top: 0, behavior: 'instant' });
            count++;
        }

        if (!isActive && count > 0) {
            count = 0;
        }

        if (materials.current instanceof Map) {
            materials.current.forEach((material) => {
                if (material && material.uniforms) {
                    material.uniforms.time.value = state.clock.getElapsedTime();

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

        frustumChecker(
            // [titleRef.current, iconsRef.current],
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
                if (
                    contentRef.current.userData.contentSize &&
                    frameCountRef.current % 60 === 0
                ) {
                    const contentSizeY =
                        contentRef.current.userData.contentSize.y;
                    iconsPositionRef.current.set(0, -contentSizeY - margin, 0);
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
        }
    });

    return (
        <group visible={isActive} ref={groupRef}>
            <FloatingTitle
                ref={titleRef}
                bottom
                size={40}
                scale={generalScaleX}
            >
                A propos de moi
            </FloatingTitle>

            <group ref={contentRef} userData={{ preventClipping: true }}>
                {aboutText.map((text, index) => (
                    <GridLayout
                        width={contentWidth ?? 0}
                        key={'about-' + index * Math.random() + '-grid'}
                        name={'about-' + index + '-grid'}
                        length={aboutText.length}
                        index={index}
                        scalar={generalScaleX}
                        type={text.type}
                        options={gridOptions}
                    >
                        <animated.group
                            {...useSpring({
                                from: {
                                    scale: 0.1,
                                    opacity: 0,
                                },
                                to: { scale: 1, opacity: 1 },
                                delay: index * 500,
                                config: {
                                    mass: 1,
                                    tension: 280,
                                    friction: 30,
                                },
                            })}
                        >
                            {/* <Suspense fallback={null}> */}
                            {text.type === 'title' && (
                                <Text
                                    position={[0, 0, -0.1]}
                                    fontSize={
                                        (isMobile ? 0.6 : 0.5) * generalScaleX
                                    }
                                    outlineWidth={isMobile ? 0.002 : 0.002}
                                    outlineColor="rgba(0, 0, 0, 0.01)"
                                    anchorY="top"
                                    maxWidth={contentWidth - 0.5}
                                    font={importedNormalFont}
                                    userData={{ isWrappedText: true }}
                                >
                                    {text.text}
                                    {/* <meshStandardMaterial
                                        color="#2a5298"
                                        metalness={0.8}
                                        roughness={0.2}
                                        envMapIntensity={2.5}
                                    /> */}
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
                                    position={[0, 0, -0.3]}
                                    fontSize={
                                        (isMobile ? 0.4 : 0.2) * generalScaleX
                                    }
                                    outlineWidth={isMobile ? 0.002 : 0.002}
                                    outlineColor="rgba(0, 0, 0, 0.01)"
                                    color={'black'}
                                    textAlign="justify"
                                    anchorY="top"
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
                            {/* </Suspense> */}
                        </animated.group>
                    </GridLayout>
                ))}
                {/* {contentRef && (
                    <Center>
                        <BillboardPageContainer pageName={'/a-propos'}>
                            <AboutContent
                                onWheel={onScrollHandler}
                                className="about"
                            />
                        </BillboardPageContainer>
                    </Center>
                )} */}
            </group>
            {/* <Text>test</Text> */}

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

// Créer un matériau personnalisé pour les textes importants
const GradientTextMaterial = shaderMaterial(
    {
        color1: new Color('#4a6fa5'),
        color2: new Color('#6a5acd'),
        time: 0,
    },
    // Vertex shader - animation subtile
    `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    // Fragment shader - dégradé animé
    `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        varying vec2 vUv;
        void main() {
            float mixValue = sin(vUv.y * 3.14 + time * 0.5) * 0.5 + 0.5;
            vec3 color = mix(color1, color2, mixValue);
            gl_FragColor = vec4(color, 1.0);
        }
    `
);

extend({ GradientTextMaterial });
