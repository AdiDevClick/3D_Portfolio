import * as THREE from 'three';

import { Canvas, extend, useLoader } from '@react-three/fiber';
import '@css/App.css';
import { Model, MyAnimatedBox } from './components/CanvasAnimatedBox.tsx';
import { Suspense, useRef, useState } from 'react';
import {
    Environment,
    Html,
    OrbitControls,
    useFBX,
    useProgress,
} from '@react-three/drei';
import Poimandres from './3DModels/Poimandres.tsx';
import { useTexture, Image } from '@react-three/drei';
import { TextureLoader } from 'three';

import { Suzanne } from './3DModels/Suzanne.tsx';
import { easing, geometry } from 'maath';
import img from '@images/work.png';

// extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry });

export function App() {
    // const [active, setActive] = useState(false);
    const imgRef = useRef(null);

    return (
        <Suspense fallback={<span>loading...</span>}>
            <Canvas>
                {/* <Canvas frameloop="demand"> */}
                {/* <MyAnimatedBox /> */}
                <Image
                    ref={imgRef}
                    url={img}
                    // transparent
                    side={THREE.DoubleSide}
                >
                    {/* <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} /> */}
                </Image>
                {/* <Suspense fallback={<Loader />}>
                    <Poimandres position={[2, 1, 5]} active={active} />
                    <Poimandres position={[8, 1, 5]} active={active} />
                    <Poimandres position={[15, 1, 5]} active={active} />
                    <Scene
                        // position={[1, 2, 3]}
                        onClick={() => setActive(!active)}
                    />
                    <OrbitControls autoRotate />
                    <Environment preset="forest" />
                </Suspense> */}

                {/* <ambientLight intensity={0.2} />
                <directionalLight /> */}
                {/* <ambientLight intensity={0.1} />
            <directionalLight color="royalBlue" position={[2, 2, 2]} /> */}
            </Canvas>
        </Suspense>
    );
}
const name = (type: string) =>
    resolvePath(`@models/textures/PavingStones142_1K-JPG_${type}.jpg`);

function Scene({ ...props }) {
    const textureProps = useTexture({
        map: name('Color'),
        displacementMap: name('Displacement'),
        normalMap: name('NormalGL'),
        roughnessMap: name('Roughness'),
        aoMap: name('AmbientOcclusion'),
    });
    // const textureProps = useTexture({
    //     map: paveColor,
    //     displacementMap: paveDisplacement,
    //     normalMap: paveNormalGX,
    //     roughnessMap: paveRoughness,
    //     aoMap: paveAmbiantOcclusion,
    // });
    return (
        <>
            <mesh {...props}>
                <sphereGeometry args={[1, 100, 100]} />
                <meshStandardMaterial
                    displacementScale={0.2}
                    {...textureProps}
                />
            </mesh>
        </>
    );
}

function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    return <Html center>{progress} % loaded</Html>;
}

const resolvePath = (aliasPath: string) => {
    const aliasMap = {
        '@models': '/src/3DModels',
    };
    const [alias, ...rest] = aliasPath.split('/');
    if (aliasMap[alias]) {
        return new URL(`${aliasMap[alias]}/${rest.join('/')}`, import.meta.url)
            .href;
    }
    throw new Error(`Alias "${alias}" non reconnu`);
};

export default App;
