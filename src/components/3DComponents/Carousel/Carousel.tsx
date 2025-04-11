import { useEffect, useId, useMemo, useRef } from 'react';
import { DoubleSide, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { MathPos } from '@/functions/positionning.ts';
import { effectiveRadius, isNeighbor } from '@/functions/collisions.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { TWO_PI } from '@/configs/3DCarousel.config.js';
import { createCardProperties } from '@/components/3DComponents/Carousel/Functions.js';
import { CardContainer } from '@/components/3DComponents/Cards/CardContainer.js';
import { ReducerType } from '@/hooks/reducers/carouselTypes.js';

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
                        // if (
                        //     inRangeItem <= 0 &&
                        //     index !== i + 1 &&
                        //     index !== i - 1
                        // ) {
                        //     console.log(
                        //         'There is collision between some cards'
                        //     );
                        // }
                        const margin = 0.4;
                        const deltaScale = 0.01;
                        let targetScale = SETTINGS.CONTAINER_SCALE;

                        // Collision between 2 items
                        if (isNeighbor(i, index)) {
                            if (inRangeItem > element.presenceRadius + margin) {
                                targetScale =
                                    SETTINGS.CONTAINER_SCALE - deltaScale;
                            } else if (
                                inRangeItem <=
                                element.presenceRadius - margin
                            ) {
                                targetScale =
                                    SETTINGS.CONTAINER_SCALE + deltaScale;
                            }
                            if (
                                Math.abs(
                                    targetScale - SETTINGS.CONTAINER_SCALE
                                ) > 0.001
                            ) {
                                SETTINGS.set({
                                    CONTAINER_SCALE: targetScale,
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
    });

    return (
        <group>
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
