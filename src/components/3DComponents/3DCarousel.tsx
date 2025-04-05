import { useEffect, useId, useMemo } from 'react';
import Card from './3DCard.tsx';
import { useControls } from 'leva';
import {
    cardsSettings,
    carouselGeneralSettings,
    presenceSettings,
} from '../../configs/3DCarousel.config.tsx';
import { AxesHelper, Vector3 } from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { MathPos } from '@/functions/positionning.ts';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { effectiveRadius, isNeighbor } from '@/functions/collisions.ts';
import { MeshReflectorMaterial, Text, Text3D } from '@react-three/drei';

const TWO_PI = Math.PI * 2;

const collision = new Vector3();

type CarouselProps = {
    boundaries: object;
    datas: [];
    reducer: ReducerType;
};
export default function Carousel({
    boundaries,
    datas,
    reducer,
    ...props
}: CarouselProps) {
    // Override cards count with datas.length
    const carouselSettings = {
        ...carouselGeneralSettings,
        CARDS_COUNT: {
            ...carouselGeneralSettings.CARDS_COUNT,
            value: datas.length,
        },
    };
    // Carousel Settings
    const [settings, set] = useControls(
        'Carousel Settings',
        () => ({
            ...carouselSettings,
        }),
        { collapsed: true }
    );

    // Card Rules Settings
    const { THREED, ALIGNMENT, ...CARD_RULES } = useControls(
        'Card Rules',
        cardsSettings,
        {
            collapsed: true,
        }
    );

    // Collision Detection Settings
    const { PRESENCE_CIRCLE, PRESENCE_RADIUS, CARD_WIREFRAME, COLLISIONS } =
        useControls('Presence Area', presenceSettings, { collapsed: true });

    const id = useId();

    // Marge pour éviter les oscillations fréquentes
    const margin = 0.1;

    const cards = useMemo(() => {
        return new Array(settings.CARDS_COUNT).fill(null).map((_, i, self) => ({
            url: datas[i]
                ? datas[i].cover
                : `src/assets/images/img${Math.floor(i % 10) + 1}.png`,
            description: datas[i].description,
            title: datas[i].title,
            stack: datas[i].stack,
            position: THREED ? new Vector3(100, 0, 500) : new Vector3(),
            velocity: new Vector3(0, 0, 0),
            rotation: [0, (i / settings.CARDS_COUNT) * TWO_PI, 0],
            // rotation: [0, Math.PI + (i / settings.CARDS_COUNT) * TWO_PI, 0],
            wander: randFloat(0, TWO_PI),
            animation: settings.CARD_ANIMATION,
            baseScale: settings.CARD_SCALE,
            // currentScale: settings.CARD_SCALE,
            active: settings.ACTIVE_CARD,
            id: datas[i] ? datas[i].id : id + i,
            containerScale: settings.CONTAINER_SCALE,
            cardAngles: {
                active: Math.atan2(
                    Math.sin((i / settings.CARDS_COUNT) * TWO_PI) *
                        settings.CONTAINER_SCALE,
                    Math.cos((i / settings.CARDS_COUNT) * TWO_PI) *
                        settings.CONTAINER_SCALE
                ),
                onHold: (i / self.length) * TWO_PI,
            },
        }));
    }, [
        settings.CARDS_COUNT,
        settings.CARD_SCALE,
        settings.CONTAINER_SCALE,
        THREED,
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
                        settings.CONTAINER_SCALE + activeForwardOffset;
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
                        settings.CONTAINER_SCALE
                    );
                    targetRotationY = nonActiveCardAngle;
                    // targetRotationY = nonActiveCardAngle + Math.PI;
                }
            } else {
                // If no active cards, we spread them all on the ring
                positions = MathPos(onHold, settings.CONTAINER_SCALE);
                targetRotationY = onHold;
                // targetRotationY = onHold + Math.PI;

                // Calculating collisions
                if (COLLISIONS) {
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
                        let targetScale = settings.CONTAINER_SCALE;

                        // Collision between 2 items
                        if (isNeighbor(i, index)) {
                            if (inRangeItem > element.presenceRadius + margin) {
                                targetScale =
                                    settings.CONTAINER_SCALE - deltaScale;
                            } else if (
                                inRangeItem <=
                                element.presenceRadius - margin
                            ) {
                                targetScale =
                                    settings.CONTAINER_SCALE + deltaScale;
                            }
                            if (
                                Math.abs(
                                    targetScale - settings.CONTAINER_SCALE
                                ) > 0.001
                            ) {
                                set({ CONTAINER_SCALE: targetScale });
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
            if (!THREED) positions = [0, 0, 0];

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
        <group key={id + i}>
            <Text
                position={[
                    card.ref?.current?.position.x,
                    card.ref?.current?.position.y,
                    card.ref?.current?.position.z,
                ]}
                rotation={[0, card.cardAngles?.onHold, 0.0]}
                fontSize={0.3}
                anchorY={-1.55}
                anchorX={'center'}
                color={'black'}
            >
                {card.id}
            </Text>
            <Card
                // key={id + i}
                card={card}
                presenceCircle={PRESENCE_CIRCLE}
                presenceRadius={PRESENCE_RADIUS * card.baseScale}
                visibleWireframe={CARD_WIREFRAME}
                reducer={reducer}
                {...CARD_RULES}
            />
        </group>
    ));
}
