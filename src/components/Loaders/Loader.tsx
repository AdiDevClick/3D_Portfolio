import { Html, useProgress } from '@react-three/drei';
import { BackSide } from 'three';

export function LoadingScene() {
    const { progress } = useProgress();

    return (
        <>
            {[...Array(5)].map((_, i) => (
                <mesh
                    key={i}
                    position={[(i - 2) * 2, 0, 0]}
                    scale={[1.5, 2, 0.01]}
                >
                    <planeGeometry />
                    <meshStandardMaterial color="#444" />
                </mesh>
            ))}

            <Html center>
                <div
                    style={{
                        color: 'white',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {Math.round(progress)}% chargé
                </div>
            </Html>
            <ambientLight intensity={0.5} />
        </>
    );
}

/**
 * Simple environment for the 3D scene
 * @description : Used only for the loading screen
 */
export function SimpleEnvironment() {
    return (
        <>
            <ambientLight intensity={1.8} color="brown" />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight
                position={[-10, -10, -5]}
                intensity={0.2}
                color="#6666ff"
            />
            <hemisphereLight
                color={0xffffff}
                groundColor={0xffffff}
                intensity={0.5}
            />
            {/* <hemisphereLight args={[0xffffbb, 0x080820, 0.5]} /> */}

            <mesh scale={100} renderOrder={-1000}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#202030" side={BackSide} />
            </mesh>
        </>
    );
}

function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    return <Html center>{progress} % loaded</Html>;
}
