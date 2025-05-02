import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { Center, Float, useCursor, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { JSX, useRef, useState } from 'react';
type IconsTypes = {
    model: string;
    text: string;
    scalar: number;
    index: number;
    margin: 0.5;
} & JSX.IntrinsicElements['group'];

export function IconWithText({
    model,
    text,
    scalar,
    index,
    grid,
    margin = 0.5,
    ...props
}: IconsTypes) {
    const [hovered, set] = useState(false);
    const { nodes } = useGLTF(model);

    const groupRef = useRef(null);
    const iconRef = useRef(null);
    const titleRef = useRef(null);

    useCursor(hovered);

    useFrame(({ delta }) => {
        if (!groupRef.current) return;
        easing.damp3(groupRef.current.scale, hovered ? 1.2 : 1, 0.2, delta);
    });

    return (
        <Center
            ref={groupRef}
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            dispose={null}
            // position-y={-margin * 1.7 * index * scalar}
            // scale={hovered ? 1.2 : 1}
            // position-x={Math.random() * index * scalar}
            // position={[
            //     (grid.col - 1) * scalar,
            //     -grid.row * scalar * 1.2,
            //     hovered ? 0.5 : 0,
            // ]}
            {...props}
        >
            <Float>
                <Center back left position={[-0.2 * scalar, 0, 0]}>
                    {nodes.Scene.children.map((node) => {
                        return (
                            <IconMesh
                                name="icons-Container__icon"
                                ref={iconRef}
                                key={node.uuid}
                                data={node}
                                iconColor={'#000000'}
                                curveSegments={32}
                                hovered={hovered}
                                scale={70}
                                // position-y={(-0.5 * index + margin) * scalar}
                                // position-x={-0.1 * scalar}
                            />
                        );
                    })}
                </Center>

                <Title
                    ref={titleRef}
                    right
                    name="icons-Container__title"
                    // position-y={(-0.5 * index + margin) * scalar}
                    // position-x={1 * scalar}
                    textProps={{ scale: 0.01 * scalar }}
                >
                    {text}
                </Title>
            </Float>

            <Center bottom right position={[0, -0.6 * scalar, 0]}>
                <HexCell scalar={scalar} />
            </Center>
        </Center>
    );
}

function HexCell({ scalar }) {
    return (
        <mesh>
            <cylinderGeometry args={[scalar * 0.8, scalar * 0.8, 0.05, 6]} />
            <meshStandardMaterial
                color="#2a2a2a"
                roughness={0.7}
                metalness={0.3}
            />
        </mesh>
    );
}
