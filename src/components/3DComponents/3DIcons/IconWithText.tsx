import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { Center, Float, useCursor } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { Group } from 'three';
import { easing } from 'maath';
import { JSX, Suspense, useRef, useState } from 'react';
import { GLTFLoader } from 'three-stdlib';
type IconsTypes = {
    model: string;
    text: string;
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
    text,
    scalar,
    index,
    isMobile,
    margin = 0.5,
    ...props
}: IconsTypes) {
    const [hovered, set] = useState(false);

    const { nodes } = useLoader(GLTFLoader, model);
    // const { nodes } = useGLTF(model);

    const groupRef = useRef<Group>(null!);
    const iconRef = useRef(null);
    const titleRef = useRef(null);

    useCursor(hovered);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        easing.damp3(groupRef.current.scale, hovered ? 1.2 : 1, 0.2, delta);
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            dispose={null}
            {...props}
        >
            <Center>
                <group>
                    <Float>
                        <group position={[-0.15 * scalar, 0, 0]}>
                            <Center back left>
                                {nodes.Scene.children.map((node) => {
                                    return (
                                        <IconMesh
                                            name="icons-Container__icon"
                                            ref={iconRef}
                                            key={node.uuid}
                                            data={node}
                                            // iconColor={'#000000'}
                                            curveSegments={32}
                                            hovered={hovered}
                                            scale={100 * scalar}
                                            castShadow
                                            receiveShadow
                                        />
                                    );
                                })}
                            </Center>
                        </group>
                        <group ref={titleRef}>
                            <Suspense fallback={null}>
                                <Title
                                    right
                                    name="icons-Container__title"
                                    textProps={{ scale: 0.01 * scalar }}
                                >
                                    {text}
                                </Title>
                            </Suspense>
                        </group>
                    </Float>
                </group>
            </Center>
        </group>
    );
}
