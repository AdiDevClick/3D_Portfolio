import { useEffect, useId, useMemo, useRef } from 'react';
import Card from './3DCard.tsx';
import { Vector3 } from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { MathPos } from '@/functions/positionning.ts';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { effectiveRadius, isNeighbor } from '@/functions/collisions.ts';
import { Center, MeshReflectorMaterial, Text, Text3D } from '@react-three/drei';
import montserrat from '@assets/fonts/Montserrat_Regular.json';
import montserratt from '@assets/fonts/Montserrat_Thin_Regular.json';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';

const TWO_PI = Math.PI * 2;

const collision = new Vector3();

// type CarouselProps = {
//     boundaries: object;
//     datas: [];
//     reducer: ReducerType;
//     SETTINGS: SettingsTypes;
// };
interface CarouselProps {
    reducer: ReducerType;
    boundaries: object;
    datas: [];
    SETTINGS: SettingsType;
}
export default function Carousel({
    boundaries,
    datas,
    reducer,
    SETTINGS,
    ...props
}: CarouselProps) {
    // Hook that has all panel control
    // const settings = useSettings(datas);
    const cardRef = useRef(null);
    const id = useId();
    const cards = useMemo(() => {
        return new Array(SETTINGS.CARDS_COUNT).fill(null).map((_, i, self) => ({
            url: datas[i]
                ? datas[i].cover
                : `src/assets/images/img${Math.floor(i % 10) + 1}.png`,
            description: datas[i] ? datas[i].description : 'description',
            title: datas[i] ? datas[i].title : 'title',
            cardTitle: datas[i] ? datas[i].cardTitle : 'cardTitle',
            content: datas[i]
                ? datas[i].content
                : [
                      'Intégration du Canvas avec ThreeJS',
                      'Créé avec React et TypeScript',
                      "Une implémentation responsive de l'expérience 3D",
                  ],
            stack: datas[i] ? datas[i].stack : {},
            position: SETTINGS.THREED
                ? new Vector3(100, 0, 500)
                : new Vector3(),
            velocity: new Vector3(0, 0, 0),
            rotation: [0, (i / SETTINGS.CARDS_COUNT) * TWO_PI, 0],
            // rotation: [0, Math.PI + (i / settings.CARDS_COUNT) * TWO_PI, 0],
            wander: randFloat(0, TWO_PI),
            animation: SETTINGS.CARD_ANIMATION,
            baseScale: SETTINGS.CARD_SCALE,
            // currentScale: settings.CARD_SCALE,
            active: SETTINGS.ACTIVE_CARD,
            id: datas[i] ? datas[i].id : id + i,
            containerScale: SETTINGS.CONTAINER_SCALE,
            cardAngles: {
                active: Math.atan2(
                    Math.sin((i / SETTINGS.CARDS_COUNT) * TWO_PI) *
                        SETTINGS.CONTAINER_SCALE,
                    Math.cos((i / SETTINGS.CARDS_COUNT) * TWO_PI) *
                        SETTINGS.CONTAINER_SCALE
                ),
                onHold: (i / self.length) * TWO_PI,
            },
        }));
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
        cards.forEach((card) => {
            if (!currentIds.includes(card.id)) {
                reducer.addElements(card);
            } else {
                reducer.updateElements(card);
            }
        });
        if (cards.length < reducer.showElements.length) {
            reducer.deleteElements(cards);
        }
    }, [cards]);

    useFrame((state, delta) => {
        // const helper = new AxesHelper(5);
        // state.scene.add(helper);
        // Grab existing active card in the index
        const activeCard = reducer.showElements.findIndex(
            (el) => el.isActive || el.isClicked
        );

        const activeForwardOffset = 0.5;
        const total = reducer.showElements.length;

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
                    const countWithoutActive = total - 1;
                    const angleStep = TWO_PI / countWithoutActive;
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
                // targetRotationY = onHold + Math.PI;

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

                    // for (let index = 0; index < reducer.showElements.length; index++) {
                    //     const actualItem = reducer.showElements[index];
                    //     // const sides = getSidesPositions(
                    //     //     actualItem.ref.current,
                    //     //     actualItem.ref
                    //     // );
                    //     collision.multiplyScalar(0);
                    //     // actualItem.width = actualItem.ref.current
                    //     reducer.showElements.forEach((c, i) => {
                    //         if (index === i) {
                    //             return;
                    //         }
                    //         if (actualItem.ref && c.ref) {
                    //             const othersCardPosition = c.ref.current.position;
                    //             const actualCardPosition =
                    //                 actualItem.ref.current.position;
                    //             const inRangeItem =
                    //                 actualCardPosition.distanceTo(othersCardPosition) -
                    //                 effectiveRadius(actualItem, c);
                    //             /**
                    //              * General collision -
                    //              * Checks if any item collide
                    //              */
                    //             if (
                    //                 inRangeItem <= 0 &&
                    //                 i !== index + 1 &&
                    //                 i !== index - 1
                    //             ) {
                    //                 console.log(
                    //                     'There is collision between some cards'
                    //                 );
                    //             }
                    //             const neighborDistance = Math.abs(inRangeItem);
                    //             const margin = 0.2;
                    //             /**
                    //              * Collision between 2 close items
                    //              */
                    //             if (isNeighbor(index, i)) {
                    //                 if (c.isActive) {
                    //                     return easing.damp3(
                    //                         c.ref.current.position,
                    //                         [0, 0, 0], // Position cible pendant le hover
                    //                         0.15,
                    //                         delta
                    //                     );
                    //                 } else {
                    //                     easing.damp3(
                    //                         c.ref.current.position,
                    //                         c.position,
                    //                         0.15,
                    //                         delta
                    //                     );
                    //                 }
                    //                 const angleStep =
                    //                     MathPI / reducer.showElements.length; // Espacement angulaire uniforme
                    //                 const currentAngle = i * angleStep; // Angle pour chaque carte
                    //                 if (inRangeItem > c.presenceRadius + margin) {
                    //                     // c.ref.current.position.set(
                    //                     //     Math.sin(
                    //                     //         (i / reducer.showElements.length) * MathPI
                    //                     //     ) * settings.CONTAINER_SCALE,
                    //                     //     0,
                    //                     //     Math.cos(
                    //                     //         (i / reducer.showElements.length) * MathPI
                    //                     //     ) * settings.CONTAINER_SCALE
                    //                     // );
                    //                     easing.damp3(
                    //                         c.ref.current.position,
                    //                         [
                    //                             Math.sin(
                    //                                 (i / reducer.showElements.length) *
                    //                                     MathPI
                    //                             ) * settings.CONTAINER_SCALE,
                    //                             0,
                    //                             Math.cos(
                    //                                 (i / reducer.showElements.length) *
                    //                                     MathPI
                    //                             ) * settings.CONTAINER_SCALE,
                    //                         ],
                    //                         //   [position.x, position.y, position.z - 1],
                    //                         0.15,
                    //                         delta
                    //                     );
                    //                     // c.ref.current.position.set(
                    //                     //     Math.sin(currentAngle) *
                    //                     //         settings.CONTAINER_SCALE,
                    //                     //     0,
                    //                     //     Math.cos(currentAngle) *
                    //                     //         settings.CONTAINER_SCALE
                    //                     // );
                    //                     console.log(
                    //                         'Repositionnement des cartes pour combler le vide.'
                    //                     );
                    //                     // set({
                    //                     //     CONTAINER_SCALE:
                    //                     //         settings.CONTAINER_SCALE - 0.01,
                    //                     // });
                    //                 } else if (
                    //                     inRangeItem <=
                    //                     c.presenceRadius - margin
                    //                 ) {
                    //                     set({
                    //                         CONTAINER_SCALE:
                    //                             settings.CONTAINER_SCALE + 0.01,
                    //                     });
                    //                     console.log(
                    //                         "Les cartes sont trop proches, ajustement de l'anneau."
                    //                     );
                    //                 }
                    //             }
                    //         }
                    //     });
                    // }
                }
            }

            // If no 3D activated we go back in the center
            if (!SETTINGS.THREED) positions = [0, 0, 0];

            // Animating the new positions and rotations
            easing.damp3(position, positions, 0.15, delta);
            easing.damp(rotation, 'y', targetRotationY, 0.15, delta);
            // easing.damp(rotation, 'y', card.cardAngles?.onHold, 0.15, delta);
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

    return reducer.showElements.map((card, i) => (
        // <group key={`${id} ${i * i}`}>

        <Card
            ref={cardRef}
            key={id + i}
            card={card}
            presenceCircle={SETTINGS.PRESENCE_CIRCLE}
            presenceRadius={SETTINGS.PRESENCE_RADIUS * card.baseScale}
            visibleWireframe={SETTINGS.CARD_WIREFRAME}
            reducer={reducer}
            {...SETTINGS}
        />

        // </group>
    ));
}
