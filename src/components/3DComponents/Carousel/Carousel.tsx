import { Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';
import { DoubleSide, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import {
    animateCardEntry,
    calculateCardPositions,
    createCardProperties,
    handleCardCollisions,
    updateCarouselContainer,
    updateTitlePosition,
} from '@/components/3DComponents/Carousel/Functions.ts';
import { CardContainer } from '@/components/3DComponents/Cards/CardContainer.tsx';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { useLocation } from 'react-router';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { Float } from '@react-three/drei';
import { Group } from 'three/examples/jsm/libs/tween.module.js';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon.tsx';

const activeForwardOffset = 0.5;

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

    const frameCountRef = useRef(0);
    const projectsRef = useRef<Group>(null!);
    const titleRef = useRef<Group>(null!);

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

    const startPos = startPosRef.current;
    const targetPos = targetPosRef.current;
    const midPoint = midPointRef.current;
    const bezierPos = bezierPosRef.current;

    useFrame((state, delta) => {
        if (!projectsRef.current) return;
        frameCountRef.current += 1;

        const { contentHeight, activeContent, showElements } = reducer;
        const commonParams = { animationProgress, delta };

        // Update carousel container
        updateCarouselContainer(
            projectsRef,
            isAnimatingIn,
            activeURL,
            activeContent,
            state,
            commonParams
        );

        // Update title position
        updateTitlePosition(titleRef, activeURL, contentHeight ?? 0, delta);

        // Handle animation progress
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

            // // Handle rotation during animation
            // if (rotation) {
            //     handleCarouselRotation(
            //         rotation,
            //         isAnimatingIn,
            //         animationProgress,
            //         delta
            //     );
            // }
        }

        // Find active card
        const activeCard = showElements.findIndex(
            (el) => el.isActive || el.isClicked
        );

        // Handle each card
        showElements.forEach((item, i) => {
            if (!item.ref || !item.ref.current) return;

            // Calculate positions for this card
            const { positions, targetRotationY } = calculateCardPositions(
                item,
                i,
                activeCard,
                showElements.length,
                SETTINGS.CONTAINER_SCALE,
                activeForwardOffset,
                SETTINGS.THREED
            );

            // Handle collisions
            if (activeCard === -1) {
                handleCardCollisions(
                    item,
                    i,
                    showElements,
                    SETTINGS.CONTAINER_SCALE,
                    frameCountRef.current,
                    SETTINGS.COLLISIONS,
                    SETTINGS.set
                );
            }

            // Handle animation during entry
            if (isAnimatingIn && activeURL) {
                const animationHandled = animateCardEntry(
                    item,
                    i,
                    showElements.length,
                    isInitialLoading,
                    targetRotationY,
                    commonParams,
                    { startPos, targetPos, midPoint, bezierPos, positions }
                );

                if (animationHandled) return;
            }

            // Normal positioning
            const { position, rotation } = item.ref.current;

            easing.damp3(
                position,
                positions as [number, number, number],
                0.15,
                delta
            );
            easing.damp(rotation, 'y', targetRotationY, 0.15, delta);
        });
    });

    return (
        <group ref={projectsRef}>
            <Suspense fallback={null}>
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
            </Suspense>
            <group ref={titleRef} rotation={[0, 3.164, 0]}>
                <Suspense fallback={<PlaceholderIcon />}>
                    {titleRef.current && (
                        <Float>
                            <Title>Mes Projets</Title>
                        </Float>
                    )}
                </Suspense>
            </group>

            <CardContainer reducer={reducer} SETTINGS={SETTINGS} />
        </group>
    );
}
