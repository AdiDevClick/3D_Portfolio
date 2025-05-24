import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh';
import { Title } from '@/components/3DComponents/Title/Title';
import { Center, CenterProps, Float, useCursor } from '@react-three/drei';
import { ThreeEvent, useFrame, useLoader } from '@react-three/fiber';
import { Group } from 'three';
import { easing } from 'maath';
import { JSX, useRef, useState } from 'react';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';
import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
type IconsTypes = {
    model: string;
    datas: { name: string; text: string };
    scalar: number;
    index: number;
    /** @defaultValue 0.5 */
    margin?: number;
    isMobile: boolean;
    /** @defaultValue 100 */
    iconScale?: number;
    eventsList?: {
        onClick?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerDown?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerUp?: (event: ThreeEvent<MouseEvent>) => void;
        [key: string]:
            | ((event: ThreeEvent<MouseEvent | PointerEvent>) => void)
            | undefined;
    };
    floatOptions?: {
        speed?: number;
        floatIntensity?: number;
        rotationIntensity?: number;
        floatRange?: [number, number];
    };
    mobileTextProps?: CenterProps;
} & JSX.IntrinsicElements['group'];

/**
 * IconWithText component that displays a 3D icon with text.
 *
 * @description This container is Floating.
 *
 * @param model - Model URL
 * @param text - Text to display
 * @param scalar - Scalar value for scaling the icon depending on the screen size
 * @param index - Index of the icon in the grid
 * @param isMobile - Boolean indicating if the device is mobile
 * @param margin - **Default=0.5** - Margin between icons
 * @param props - Additional properties for the 3D group element
 * @param iconScale - Scale of the icon **Default=100**
 * @param floatOptions - Options for the floating effect
 * @param eventsList - List of events to attach to the icon
 * @param mobileTextProps - Props for the mobile text
 * @returns
 */
export function IconWithText({
    model,
    scalar,
    iconScale = 100,
    index,
    datas,
    isMobile,
    eventsList,
    floatOptions,
    mobileTextProps,
    margin = 0.5,
    ...props
}: IconsTypes) {
    const [hovered, set] = useState(false);

    const { nodes } = useLoader(GLTFLoader, model, (loader) => {
        const gltfLoader = loader as GLTFLoader;
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );
        gltfLoader.setDRACOLoader(dracoLoader);
    });

    const groupRef = useRef<Group>(null!);
    const frameCountRef = useRef(0);

    useCursor(hovered);

    /**
     * Checks if the icon is in the camera's frustum
     * and enables/disables the scaling ease.
     */
    useFrame((_, delta) => {
        if (!groupRef.current) return;
        frameCountRef.current += 1;
        if (frameCountRef.current % 4 === 0) {
            const contentGrid = groupRef.current.parent?.parent;

            if (contentGrid?.visible)
                easing.damp3(
                    groupRef.current.scale,
                    hovered ? 1.2 : 1,
                    0.1,
                    delta
                );
        }
    });

    return (
        <Center
            ref={groupRef as any}
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            {...eventsList}
            dispose={null}
            {...props}
            name={datas.name}
        >
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
                    <Center {...mobileTextProps} name="icons-Container__title">
                        <FallbackText>{datas.text}</FallbackText>
                    </Center>
                )}
            </Float>
        </Center>
    );
}
