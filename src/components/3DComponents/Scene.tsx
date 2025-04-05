import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    useScroll,
    useTexture,
    CameraControls,
    Html,
} from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import '../../utils/util.tsx';
import { useControls } from 'leva';
import JSONDatas from '@data/exemples.json';
import useResize from '../../hooks/useResize.tsx';
import { boundariesOptions } from '../../configs/3DCarousel.config.tsx';
import Carousel from './3DCarousel.tsx';
import { Box3, DoubleSide, MathUtils, Vector3 } from 'three';
import { useCarousel } from '@/hooks/reducers/useCarousel.tsx';
// import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';

const initialCameraFov = 20;
let minAngle = -Infinity;
let maxAngle = Infinity;

export function Scene() {
    const controlsRef = useRef(null!);
    const menuRef = useRef(null!);
    const initialCameraConfig = useRef({
        position: new Vector3(0, 0, -20),
        fov: 20,
    });

    const [prevCamPos, setPrevCamPos] = useState(() =>
        controlsRef.current
            ? controlsRef.current.camera.position.clone()
            : new Vector3(0, 0, -20)
    );

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
            const { camera } = controlsRef.current;
            camera.updateProjectionMatrix();
            reducer.contentSizes = size;
            // camera.updateMatrixWorld();

            if (reducer.activeContent) {
                setPrevCamPos(camera.position.clone());
                const { cardAngles, ref, containerScale, isClicked, isActive } =
                    reducer.activeContent;

                if (isActive || isClicked) {
                    // console.log(camera);
                    // maxAngle = cardAngles.active + MathUtils.degToRad(30);
                    // minAngle = cardAngles.active + MathUtils.degToRad(-30);
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
                    // const verticalOffset = size[1] / 100; // Ajuster la division pour placer convenablement le contenu
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
                    const lerpFactor = 0.6; // Ajustez selon l'effet désiré

                    // Calculer les positions interpolées entre la position actuelle et la position cible
                    const newCamPos = camera.position
                        .clone()
                        .lerp(camPos, lerpFactor);
                    const newTarget = camTargetPos.clone();
                    // Calcul du vecteur "right" de l'élément en fonction de son quaternion
                    const rightVector = new Vector3(1, 0, 0);
                    rightVector.applyQuaternion(ref.current.quaternion);
                    // Multiplier par l'offset désiré (2.5 par exemple)
                    const offsetDistance = !isMobile && isClicked ? 2 : 0;
                    const rightOffset =
                        rightVector.multiplyScalar(offsetDistance);
                    // Déterminez la target finale en décalant newTarget par le vecteur rightOffset
                    const shiftedTarget = newTarget.clone().add(rightOffset);
                    camera.fov = reducer.isMobile ? 15 : 20;
                    // console.log('Nouvelle position cible :', newCamPos);
                    // console.log('Déplacement de la caméra en cours...');
                    controlsRef.current.setLookAt(
                        newCamPos.x,
                        newCamPos.y,
                        newCamPos.z,
                        shiftedTarget.x,
                        isClicked && isMobile
                            ? shiftedTarget.y - 1.5
                            : shiftedTarget.y,
                        shiftedTarget.z,
                        true // Option d'animation
                    );
                    // console.log(
                    //     'Position actuelle après setLookAt :',
                    //     camera.position
                    // );
                    camera.updateProjectionMatrix();

                    // maxAngle = cardAngles.active + Math.PI * 2;
                    // minAngle = cardAngles.active - Math.PI * 2;
                    // const controls = controlsRef.current;
                    // // Assurez-vous d'avoir la cible du contrôle
                    // const target = controls.target || controls._target;
                    // if (!target) return; // sécurité

                    // // Calculer la position relative de la caméra par rapport à la cible
                    // const relativePos = new Vector3().subVectors(
                    //     controls.camera.position,
                    //     target
                    // );
                    // // Convertir en coordonnées sphériques
                    // const spherical = new Spherical().setFromVector3(
                    //     relativePos
                    // );

                    // // Angle de référence de la carte active
                    // const cardAngle = reducer.activeContent.cardAngles.active; // en radians
                    // const minAngular = cardAngle + MathUtils.degToRad(-30);
                    // const maxAngular = cardAngle + MathUtils.degToRad(30);

                    // // Clamp de l'angle theta entre ces deux bornes
                    // spherical.theta = MathUtils.clamp(
                    //     spherical.theta,
                    //     minAngular,
                    //     maxAngular
                    // );

                    // // Reconvertir en coordonnées cartésiennes
                    // const newRelativePos = new Vector3().setFromSpherical(
                    //     spherical
                    // );
                    // // Recalculer la nouvelle position de la caméra
                    // controls.camera.position.copy(target).add(newRelativePos);

                    // // Si vous avez besoin d'une interpolation douce, vous pouvez y ajouter un lerp ici.
                    // // Par exemple, pour éviter un "saut" brutal, interpoler la position actuelle vers la position clamped.
                    // // const clampedPos = target.clone().add(newRelativePos);
                    // // controls.camera.position.lerp(clampedPos, 0.1);

                    // controls.camera.updateMatrixWorld();
                }
            } else {
                // minAngle = -Infinity;
                // maxAngle = Infinity;
                camera.fov = initialCameraFov;
                controlsRef.current.setLookAt(
                    prevCamPos.x,
                    prevCamPos.y,
                    prevCamPos.z,
                    0,
                    0,
                    0,
                    true // Option d'animation
                );
                camera.updateProjectionMatrix();
            }
        }
    }, [reducer.activeContent, size]);

    // useFrame(() => {
    // if (reducer.activeContent?.isClicked && controlsRef.current) {
    //     const controls = controlsRef.current;
    //     // On récupère la cible des contrôles : selon la version, cela peut être controls.target ou controls._target
    //     const target = controls.target || controls._target;
    //     if (!target) return;
    //     // Calculer la position relative (en coordonnées sphériques)
    //     const relativePos = new Vector3().subVectors(
    //         controls.camera.position,
    //         target
    //     );
    //     const spherical = new Spherical().setFromVector3(relativePos);
    //     // Angle de référence de l'objet cliqué ; par exemple :
    //     const cardAngle = reducer.activeContent.cardAngles.active;
    //     const minAngular = cardAngle + MathUtils.degToRad(-30);
    //     const maxAngular = cardAngle + MathUtils.degToRad(30);
    //     // Forcer l'angle theta dans ces limites
    //     spherical.theta = MathUtils.clamp(
    //         spherical.theta,
    //         minAngular,
    //         maxAngular
    //     );
    //     // Calculer la nouvelle position de la caméra
    //     const newRelativePos = new Vector3().setFromSpherical(spherical);
    //     const forcedPos = target.clone().add(newRelativePos);
    //     // Pour éviter les sauts brutaux, on pourrait interpoler la position actuelle vers forcedPos
    //     controls.camera.position.lerp(forcedPos, 0.1);
    //     controls.camera.updateMatrixWorld();
    // }
    // });
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
            style={{ position: 'relative', height: '100%', width: '100%' }}
            id="canva"
            camera={{ position: [0, 0, -14], fov: 50 }}
            // camera={{ position: [0, 0, -20], fov: 20 }}
            // dpr={[1, 1.5]}
            dpr={window.devicePixelRatio}
            // camera={{ position: [0, 0, 5], fov: 70 }}
        >
            {/* <Html
                ref={menuRef}
                style={{ position: 'relative', height: '100%', width: '100%' }}
                fullscreen
                anchorX={0}

                // portal={document.body}
                // position={
                //     reducer.isMobile ? [0, -1.5, 0] : [-width - 0.1, 0, 0]
                // }
>                                                                                                                                                               
                <aside
                    style={{
                        position: 'absolute',
                        display: 'block',
                        top: 0,
                        height: '650px',
                        width: '500px',
                        background: 'rgba(255, 255, 255, 0.95)',
                    }}
                    className="lateral-menu"
                ></aside>
            </Html> */}

            <color attach="background" args={['#191920']} />
            <CameraControls
                // makeDefault
                // no Y-axis
                polarRotateSpeed={0}
                // no zoom
                dollySpeed={0}
                // Max angle on active is given by the camera
                maxAzimuthAngle={maxAngle}
                // Min angle on active is given by the camera
                minAzimuthAngle={minAngle}
                ref={controlsRef}
                onStart={(e) =>
                    onControlStart(e, reducer.activeContent?.isClicked)
                }
            />

            {/* <fog attach="fog" args={['#a79', 8.5, 12]} /> */}
            {/* <ScrollControls pages={4} infinite> */}
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

function onControlStart(e, active) {
    // e.target.azimuthAngle = 0;

    e.azimuthAngleLimits = [MathUtils.degToRad(-30), MathUtils.degToRad(30)];
    if (active) {
        // e.target.minAzimuthAngle = minAngle;
        // e.target.maxAzimuthAngle = maxAngle;
        // e.target.maxSpeed = 0.1;
        // e.target.minAzimuthAngle = -Math.PI / 8;
        // e.target.maxAzimuthAngle = Math.PI / 8;
    } else {
        // e.target.maxAzimuthAngle = Infinity;
        // e.target.minAzimuthAngle = -Infinity;
        // e.target.maxSpeed = Infinity;
        // e.target.azimuthRotateSpeed = 0.5;
    }
    // e.target.camera.updateProjectionMatrix();
    console.log(e.target);

    // maxAngle = cardAngles.active + Math.PI / 8;
    // minAngle = cardAngles.active - Math.PI / 8;
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
