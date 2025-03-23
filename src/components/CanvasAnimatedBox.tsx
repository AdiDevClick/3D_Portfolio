import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function MyAnimatedBox() {
    const [active, setActive] = useState(false);
    const myMeshRef = useRef(null);
    useFrame(({ clock }) => {
        if (myMeshRef.current) {
            myMeshRef.current.rotation.x = Math.sin(clock.elapsedTime);
            // setClock(clockState.running);
        }
    });

    const onClickHandler = () => {
        setActive(!active);
        myMeshRef.current.position.z = 0.5;
    };

    const onHoverHandler = () => {
        myMeshRef.current.position.x = 0.5;
    };
    return (
        <mesh
            ref={myMeshRef}
            onPointerOver={onHoverHandler}
            scale={active ? 1.5 : 1}
            onClick={onClickHandler}
        >
            <boxGeometry args={[2, 2, 2]} />
            <meshPhongMaterial />
        </mesh>
    );
}

function Scene() {
    const gltf = useLoader(GLTFLoader, '../3DModels/Poimandres.gltf');
    return <primitive object={gltf.scene} />;
}

export const Model = () => {
    const gltf = useLoader(GLTFLoader, '../3DModels/Poimandres.gltf');
    return (
        <>
            <primitive object={gltf.scene} scale={0.4} />
        </>
    );
};
