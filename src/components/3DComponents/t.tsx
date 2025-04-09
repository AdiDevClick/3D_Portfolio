import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    ScrollControls,
    useScroll,
    useTexture,
    MotionPathControls,
    MotionPathRef,
    OrbitControls,
    CameraControls,
} from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { easing } from 'maath';
import '../../utils/util.tsx';
import { useControls } from 'leva';
import JSONDatas from '@data/exemples.json';
import useResize from '../../hooks/useResize.tsx';
import { boundariesOptions } from '../../configs/3DCarousel.config.tsx';
import Carousel from './Carousel/Carousel.js';
import { DoubleSide, Vector3 } from 'three';
import { useCarousel } from '@/hooks/reducers/useCarousel.tsx';
// import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';

export function Scene() {
    const controlsRef = useRef(null!);
    const { ...reducer } = useCarousel();

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
    useEffect(() => {
        if (controlsRef.current) {
            const currentTarget =
                controlsRef.current.target?.clone() ||
                controlsRef.current._target.clone();
            let currentCamPos = controlsRef.current.camera.position.clone();
            reducer.contentSizes = size;

            if (reducer.activeContent) {
                const { cardAngles, ref, containerScale, isClicked, isActive } =
                    reducer.activeContent;

                if (isActive || isClicked) {
                    // Définir les offsets
                    // Pour pousser la carte active vers l'avant
                    const activeForwardOffset = 10.5;
                    // Recul supplémentaire pour l'effet focus
                    const extraPullback = 3.5;
                    // Légère déviation si nécessaire
                    const desiredAngle = cardAngles.active + Math.PI / 28;
                    // Le rayon de base de l'anneau pour la caméra est settings.CONTAINER_SCALE,
                    // mais vous l'augmentez pour que la caméra se place légèrement à l'extérieur.
                    // Le rayon final de la trajectoire de la caméra inclut le recul supplémentaire
                    const finalDesiredRadius =
                        containerScale + activeForwardOffset + extraPullback;
                    // Calculez la position cible.
                    const camTargetPos = ref.current.position.clone(); // La carte active est la cible principale
                    // Définir un offset vertical basé sur les dimensions de l'écran
                    const verticalOffset = size[1] / 100; // Ajuster la division pour placer convenablement le contenu
                    // Calculez la position de la caméra à partir de l'angle désiré et du rayon.
                    const camPos = new Vector3(
                        Math.sin(desiredAngle) * finalDesiredRadius,
                        // camTargetPos.y + verticalOffset, // Ajustez la hauteur si nécessaire
                        camTargetPos.y + 0.5, // Ajustez la hauteur si nécessaire
                        Math.cos(desiredAngle) * finalDesiredRadius
                    );

                    // Définir un lerpFactor qui contrôle la rapidité de l'interpolation (entre 0 et 1)
                    const lerpFactor = 0.3; // Ajustez selon l'effet désiré

                    // Calculer les positions interpolées entre la position actuelle et la position cible
                    const newCamPos = currentCamPos.lerp(camPos, lerpFactor);
                    const newTarget = currentTarget.lerp(
                        camTargetPos,
                        lerpFactor
                    );
                    controlsRef.current.setLookAt(
                        newCamPos.x,
                        newCamPos.y,
                        newCamPos.z, // Nouvelle position de la caméra
                        newTarget.x,
                        newTarget.y,
                        newTarget.z, // Cible de la caméra
                        0.5 // Option d'animation
                    );
                }
            } else {
                controlsRef.current.setLookAt(
                    currentCamPos.x,
                    currentCamPos.y + 0.3,
                    currentCamPos.z, // Nouvelle position de la caméra
                    0,
                    0,
                    0, // Cible de la caméra
                    0.5 // Option d'animation
                );
            }
        }
    }, [reducer.activeContent, size]);

    // activeCardAngles = {
    //     active: Math.atan2(item.position.x, item.position.z),
    //     notActive: relativeIndex * angleStep,
    //     onHold: (i / total) * TWO_PI,
    // };
    return (
        // <div
        //     id="canvas-container"
        //     style={{ height: '100%', minHeight: 'min-content' }}
        // >
        <Canvas
            // frameloop="demand"
            camera={{ position: [0, 0, -20], fov: 20 }}
            dpr={[1, 1.5]}
            // camera={{ position: [0, 0, 5], fov: 70 }}
        >
            <color attach="background" args={['#191920']} />
            {/* <fog attach="fog" args={['#a79', 8.5, 12]} /> */}

            <CameraControls
                // no Y-axis
                polarRotateSpeed={0}
                // no zoom
                dollySpeed={0}
                ref={controlsRef}
            />
            <group position={[0, 0.5, 0]}>
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
                        side={DoubleSide}
                    />
                </mesh>
                <Carousel
                    reducer={reducer}
                    boundaries={responsiveBoundaries}
                    datas={JSONDatas}
                />
                {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={80}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                    />
                </mesh> */}
            </group>

            {/* <ScrollControls pages={4} infinite> */}
            {/* <Rig rotation={[0, 0, 0.15]}> */}

            {/* </Rig> */}
            {/* <Banner position={[0, -0.15, 0]} /> */}
            {/* </ScrollControls> */}
            <Environment preset="dawn" background blur={0.5} />
            {/* <ambientLight />
            <Experience /> */}
        </Canvas>
        // </div>
    );
}
