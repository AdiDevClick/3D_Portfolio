import GitIcon from '@models/github_model.glb';
import { useGLTF } from '@react-three/drei';
import { JSX } from 'react';
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
    const { nodes, materials } = useGLTF(GitIcon) as GLTFResult;
    return (
        <group dispose={null} {...props}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Curve.geometry}
                material={materials.SVGMat}
            >
                <meshStandardMaterial color={'#000000'} />
            </mesh>
        </group>
    );
}

useGLTF.preload(GitIcon);
