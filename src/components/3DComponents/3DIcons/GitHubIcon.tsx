import GitIcon from '@models/github_model.glb';
import { useCursor, useGLTF } from '@react-three/drei';
import { JSX, use, useState } from 'react';
import { Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
    nodes: {
        Curve: Mesh;
    };
    materials: {
        SVGMat: MeshStandardMaterial;
    };
};
export function GitHubIcon(props: JSX.IntrinsicElements['group']) {
    const [hovered, set] = useState(false);
    const { nodes, materials } = useGLTF(GitIcon) as GLTFResult;

    useCursor(hovered);

    return (
        <group
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            dispose={null}
            {...props}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Curve.geometry}
                material={materials.SVGMat}
                rotation={[1.582, 0, 0]}
                curveSegments={32}
            >
                <meshStandardMaterial color={'#000000'} />
            </mesh>
        </group>
    );
}

useGLTF.preload(GitIcon);
