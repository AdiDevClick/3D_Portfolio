import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useControls } from 'leva';
import { Vector3 } from 'three';
import { useRef } from 'react';

// This is how you use the hook in your 3D experience:
// just pass a position of type Vector3 to the returned function & voila!
export function Experience({ children }) {
    // this line is just for that UI control for speed for demo purposes
    const { speed } = useControls({
        speed: { value: 0, min: 0.001, max: 1, step: 0.001 },
    });

    // this is how to get the lookAtSmooth function with desired speed
    const { lookAtSmooth } = useLookAtSmooth(speed);

    const meshRef1 = useRef(null);
    const meshRef2 = useRef(null);
    const meshRef3 = useRef(null);
    const meshRef4 = useRef(null);

    return (
        <>
            <group position={[0, 0, -3]} ref={meshRef1}>
                <Html transform position={[0, 1, 0]}>
                    Click Me!
                </Html>
                <mesh
                    onPointerDown={() => {
                        // this is how to invoke lookAtSmooth
                        lookAtSmooth(meshRef2.current.position);
                    }}
                >
                    <boxGeometry />
                    <meshStandardMaterial color={'red'} />
                </mesh>
            </group>
            <mesh
                position={[0, 3, 3]}
                ref={meshRef2}
                onPointerDown={() => {
                    lookAtSmooth(meshRef3.current.position);
                }}
            >
                <boxGeometry />
                <meshStandardMaterial color={'blue'} />
            </mesh>
            <mesh
                ref={meshRef3}
                position={[3, 0, 0]}
                onPointerDown={() => {
                    lookAtSmooth(meshRef4.current.position);
                }}
            >
                <boxGeometry />
                <meshStandardMaterial color={'yellow'} />
            </mesh>
            <mesh
                ref={meshRef4}
                position={[-3, 0, 0]}
                onPointerDown={() => {
                    lookAtSmooth(meshRef1.current.position);
                }}
            >
                <boxGeometry />
                <meshStandardMaterial color={'green'} />
            </mesh>
        </>
    );
}

// export default function App() {
//   return (
//     <Canvas camera={{ position: [0, 0, 0] }}>
//       <ambientLight />
//       <Experience />
//     </Canvas>
//   )
// }
