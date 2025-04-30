import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { useCursor, useGLTF } from '@react-three/drei';
import { JSX, useState } from 'react';
type IconsTypes = {
    model: string;
    text: string;
    scalar: number;
} & JSX.IntrinsicElements['group'];

export function IconWithText({ model, text, scalar, ...props }: IconsTypes) {
    const [hovered, set] = useState(false);
    const { nodes } = useGLTF(model);

    useCursor(hovered);

    return (
        <group
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            dispose={null}
            {...props}
        >
            {nodes.Scene.children.map((node) => {
                return (
                    <IconMesh
                        key={node.uuid}
                        data={node}
                        iconColor={'#000000'}
                        curveSegments={32}
                        hovered={hovered}
                        scale={70}
                    />
                );
            })}

            <Title textProps={{ scale: 0.01 * scalar }}>{text}</Title>
        </group>
    );
}
