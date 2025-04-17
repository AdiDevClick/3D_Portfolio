import { useEffect, useId, useMemo, useRef } from 'react';
import { DoubleSide, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { MathPos } from '@/functions/positionning.ts';
import { effectiveRadius } from '@/functions/collisions.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    TWO_PI,
} from '@/configs/3DCarousel.config.ts';
import {
    createCardProperties,
    handleNeighborCollision,
} from '@/components/3DComponents/Carousel/Functions.ts';
import { CardContainer } from '@/components/3DComponents/Cards/CardContainer.tsx';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { useLocation } from 'react-router';

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
    // const { boundaries, datas, reducer, SETTINGS } = useOutletContext();

    const frameCountRef = useRef(0);
    const projectsRef = useRef(null);

    const location = useLocation();
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

        // if (frameCountRef.current % 2 === 0) {
        // POSITIONING IF URL IS ACTIVE / NON ACTIVE -
        if (projectsRef.current) {
            const activeURL = location.pathname.includes('projets');
            easing.damp3(
                projectsRef.current.position,
                activeURL
                    ? ACTIVE_PROJECTS_POSITION_SETTINGS
                    : DEFAULT_PROJECTS_POSITION_SETTINGS,
                0.2,
                delta
            );
        }
    });

    return (
        <group ref={projectsRef}>
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
