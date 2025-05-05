import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { AboutContent } from '@/pages/About/AboutContent.tsx';
import '@css/About.scss';
import { Center, Float } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import { Group } from 'three';
import { useLocation } from 'react-router';
import { useFrame } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import GitIcon from '@models/optimized/github_model.glb';
import LinkedIn from '@models/optimized/linkedin_model.glb';
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
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon.tsx';

preloadIcons([GitIcon, LinkedIn]);

let titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
let iconsPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
let contentPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;

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

    const { contentWidth, contentHeight } = reducer;

    // const dimensionsRef = useRef({ width, height });
    const refs = [contentRef.current, titleRef.current, iconsRef.current];

    const location = useLocation();
    const isActive = location.pathname === '/a-propos';

    if (isActive) {
        titlePosition = DESKTOP_HTML_TITLE_POSITION_SETTINGS(
            contentHeight ?? 0,
            margin
        );
        contentPosition = [0, 0 - margin, 0];
        // contentPosition = new Vector3(0, 0 - margin, 0);
        iconsPosition = DESKTOP_HTML_ICONS_POSITION_SETTINGS(
            contentHeight ?? 0,
            contentWidth ?? 0,
            margin
        );
    } else {
        titlePosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
        contentPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
        iconsPosition = DEFAULT_PROJECTS_POSITION_SETTINGS;
    }

    // useEffect(() => {
    //     if (!titleRef.current || !contentRef.current || !iconsRef.current)
    //         return;
    //     if (isActive) return;
    //     titleRef.current.position.set(
    //         titlePosition[0],
    //         titlePosition[1],
    //         titlePosition[2]
    //     );
    //     contentRef.current.position.set(
    //         contentPosition[0],
    //         contentPosition[1],
    //         contentPosition[2]
    //     );
    //     iconsRef.current.position.set(
    //         iconsPosition[0],
    //         iconsPosition[1],
    //         iconsPosition[2]
    //     );
    // }, [isActive]);

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
        if (
            !groupRef.current ||
            !titleRef.current ||
            !contentRef.current ||
            !iconsRef.current
        )
            return;
        frameCountRef.current += 1;

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
            <Suspense fallback={null}>
                <group>
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
                </group>
            </Suspense>

            <Suspense fallback={null}>
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
            </Suspense>

            <Suspense fallback={<PlaceholderIcon />}>
                <group ref={iconsRef}>
                    <Center>
                        <Suspense fallback={null}>
                            <group>
                                <Float {...floatOptions}>
                                    <Icons
                                        model={GitIcon}
                                        rotation={[0, 3, 0]}
                                        position={[0, 0, 0]}
                                    />
                                </Float>
                            </group>
                        </Suspense>
                        <Suspense fallback={null}>
                            <group>
                                <Float {...floatOptions}>
                                    <Icons
                                        model={LinkedIn}
                                        rotation={[0, 3, 0]}
                                        position={[-0.6, 0, 0]}
                                    />
                                </Float>
                            </group>
                        </Suspense>

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
            </Suspense>
        </group>
    );
}
