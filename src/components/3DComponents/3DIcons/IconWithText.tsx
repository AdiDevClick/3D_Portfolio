import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { Center, Float, useCursor } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { Group } from 'three';
import { easing } from 'maath';
import { JSX, useRef, useState } from 'react';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';
type IconsTypes = {
    model: string;
    datas: { name: string; text: string };
    scalar: number;
    index: number;
    /** @defaultValue 0.5 */
    margin?: number;
    isMobile: boolean;
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
 * @returns
 */
export function IconWithText({
    model,
    scalar,
    index,
    datas,
    isMobile,
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
    const titleRef = useRef(null);
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
            const contentGrid = groupRef.current.getObjectByName(datas.name)
                ?.parent?.parent;
            if (contentGrid?.visible)
                easing.damp3(
                    groupRef.current.scale,
                    hovered ? 1.2 : 1,
                    0.2,
                    delta
                );
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            dispose={null}
            {...props}
        >
            <Center name={datas.name}>
                <group ref={titleRef} position={[-0.25 * scalar, 0, 0]}>
                    <Float>
                        <Center key={datas.name} back left position-x={0}>
                            {nodes.Scene.children.map((node) => {
                                return (
                                    <IconMesh
                                        name="icons-Container__icon"
                                        key={node.uuid}
                                        data={node}
                                        // iconColor={'#000000'}
                                        // curveSegments={isMobile ? 4 : 32}
                                        hovered={hovered}
                                        scale={100 * scalar}
                                        castShadow
                                        receiveShadow
                                    />
                                );
                            })}
                        </Center>
                        <Title
                            right
                            name="icons-Container__title"
                            position-x={0.3 * scalar}
                            textProps={{ scale: 0.01 * scalar }}
                        >
                            {datas.text}
                        </Title>
                    </Float>
                </group>
            </Center>
        </group>
    );
}
