import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh';
import { Title } from '@/components/3DComponents/Title/Title';
import { Center, Float, useCursor } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { Group } from 'three';
import { JSX, use, useMemo, useRef, useState } from 'react';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';
import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
import { useSpring, animated } from '@react-spring/three';
import { IconsContainerContext } from '@/api/contexts/IconsContainerProvider';
import { IconsContainerContextTypes } from '@/components/3DComponents/3DIcons/IconsContainer';
// import { easing } from 'maath';
type IconsTypes = {
    model: string;
    datas: { name: string; text: string };
    // scalar: number;
    // index: number;
    /** @defaultValue 0.5 */
    // margin?: number;
    // isMobile: boolean;
    /** @defaultValue 100 */
    // iconScale?: number;
    // eventsList?: {
    //     onClick?: (event: ThreeEvent<MouseEvent>) => void;
    //     onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
    //     onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
    //     onPointerDown?: (event: ThreeEvent<MouseEvent>) => void;
    //     onPointerUp?: (event: ThreeEvent<MouseEvent>) => void;
    //     [key: string]:
    //         | ((event: ThreeEvent<MouseEvent | PointerEvent>) => void)
    //         | undefined;
    // };
    // floatOptions?: {
    //     speed?: number;
    //     floatIntensity?: number;
    //     rotationIntensity?: number;
    //     floatRange?: [number, number];
    // };
    // mobileTextProps?: CenterProps;
    // animations?: {
    //     propertiesToCheck?: string[];
    //     hovered?: boolean;
    //     [key: string]: any;
    // } & SpringProps;
    // /** @defaultValue false */
    // hovered?: boolean;
} & JSX.IntrinsicElements['group'];

let isComponentMounted = false;

/**
 * IconWithText component that displays a 3D icon with text.
 *
 * @description This container is Floating.
 *
 * @param model - Model URL
 * @param props - Additional properties for the 3D group element
 * @param datas - Data containing the name and text for the icon
 * @returns
 */
export function IconWithText({ model, datas, ...props }: IconsTypes) {
    const contextValue = use(IconsContainerContext);
    if (!contextValue) {
        throw new Error(
            'IconWithText must be used within IconsContainerProvider'
        );
    }

    let {
        margin,
        animations,
        mobileTextProps,
        floatOptions,
        eventsList,
        isMobile,
        iconScale,
        scalar,
    } = contextValue as IconsContainerContextTypes;

    scalar = 0.8 * scalar;
    const [hovered, set] = useState(false);

    const newAnimationObject = useMemo(() => {
        const newObject = { ...animations };
        if (
            'hovered' in animations &&
            animations.hovered &&
            animations.propertiesToCheck
        ) {
            animations.propertiesToCheck.forEach((animationKey) => {
                if (animations[animationKey]) {
                    newObject[animationKey] = hovered
                        ? animations[animationKey].hovered
                        : animations[animationKey].default;
                }
            });
        }
        return newObject;
    }, [animations, hovered, isComponentMounted]);

    const animationSpring = useSpring(newAnimationObject);

    const { nodes } = useLoader(GLTFLoader, model, (loader) => {
        const gltfLoader = loader as GLTFLoader;
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );
        gltfLoader.setDRACOLoader(dracoLoader);
    });

    const groupRef = useRef<Group>(null!);
    // const frameCountRef = useRef(0);

    useCursor(hovered);

    // useEffect(() => {
    //     if (!groupRef.current && !animations.animatePosition.from) return;

    //     isComponentMounted = animations.animatePosition.from;

    //     return () => {
    //         isComponentMounted = animations.animatePosition.default;
    //     };
    // }, []);

    /**
     * Checks if the icon is in the camera's frustum
     * and enables/disables the scaling ease.
     */
    // useFrame((_, delta) => {
    //     if (!groupRef.current) return;
    //     frameCountRef.current += 1;
    //     if (frameCountRef.current % 4 === 0) {
    //         // const contentGrid = groupRef.current.parent?.parent;
    //         if (!animations.animatePosition) return;
    //         // if (contentGrid?.visible)
    //         easing.damp3(
    //             groupRef.current.position,
    //             isComponentMounted,
    //             0.3,
    //             delta
    //         );
    //         // easing.damp3(
    //         //     groupRef.current.position,
    //         //     !isComponentMounted
    //         //         ? animations.animatePosition.from
    //         //         : animations.animatePosition.default,
    //         //     2000,
    //         //     delta
    //         // );
    //     }
    // });

    return (
        <animated.group {...animationSpring}>
            <Center
                ref={groupRef as any}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    set(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    set(false);
                }}
                {...eventsList}
                {...props}
                name={datas.name}
                dispose={null}
            >
                {/* <Suspense fallback={<PlaceholderIcon />}> */}
                <Float {...floatOptions}>
                    <Center
                        position-y={isMobile ? -0.8 * scalar : 0}
                        position-x={isMobile ? 0.1 * scalar : 0}
                        back
                        left
                        bottom={isMobile ? true : false}
                    >
                        {nodes.Scene?.children.map((node) => {
                            return (
                                <IconMesh
                                    name="icons-Container__icon"
                                    key={node.uuid}
                                    data={node}
                                    // iconColor={'#000000'}
                                    // curveSegments={isMobile ? 4 : 32}
                                    hovered={hovered}
                                    scale={iconScale * scalar}
                                    castShadow
                                    receiveShadow
                                />
                            );
                        })}
                    </Center>
                    {!isMobile ? (
                        <Title
                            right
                            isMobile={isMobile}
                            name="icons-Container__title"
                            position-x={0.2 * scalar}
                            position-y={-0.1}
                            size={30}
                            textProps={{ scale: 0.01 * scalar }}
                            scalar={scalar}
                        >
                            {datas.text}
                        </Title>
                    ) : (
                        <Center
                            {...mobileTextProps}
                            name="icons-Container__title"
                        >
                            <FallbackText>{datas.text}</FallbackText>
                        </Center>
                    )}

                    <mesh
                        scale={isMobile ? 0.7 * scalar : 1.2 * scalar}
                        position-y={isMobile ? -0.8 * scalar : 0}
                        position-x={isMobile ? -0.5 * scalar : 0.2 * scalar}
                        visible={false}
                    >
                        <boxGeometry />
                    </mesh>
                </Float>
                {/* </Suspense> */}
            </Center>
        </animated.group>
    );
}
