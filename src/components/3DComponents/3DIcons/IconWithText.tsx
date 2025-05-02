import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { Center, Float, useCursor, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { easing } from 'maath';
import { JSX, useRef, useState } from 'react';
type IconsTypes = {
    model: string;
    text: string;
    scalar: number;
    index: number;
    margin?: number;
} & JSX.IntrinsicElements['group'];

export function IconWithText({
    model,
    text,
    scalar,
    index,
    margin = 0.5,
    ...props
}: IconsTypes) {
    const [hovered, set] = useState(false);
    const { nodes } = useGLTF(model);

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
                <Float>
                    <Center back left position={[-0.15 * scalar, 0, 0]}>
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

                    <Title
                        ref={titleRef}
                        right
                        name="icons-Container__title"
                        textProps={{ scale: 0.01 * scalar }}
                    >
                        {text}
                    </Title>
                </Float>
            </Center>
        </group>
    );
}
