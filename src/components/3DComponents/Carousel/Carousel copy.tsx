import { Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';
import { DoubleSide, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { MathPos } from '@/functions/positionning.ts';
import { effectiveRadius } from '@/functions/collisions.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
    PI_AND_HALF,
    TWO_PI,
} from '@/configs/3DCarousel.config.ts';
import {
    createCardProperties,
    customEasing,
    handleCardCollisions,
    handleNeighborCollision,
} from '@/components/3DComponents/Carousel/Functions.ts';
import { CardContainer } from '@/components/3DComponents/Cards/CardsContainer';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { useLocation } from 'react-router';
import { useLookAtSmooth } from '@/hooks/useLookAtSmooth.tsx';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { Float } from '@react-three/drei';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon.tsx';

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
    loadingStage,
    numberOfCardsToShow,
}: CarouselProps) {
    // const { boundaries, datas, reducer, SETTINGS } = useOutletContext();

    const segmentsCount = reducer.isMobile ? 6 : 16;
    const textureQuality = reducer.isMobile ? 512 : 1024;
    const animationSpeed = reducer.isMobile ? 0.8 : 1;

    const visibleCards = datas.slice(0, SETTINGS.CARDS_COUNT);

    const frameCountRef = useRef(0);
    const projectsRef = useRef(null);
    const titleRef = useRef(null);

    const { lookAtSmooth } = useLookAtSmooth();

    // Animations Refs
    const startPosRef = useRef(new Vector3());
    const targetPosRef = useRef(new Vector3());
    const midPointRef = useRef(new Vector3());
    const bezierPosRef = useRef(new Vector3());

    const location = useLocation();
    const id = useId();

    // États pour l'animation
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [wasActive, setWasActive] = useState(false);
    const [shouldBreathe, setShouldBreathe] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const activeURL = location.pathname.includes('projets');
    const activeProject = location.pathname.split('/')[2];

    // useEffect(() => {
    //     if (isInitialLoading) setIsInitialLoading(false);
    // }, []);

    useEffect(() => {
        // Après le premier rendu, désactiver le mode chargement simplifié
        const timer = setTimeout(() => setIsInitialLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

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
        if (!activeURL) {
            if (isAnimatingIn) setIsAnimatingIn(false);
            if (reducer.activeContent) {
                setShouldBreathe(activeURL);
                reducer.activeContent.isActive = false;
                reducer.activeContent.isClicked = false;
            }
        }

        // Animations init
        if (activeURL && !wasActive && !activeProject) {
            setShouldBreathe(activeURL);
            setAnimationProgress(0);
            setIsAnimatingIn(true);
        }

        setWasActive(activeURL);
    }, [activeURL]);

    useFrame((state, delta) => {
        // if (!projectsRef.current) return;
        // if (frameCountRef.current % 2 !== 0) {
        //     frameCountRef.current++;
        //     return;
        // }
        // frameCountRef.current++;
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
            if (titleRef.current) {
                easing.damp3(
                    titleRef.current?.position,
                    activeURL
                        ? DESKTOP_HTML_TITLE_POSITION_SETTINGS(
                              reducer.contentHeight,
                              -0.4
                          )
                        : DEFAULT_PROJECTS_POSITION_SETTINGS,
                    0.2,
                    delta
                );
            }
            // easing.damp3(
            //     state.camera.position,
            //     ACTIVE_PROJECTS_POSITION_SETTINGS,
            //     0.1,
            //     delta
            // );

            // Breathing effect of the carousel on idle
            if (!reducer.activeContent) {
                const breathingEffect =
                    Math.sin(state.clock.elapsedTime * 2) * 0.002;
                const targetScale = 1 + breathingEffect;
                // On insert, the card will be very wide giving the illusion of a 3D effect
                easing.damp3(
                    projectsRef.current.scale,
                    activeURL
                        ? [targetScale, targetScale, targetScale]
                        : [40, 40, 40],
                    0.3,
                    delta
                );
            }

            if (activeURL) {
                // Rotating effect of the carousel
                const rotationTarget = isAnimatingIn
                    ? animationProgress * PI_AND_HALF
                    : 0;

                easing.damp(
                    projectsRef.current.rotation,
                    'y',
                    rotationTarget,
                    isAnimatingIn ? 0.3 : 0.4,
                    delta
                );
            } else {
                easing.damp3(projectsRef.current.scale, [1, 1, 1], 0.3, delta);
            }
        }

        if (isAnimatingIn) {
            // !! IMPORTANT !! Disable collisions during animation
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

            let wasActive;
            let isFlipping;
            let flipProgress;
            let initialRotation;
            let finalRotation;

            // Recalculate circle formation
            if (activeCard !== -1) {
                // console.log('objects :', reducer.showElements);
                if (i === activeCard) {
                    // wasActive = true;
                    // flipProgress = 0;
                    // isFlipping = true;
                    // initialRotation = rotation.y;
                    // finalRotation = targetRotationY;

                    // if (isFlipping) {
                    //     // Vitesse du flip
                    //     flipProgress += delta;

                    //     // Créer un effet de rotation complète (flip à 360°)
                    //     const flipAmount = Math.PI * 2;

                    //     // Rotation progressive avec effet d'accélération
                    //     rotation.y =
                    //         initialRotation +
                    //         customEasing.backOut(Math.min(1, flipProgress)) *
                    //             flipAmount;

                    //     // Terminer l'animation
                    //     if (flipProgress >= 1) {
                    //         isFlipping = false;
                    //         rotation.y = finalRotation;
                    //     }

                    //     // On ne prend pas la position normale pendant le flip
                    //     return;
                    // }
                    // Finding initial angle position
                    // It should be : [sin(angle)*R, 0, cos(angle)*R]
                    const targetRadius =
                        SETTINGS.CONTAINER_SCALE + activeForwardOffset;
                    positions = MathPos(active, targetRadius);
                    targetRotationY = active;
                } else {
                    // wasActive = false;
                    // isFlipping = false;
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
                handleCardCollisions(
                    item,
                    i,
                    reducer.showElements,
                    SETTINGS.CONTAINER_SCALE,
                    frameCountRef.current,
                    SETTINGS.COLLISIONS,
                    SETTINGS.set
                );
            }

            // If no 3D activated we go back to the center
            if (!SETTINGS.THREED) positions = [0, 0, 0];

            if (isAnimatingIn && activeURL) {
                if (isInitialLoading) {
                    // Animation simplifiée pendant le chargement initial
                    position.lerp(targetPos, Math.min(1, delta * 5));
                    rotation.y = targetRotationY;
                    return;
                }

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
                    // Horizontally larger
                    positions[0] + (i % 2 === 0 ? 10 : -10),
                    // Higher Y-axis position
                    positions[1] - 1,
                    // Deeper Z-axis position
                    positions[2] + (i % 2 === 0 ? -5 : 5)
                );

                // Position along the curvature
                if (cardProgress < 0.5) {
                    // startPos to midPoint
                    const subProgress = cardProgress * 2;
                    bezierPos.lerpVectors(startPos, midPoint, subProgress);

                    // Small bounce effect
                    bezierPos.y += Math.sin(subProgress * Math.PI) * 4;
                } else {
                    // midPoint to targetPos
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
            <Suspense fallback={<PlaceholderIcon />}>
                <group ref={titleRef} rotation={[0, 3.164, 0]}>
                    <Float>
                        <Title>Mes Projets</Title>
                    </Float>
                </group>
            </Suspense>

            {/* <Suspense fallback={<LoadingScene />}> */}
            <CardContainer reducer={reducer} SETTINGS={SETTINGS} />
            {/* </Suspense> */}
        </group>
    );
}
