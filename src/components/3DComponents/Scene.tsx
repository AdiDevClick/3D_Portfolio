import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    useScroll,
    useTexture,
    CameraControls,
} from '@react-three/drei';
import { useEffect, useRef } from 'react';
import '../../utils/util.tsx';
import { useControls } from 'leva';
import JSONDatas from '@data/exemples.json';
import useResize from '../../hooks/useResize.tsx';
import { boundariesOptions } from '../../configs/3DCarousel.config.tsx';
import Carousel from './3DCarousel.tsx';
import { Box3, DoubleSide, MathUtils, Vector3 } from 'three';
import { useCarousel } from '@/hooks/reducers/useCarousel.tsx';
// import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';

export function Scene() {
    const controlsRef = useRef(null!);
    const initialCameraConfig = useRef({
        position: new Vector3(0, 0, -20),
        fov: 20,
    });

    const { ...reducer } = useCarousel();

    // Boundaries Settings
    const { attachCamera, debug, path, ...boundaries } = useControls(
        'Boundaries',
        boundariesOptions,
        { collapsed: true }
    );

    // Specify boundaries & responsive boundaries
    const { size } = useResize(100);
    reducer.isMobile = size[0] < 768;
    const isMobile = size[0] < 768;

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
            // controlsRef.current.onStart();
            controlsRef.current.camera.updateProjectionMatrix();
            // controlsRef.current.azimuthAngleLimits = [
            //     // MathUtils.degToRad(30),
            //     reducer.activeContent?.isClicked
            //         ? MathUtils.degToRad(30)
            //         : Infinity,
            //     reducer.activeContent?.isClicked
            //         ? MathUtils.degToRad(-30)
            //         : Infinity,
            //     // MathUtils.degToRad(-30),
            // ];
            // controlsRef.current.azimuthAngleLimits = [
            //     // MathUtils.degToRad(30),
            //     -Math.PI / 3,
            //     Math.PI / 3,
            //     // MathUtils.degToRad(-30),
            // ];
            // initialCameraConfig.current.position =
            //     controlsRef.current.camera.position;

            reducer.contentSizes = size;

            if (reducer.activeContent) {
                const { cardAngles, ref, containerScale, isClicked, isActive } =
                    reducer.activeContent;

                if (isActive || isClicked) {
                    // Définir les offsets
                    // Pour pousser la carte active vers l'avant
                    const activeForwardOffset = 10.5;
                    // Recul supplémentaire pour l'effet focus
                    const extraPullback = reducer.isMobile ? 5.5 : 3.5;
                    // const extraPullback = isMobile ? 5.5 : 3.5;
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
                    const bbox = new Box3().setFromObject(ref.current);
                    const sizeObj = new Vector3();
                    bbox.getSize(sizeObj);
                    // Supposons que l'on souhaite centrer verticalement en prenant en compte la hauteur
                    const verticalCenterOffset = sizeObj.y / 5;
                    const verticalOffset = size[1] / 100; // Ajuster la division pour placer convenablement le contenu
                    // Calculez la position de la caméra à partir de l'angle désiré et du rayon.
                    const camPos = new Vector3(
                        Math.sin(desiredAngle) * finalDesiredRadius,
                        // camTargetPos.y + verticalOffset, // Ajustez la hauteur si nécessaire
                        camTargetPos.y + verticalCenterOffset, // Ajustez la hauteur si nécessaire
                        // camTargetPos.y + 0.5, // Ajustez la hauteur si nécessaire
                        Math.cos(desiredAngle) * finalDesiredRadius
                    );
                    // La cible de regard de la caméra est la position de la carte active.
                    // On part de la position du ref de la carte active pour la cible.
                    // Récupérer la position actuelle de la caméra et la cible actuelle
                    // Ces propriétés dépendent de votre implémentation de CameraControls
                    // Ici, nous supposons que controlsRef.current.camera et controlsRef.current.target existent

                    // Définir un lerpFactor qui contrôle la rapidité de l'interpolation (entre 0 et 1)
                    const lerpFactor = 0.5; // Ajustez selon l'effet désiré

                    // Calculer les positions interpolées entre la position actuelle et la position cible
                    const newCamPos = currentCamPos.lerp(camPos, lerpFactor);
                    const newTarget = camTargetPos.clone();
                    // const newTarget = currentTarget.lerp(
                    //     camTargetPos,
                    //     lerpFactor
                    // );
                    // Calcul du vecteur "right" de l'élément en fonction de son quaternion
                    const rightVector = new Vector3(1, 0, 0);
                    rightVector.applyQuaternion(ref.current.quaternion);
                    // Multiplier par l'offset désiré (2.5 par exemple)
                    const offsetDistance = !isMobile && isClicked ? -2 : 0;
                    const rightOffset =
                        rightVector.multiplyScalar(offsetDistance);
                    // Déterminez la target finale en décalant newTarget par le vecteur rightOffset
                    const shiftedTarget = newTarget.clone().add(rightOffset);
                    let camXTarget =
                        !isMobile && isClicked
                            ? newTarget.x - 2.5
                            : newTarget.x;

                    controlsRef.current.setLookAt(
                        newCamPos.x,
                        newCamPos.y,
                        newCamPos.z, // Nouvelle position de la caméra
                        shiftedTarget.x,
                        isClicked && isMobile
                            ? shiftedTarget.y - 1.5
                            : shiftedTarget.y,
                        shiftedTarget.z, // Cible de la caméra
                        0.5 // Option d'animation
                    );
                    // controlsRef.current.setLookAt(
                    //     newCamPos.x,
                    //     newCamPos.y,
                    //     newCamPos.z, // Nouvelle position de la caméra
                    //     camXTarget,
                    //     newTarget.y,
                    //     newTarget.z, // Cible de la caméra
                    //     0.5 // Option d'animation
                    // );
                    // Optionnel : adapter également le FOV pour renforcer l'effet de zoom sur mobile.
                    controlsRef.current.camera.fov = reducer.isMobile ? 15 : 20;
                    // controlsRef.current.camera.fov = isMobile ? 15 : 20;
                    controlsRef.current.camera.updateProjectionMatrix();

                    // controlsRef.current.addEventListener(
                    //     'controlstart',
                    //     onControlStart
                    // );
                    // return () =>
                    //     controlsRef.current.removeEventListener(
                    //         'controlstart',
                    //         onControlStart
                    //     );
                    // const min = MathUtils.degToRad(0);
                    // const max = MathUtils.degToRad(180);
                    // controlsRef.current.azimuthAngleLimits = [min, max];
                    // console.log(ref.current);
                }
                // controlsRef.current.lerp(currentCamPos);
                // controlsRef.current.setLookAt(
                //     currentCamPos.x,
                //     currentCamPos.y,
                //     currentCamPos.z, // Nouvelle position de la caméra
                //     currentTarget.x,
                //     currentTarget.y,
                //     currentTarget.z, // Cible de la caméra
                //     true // Option d'animation
                // );
                // controlsRef.current.dispose();
            } else {
                const { position, fov } = initialCameraConfig.current;
                controlsRef.current.camera.fov = fov;
                controlsRef.current.camera.updateProjectionMatrix();
                // const min = MathUtils.degToRad(-35);
                // const max = MathUtils.degToRad(-25);
                // controlsRef.current.azimuthAngleLimits = [min, max];
                // controlsRef.current.setLookAt(
                //     position.x,
                //     position.y + 0.3,
                //     position.z,
                //     0,
                //     0,
                //     0,
                //     0.5
                // );
                controlsRef.current.setLookAt(
                    currentCamPos.x,
                    currentCamPos.y,
                    currentCamPos.z,
                    0,
                    0,
                    0, // Cible de la caméra
                    0.5 // Option d'animation
                );
                // const onControlStart = (e) => {
                //     console.log(e.target);
                //     e.maxAzimuthAngle = 30;
                //     e.minAzimuthAngle = -30;
                // };
                // controlsRef.current.addEventListener(
                //     'controlstart',
                //     onControlStart
                // );
                // return () =>
                //     controlsRef.current.removeEventListener(
                //         'controlstart',
                //         onControlStart
                //     );
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
            id="canva"
            camera={{ position: [0, 0, -14], fov: 50 }}
            // camera={{ position: [0, 0, -20], fov: 20 }}
            // dpr={[1, 1.5]}
            dpr={window.devicePixelRatio}
            // camera={{ position: [0, 0, 5], fov: 70 }}
        >
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
            <color attach="background" args={['#191920']} />
            <CameraControls
                // makeDefault
                // no Y-axis
                polarRotateSpeed={0}
                // no zoom
                dollySpeed={0}
                // maxAzimuthAngle={
                //     reducer.activeContent?.isClicked
                //         ? MathUtils.degToRad(180)
                //         : 180
                // }
                // // // maxAzimuthAngle={30}
                // minAzimuthAngle={
                //     reducer.activeContent?.isClicked
                //         ? MathUtils.degToRad(-30)
                //         : -180
                // }
                // minAzimuthAngle={-30}
                ref={controlsRef}
                onStart={onControlStart}
            />
            {/* <fog attach="fog" args={['#a79', 8.5, 12]} /> */}
            {/* <ScrollControls pages={4} infinite> */}
            <group position={[0, 0.5, 0]}>
                {/* <Rig> */}
                {/* <Rig rotation={[0, 0, 0.15]}> */}
                <Carousel
                    reducer={reducer}
                    boundaries={responsiveBoundaries}
                    datas={JSONDatas}
                />
                {/* </Rig> */}

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

            {/* <Banner position={[0, -0.15, 0]} /> */}
            {/* </ScrollControls> */}
            <Environment preset="dawn" background blur={0.5} />
            {/* <ambientLight />
            <Experience /> */}
        </Canvas>
        // </div>
    );
}

function onControlStart(e) {
    console.log(e.touches);
    e.azimuthAngleLimits = [MathUtils.degToRad(-30), MathUtils.degToRad(30)];
}

function Rig(props) {
    const ref = useRef(null);
    const scroll = useScroll();
    useFrame((state, delta) => {
        // ref.current.lookAt(1, 0, -1); // Look at center

        ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
        state.events.update(); // Raycasts every frame rather than on pointer-move
        // Move camera
        // easing.damp3(
        //     state.camera.position,
        //     [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
        //     0.3,
        //     delta
        // );
        // state.camera.lookAt(0, 0, 0); // Look at center
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
