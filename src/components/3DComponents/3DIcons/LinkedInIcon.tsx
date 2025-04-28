import LinkedIn from '@models/linkedin_model.glb';
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

/**
 * LinkedInIcon 3D component
 */
export function LinkedInIcon(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF(LinkedIn) as GLTFResult;
    return (
        <group dispose={null} {...props}>
            {nodes.Scene.children.map((node, index) => {
                return (
                    <mesh key={index} {...node}>
                        <meshStandardMaterial color={'#000000'} />
                    </mesh>
                );
            })}
        </group>
    );
}

useGLTF.preload(LinkedIn);
