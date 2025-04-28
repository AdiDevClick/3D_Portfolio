import { useCursor, useGLTF } from '@react-three/drei';
import { JSX, useState } from 'react';
import { Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
    nodes: {
        Curve: Mesh;
        Scene: { children: Mesh[] };
        [key: string]: any;
    };
    materials: {
        [key: string]: MeshStandardMaterial;
    };
};

type IconsTypes = {
    model: string;
} & JSX.IntrinsicElements['group'];

export function Icons({ model, ...props }: IconsTypes) {
    const [hovered, set] = useState(false);
    const { nodes } = useGLTF(model) as GLTFResult;

    useCursor(hovered);

    return (
        <group
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            scale={70}
            dispose={null}
            {...props}
        >
            {nodes.Scene.children.map((node, index) => {
                return (
                    <IconMesh
                        key={index}
                        data={node}
                        iconColor={'#000000'}
                        curveSegments={32}
                    />
                );
            })}
        </group>
    );
}

function IconMesh({
    data,
    iconColor,
    ...props
}: {
    data: Mesh;
    iconColor: string;
}) {
    return (
        <mesh {...data} {...props}>
            <meshStandardMaterial color={iconColor} />
        </mesh>
    );
}

// useGLTF.preload(GLTFModel);
