import { useEffect, useId, useMemo, useRef, useState } from 'react';
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

    // Animations Refs
    const startPosRef = useRef(new Vector3());
    const targetPosRef = useRef(new Vector3());
    const midPointRef = useRef(new Vector3());
    const bezierPosRef = useRef(new Vector3());

    const location = useLocation();
    const id = useId();

    // États pour l'animation séquentielle
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [wasActive, setWasActive] = useState(false);
    const [shouldBreathe, setShouldBreathe] = useState(false);

    const activeURL = location.pathname.includes('projets');

    // Fonctions d'easing personnalisées
    const customEasing = {
        // Fonction d'easing élastique (rebond)
        elastic: (x: number): number => {
            const c4 = (2 * Math.PI) / 3;
            return x === 0
                ? 0
                : x === 1
                ? 1
                : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
        },

        // Fonction d'accélération exponentielle
        expOut: (x: number): number => {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        },

        // Fonction avec recul puis avancée
        backOut: (x: number): number => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        },

        // Fonction de rebond simple
        bounce: (x: number): number => {
            const n1 = 7.5625;
            const d1 = 2.75;

            if (x < 1 / d1) {
                return n1 * x * x;
            } else if (x < 2 / d1) {
                return n1 * (x -= 1.5 / d1) * x + 0.75;
            } else if (x < 2.5 / d1) {
                return n1 * (x -= 2.25 / d1) * x + 0.9375;
            } else {
                return n1 * (x -= 2.625 / d1) * x + 0.984375;
            }
        },
    };

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

    /**
     * Démarre l'animation lorsque la page devient active
     */
    useEffect(() => {
        // Turn off animations
        if (!activeURL && isAnimatingIn) {
            setIsAnimatingIn(false);
        }

        // Animations init
        if (activeURL && !wasActive) {
            setShouldBreathe(activeURL);
            setAnimationProgress(0);
            setIsAnimatingIn(true);
        }

        setWasActive(activeURL);
    }, [activeURL]);

    useFrame((state, delta) => {
        frameCountRef.current += 1;

        // CAROUSEL POSITIONING & ANIMATING IF URL IS ACTIVE / NON ACTIVE -
        if (projectsRef.current) {
            easing.damp3(
                projectsRef.current.position,
                activeURL
                    ? ACTIVE_PROJECTS_POSITION_SETTINGS
                    : DEFAULT_PROJECTS_POSITION_SETTINGS,
                0.2,
                delta
            );
            // Breathing effect of the carousel on idle
            const breathingEffect =
                Math.sin(state.clock.elapsedTime * 2) * 0.002;
            const targetScale = 1 + breathingEffect;
            // On insert, the card will be in the center of the screen
            // and very wide giving the illusion of a 3D effect
            easing.damp3(
                projectsRef.current.scale,
                activeURL
                    ? [targetScale, targetScale, targetScale]
                    : [40, 40, 40],
                0.3,
                delta
            );

            if (activeURL) {
                // Rotating effect of the carousel
                const rotationTarget = isAnimatingIn
                    ? -animationProgress * Math.PI * 1.5
                    : 0;

                easing.damp(
                    projectsRef.current.rotation,
                    'y',
                    rotationTarget,
                    isAnimatingIn ? 0.3 : 0.4,
                    delta
                );
            }
        }

        if (isAnimatingIn) {
            SETTINGS.set({ COLLISIONS: false });

            const animationSpeed = 0.22;
            setAnimationProgress((prev) =>
                Math.min(1, prev + delta * animationSpeed)
            );

            if (animationProgress >= 1) {
                setIsAnimatingIn(false);
                SETTINGS.set({ COLLISIONS: true });
            }
        }

        // Grab existing active card in the index
        const activeCard = reducer.showElements.findIndex(
            (el) => el.isActive || el.isClicked
        );

        // Shows the active card in front of the carousel
        const activeForwardOffset = 0.5;

        const startPos = startPosRef.current;
        const targetPos = targetPosRef.current;
        const midPoint = midPointRef.current;
        const bezierPos = bezierPosRef.current;

        reducer.showElements.forEach((item, i) => {
            if (!item.ref || !item.ref.current) return;

            const { position, rotation } = item.ref.current;
            const { active, onHold } = item.cardAngles;

            let positions;
            let targetRotationY = 0;
            let dampingFactor = 0.15;

            // Recalculate circle formation
            if (activeCard !== -1) {
                if (i === activeCard) {
                    // Finding initial angle position
                    // It should be : [sin(angle)*R, 0, cos(angle)*R]
                    const targetRadius =
                        SETTINGS.CONTAINER_SCALE + activeForwardOffset;
                    positions = MathPos(active, targetRadius);
                    targetRotationY = active;
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
                }
            } else {
                // If no active cards, we spread them all on the ring
                positions = MathPos(onHold, SETTINGS.CONTAINER_SCALE);
                targetRotationY = onHold;

                // Calculating collisions
                if (SETTINGS.COLLISIONS && frameCountRef.current % 10 === 0) {
                    reducer.showElements.forEach((element, index) => {
                        if (index === i) return;

                        const inRangeItem =
                            position.distanceTo(element.ref.current.position) -
                            effectiveRadius(item, element);

                        // Collision handler - en une seule étape
                        const newScale = handleNeighborCollision(
                            i,
                            index,
                            inRangeItem,
                            element.presenceRadius,
                            SETTINGS.CONTAINER_SCALE
                        );

                        if (newScale !== null) {
                            SETTINGS.set({ CONTAINER_SCALE: newScale });
                        }
                    });
                }
            }

            // If no 3D activated we go back to the center
            if (!SETTINGS.THREED) positions = [0, 0, 0];

            if (isAnimatingIn && activeURL) {
                const cardsTotal = reducer.showElements.length;

                // Timing for each card
                // Adding a bit of delay for the first card
                const cardStartProgress = (i / cardsTotal) * (1 - 0.3);
                // Modify the end timing to make it more dynamic
                const cardEndProgress =
                    cardStartProgress + 1 / cardsTotal + 0.1;

                // 0 to 1
                let cardProgress;

                if (animationProgress < cardStartProgress) {
                    cardProgress = 0;
                } else if (animationProgress > cardEndProgress) {
                    cardProgress = 1;
                } else {
                    // Animating
                    cardProgress =
                        (animationProgress - cardStartProgress) /
                        (cardEndProgress - cardStartProgress);

                    // Easing function for the animation
                    cardProgress = customEasing.expOut(cardProgress);
                }

                startPos.set(
                    positions[0] - 8 + Math.random() * 16,
                    positions[1] - 15,
                    positions[2] - 10 + Math.random() * 5
                );

                // Final position of the card
                targetPos.set(positions[0], positions[1], positions[2]);

                // Curvature of the animation
                midPoint.set(
                    positions[0] + (i % 2 === 0 ? 10 : -10), // Amplitude horizontale encore plus large
                    positions[1] - 1, // Presque à la hauteur finale
                    positions[2] + (i % 2 === 0 ? -5 : 5) // Plus de profondeur
                );

                // Calculer la position le long de la courbe
                if (cardProgress < 0.5) {
                    // startPos to midPoint
                    // 0-0.5 → 0-1
                    const subProgress = cardProgress * 2;
                    bezierPos.lerpVectors(startPos, midPoint, subProgress);

                    // Small bounce effect
                    bezierPos.y += Math.sin(subProgress * Math.PI) * 4;
                } else {
                    // midPoint to targetPos
                    // 0.5-1 → 0-1
                    const subProgress = (cardProgress - 0.5) * 2;
                    bezierPos.lerpVectors(midPoint, targetPos, subProgress);

                    // Small bounce effect at the end
                    if (subProgress > 0.8) {
                        bezierPos.y +=
                            Math.sin((subProgress - 0.8) * 5 * Math.PI) * 0.3;
                    }

                    // Bounce effect on the Y axis when the card is close to the target position
                    const waveIntensity = (1 - cardProgress) * 0.7;
                    bezierPos.y +=
                        Math.sin(cardProgress * Math.PI * 3) *
                        0.2 *
                        waveIntensity;
                    // const waveIntensity = 1 - cardProgress;
                    // bezierPos.y += Math.sin(cardProgress) * 3 * waveIntensity;
                }

                // Rotation effect on incoming cards
                let currentRotationY;
                if (cardProgress < 0.3) {
                    // Initial orientation
                    const initialAngle = (i % 2 === 0 ? -1 : 1) * Math.PI * 0.3;
                    currentRotationY =
                        initialAngle * (1 - cardProgress / 0.3) +
                        targetRotationY * (cardProgress / 0.3);
                } else {
                    // Final orientation
                    currentRotationY = targetRotationY;
                }

                // Tilt effect on incoming cards
                const tiltX =
                    (1 - cardProgress) *
                    1 *
                    Math.sin(cardProgress * Math.PI * 1.5);
                const tiltZ =
                    Math.sin(cardProgress * Math.PI * 3) *
                    0.15 *
                    (1 - cardProgress);

                // Applying the transformations to the card's position and rotation
                position.lerp(bezierPos, Math.min(1, delta * 15));
                rotation.y = currentRotationY;
                rotation.x = tiltX;
                rotation.z = tiltZ;
                return;
            }

            // Animating the new positions and rotations around the circle
            easing.damp3(position, positions, dampingFactor, delta);
            easing.damp(rotation, 'y', targetRotationY, dampingFactor, delta);
        });
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
