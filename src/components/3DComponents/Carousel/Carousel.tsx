import { useEffect, useId, useLayoutEffect, useMemo, useRef } from 'react';
import { DoubleSide, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { MathPos } from '@/functions/positionning.ts';
import { effectiveRadius, isNeighbor } from '@/functions/collisions.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import {
    ACTIVE_PROJECTS_POSITION,
    DEFAULT_PROJECTS_POSITION,
    TWO_PI,
} from '@/configs/3DCarousel.config.js';
import {
    createCardProperties,
    handleNeighborCollision,
} from '@/components/3DComponents/Carousel/Functions.js';
import { CardContainer } from '@/components/3DComponents/Cards/CardContainer.js';
import { ReducerType } from '@/hooks/reducers/carouselTypes.js';
import { useParams } from 'react-router';

const collision = new Vector3();

// type CarouselProps = {
//     boundaries: object;
//     datas: [];
//     reducer: ReducerType;
//     SETTINGS: SettingsTypes;
// };
interface CarouselProps {
    reducer: ReducerType;
    boundaries: { x: number; y: number; z: number };
    datas: [];
    SETTINGS: SettingsType;
}
export default function Carousel({
    boundaries,
    datas,
    reducer,
    SETTINGS,
}: CarouselProps) {
    const frameCountRef = useRef(0);
    const projectsRef = useRef(null);

    const urlParams = useParams();
    const id = useId();

    /**
     * Création des propriétés des cartes -
     */
    const cardsMemo = useMemo(() => {
        return new Array(SETTINGS.CARDS_COUNT)
            .fill(null)
            .map((_, i, self) =>
                createCardProperties(SETTINGS, datas, i, self, id)
            );
    }, [
        SETTINGS.CARDS_COUNT,
        SETTINGS.CARD_SCALE,
        SETTINGS.CONTAINER_SCALE,
        SETTINGS.THREED,
    ]);

    /**
     * Crer l'array du reducer qui sera partagé -
     * Il ne sera créé qu'une fois -
     */
    useEffect(() => {
        const currentIds = reducer.showElements.map((el) => el.id);
        cardsMemo.forEach((card) => {
            if (!currentIds.includes(card.id)) {
                reducer.addElements(card);
            } else {
                reducer.updateElements(card);
            }
        });
        if (cardsMemo.length < reducer.showElements.length) {
            reducer.deleteElements(cardsMemo);
        }
    }, [cardsMemo]);

    // useLayoutEffect(() => {
    //     console.log(urlParams);
    //     if (urlParams.id === 'projets' && projectsRef.current) {
    //         console.log('object');

    //         const delta = useThree((state) => state.clock.getDelta());
    //         console.log(delta);
    //         easing.damp3(
    //             projectsRef.current.position,
    //             [-100, -100, 0],
    //             0.2,
    //             delta
    //         );
    //     }
    // }, [urlParams]);

    useFrame((state, delta) => {
        frameCountRef.current += 1;
        // Grab existing active card in the index
        const activeCard = reducer.showElements.findIndex(
            (el) => el.isActive || el.isClicked
        );

        const activeForwardOffset = 0.5;

        reducer.showElements.forEach((item, i) => {
            if (!item.ref || !item.ref.current) return;

            const { position, rotation } = item.ref.current;
            const { active, onHold } = item.cardAngles;

            let positions;
            let targetRotationY = 0;

            // Recalculate circle formation
            if (activeCard !== -1) {
                if (i === activeCard) {
                    // Finding initial angle position
                    // It should be : [sin(angle)*R, 0, cos(angle)*R]
                    const targetRadius =
                        SETTINGS.CONTAINER_SCALE + activeForwardOffset;
                    positions = MathPos(active, targetRadius);
                    targetRotationY = active;
                    // targetRotationY = active + Math.PI;
                } else {
                    const relativeIndex = i < activeCard ? i : i - 1;
                    const angleStep =
                        TWO_PI / (reducer.showElements.length - 1);
                    const nonActiveCardAngle = relativeIndex * angleStep;
                    positions = MathPos(
                        nonActiveCardAngle,
                        SETTINGS.CONTAINER_SCALE
                    );
                    targetRotationY = nonActiveCardAngle;
                    // targetRotationY = nonActiveCardAngle + Math.PI;
                }
            } else {
                // If no active cards, we spread them all on the ring
                positions = MathPos(onHold, SETTINGS.CONTAINER_SCALE);
                targetRotationY = onHold;

                // Calculating collisions
                if (SETTINGS.COLLISIONS) {
                    reducer.showElements.forEach((element, index) => {
                        if (index === i) return;
                        const inRangeItem =
                            position.distanceTo(element.ref.current.position) -
                            effectiveRadius(item, element);

                        // General collision - Checks if any item collide
                        // handleCollisions(i, index, inRangeItem);

                        // Collision handler
                        if (frameCountRef.current % 10 === 0) {
                            const newScale = handleNeighborCollision(
                                i,
                                index,
                                inRangeItem,
                                element.presenceRadius,
                                SETTINGS.CONTAINER_SCALE
                            );

                            if (newScale !== null) {
                                SETTINGS.set({
                                    CONTAINER_SCALE: newScale,
                                });
                            }
                        }
                    });
                }
            }

            // If no 3D activated we go back to the center
            if (!SETTINGS.THREED) positions = [0, 0, 0];
            // Animating the new positions and rotations
            // if (frameCountRef.current % 2 === 0) {
            easing.damp3(position, positions, 0.15, delta);
            easing.damp(rotation, 'y', targetRotationY, 0.15, delta);
            // easing.damp(rotation, 'y', card.cardAngles?.onHold, 0.15, delta);
            // }
        });

        // if (reducer.activeContent?.isClicked) {
        //     const controls = state;
        //     // console.log(controls);
        //     // On récupère la cible des contrôles : selon la version, cela peut être controls.target ou controls._target
        //     const target = controls.target || controls._target;
        //     if (!target) return;
        //     console.log('object');
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
        // if (frameCountRef.current % 2 === 0) {
        if (projectsRef.current) {
            switch (urlParams.id) {
                case 'projets':
                    return easing.damp3(
                        projectsRef.current.position,
                        ACTIVE_PROJECTS_POSITION,
                        0.2,
                        delta
                    );
                default:
                    return easing.damp3(
                        projectsRef.current.position,
                        DEFAULT_PROJECTS_POSITION,
                        0.2,
                        delta
                    );
            }
        }
    });

    return (
        <group ref={projectsRef} position={DEFAULT_PROJECTS_POSITION}>
            <mesh visible={SETTINGS.debug}>
                <boxGeometry
                    args={[boundaries.x, boundaries.y, boundaries.z]}
                />
                <meshStandardMaterial
                    color={'orange'}
                    transparent
                    opacity={0.5}
                    side={DoubleSide}
                />
            </mesh>
            <CardContainer reducer={reducer} SETTINGS={SETTINGS} />
        </group>
    );
}
