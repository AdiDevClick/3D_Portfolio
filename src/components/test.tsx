import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    ScrollControls,
    useScroll,
    useTexture,
    MotionPathControls,
    MotionPathRef,
    OrbitControls,
} from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { easing } from 'maath';
import '../utils/util.tsx';
import { useControls } from 'leva';
import React from 'react';
import JSONDatas from '@data/exemples';
import { boundariesOptions } from '../configs/3DCarousel.config.tsx';
import useResize from '../hooks/useResize.tsx';
import Carousel from './3DComponents/3DCarousel.tsx';

export function App() {
    // Boundaries Settings
    const { attachCamera, debug, path, ...boundaries } = useControls(
        'Boundaries',
        boundariesOptions,
        { collapsed: true }
    );

    // Specify boundaries & responsive boundaries
    const { size } = useResize(100);

    const scaleX = Math.max(0.5, size[0] / 1920);
    const scaleY = Math.max(0.5, size[1] / 1080);
    const responsiveBoundaries = {
        x: boundaries.x * scaleX,
        y: boundaries.y * scaleY,
        z: boundaries.z,
    };

    return (
        <div
            id="canvas-container"
            style={{ height: '100%', minHeight: 'min-content' }}
        >
            <Canvas
            // frameloop="demand"
            // camera={{ position: [0, 0, 100], fov: 15 }}
            >
                <OrbitControls />
                <mesh visible={debug}>
                    <boxGeometry
                        args={[
                            responsiveBoundaries.x,
                            responsiveBoundaries.y,
                            responsiveBoundaries.z,
                        ]}
                    />
                    <meshStandardMaterial
                        color={'orange'}
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                <fog attach="fog" args={['#a79', 8.5, 12]} />
                <ScrollControls pages={4} infinite>
                    {/* <Rig rotation={[0, 0, 0.15]}> */}
                    <Carousel
                        boundaries={responsiveBoundaries}
                        datas={JSONDatas}
                    />
                    {/* </Rig> */}
                    {/* <Banner position={[0, -0.15, 0]} /> */}
                </ScrollControls>
                <Environment preset="dawn" background blur={0.5} />
            </Canvas>
        </div>
    );
}

function Rig(props) {
    const ref = useRef(null);
    const scroll = useScroll();
    useFrame((state, delta) => {
        ref.current.lookAt(1, -0.5, -1); // Look at center

        ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
        state.events.update(); // Raycasts every frame rather than on pointer-move
        // Move camera
        easing.damp3(
            state.camera.position,
            [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
            0.3,
            delta
        );
        state.camera.lookAt(0, 0, 0); // Look at center
    });
    return <group ref={ref} {...props} />;
}

{
    /* {hovered && (
                <MotionPathControls
                    ref={motionPathRef}
                    object={ref}
                    curves={[
                        new THREE.CubicBezierCurve3(
                            new THREE.Vector3(-5, -5, 0),
                            new THREE.Vector3(-10, 0, 0),
                            new THREE.Vector3(0, 3, 0),
                            new THREE.Vector3(6, 3, 0)
                        ),
                        new THREE.CubicBezierCurve3(
                            new THREE.Vector3(6, 3, 0),
                            new THREE.Vector3(10, 5, 5),
                            new THREE.Vector3(5, 3, 5),
                            new THREE.Vector3(5, 5, 5)
                        ),
                    ]}
                />
            )} */
}

function Banner(props) {
    const ref = useRef();
    const texture = useTexture('../images/work_.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const scroll = useScroll();
    useFrame((state, delta) => {
        ref.current.material.time.value += Math.abs(scroll.delta) * 4;
        ref.current.material.map.offset.x += delta / 2;
    });
    return (
        <mesh ref={ref} {...props}>
            <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
            <meshSineMaterial
                map={texture}
                map-anisotropy={16}
                map-repeat={[30, 1]}
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}
