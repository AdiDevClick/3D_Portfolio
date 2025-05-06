import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { DoubleSide, Mesh, Vector3 } from 'three';
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
import { Group } from 'three';
import { frustumChecker } from '@/utils/frustrumChecker.ts';

const activeForwardOffset = 0.5;
const animationSpeed = 0.22;

let animationProgress = 0;

const startPos = new Vector3();
const targetPos = new Vector3();
const midPoint = new Vector3();
const bezierPos = new Vector3();

let frameCountRef = 0;

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
    const {
        contentHeight,
        activeContent,
        showElements,
        isMobile,
        loadedCount,
    } = reducer;

    const projectsRef = useRef<Group>(null!);
    const titleRef = useRef<Group>(null!);
    const boundariesRef = useRef<Mesh>(null!);

    const location = useLocation();
    const id = useId();

    // États pour l'animation
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const activeURL = location.pathname.includes('projets');
    const activeProject = location.pathname.split('/')[2];

    /**
     * Création des propriétés des cartes -
     */
    const cardsMemo = useMemo(() => {
        return new Array(SETTINGS.CARDS_COUNT)
            .fill(null)
            .map((_, i, self) =>
                createCardProperties(SETTINGS, datas, i, self, id, isMobile)
            );
    }, [
        SETTINGS.CARDS_COUNT,
        SETTINGS.CARD_SCALE,
        SETTINGS.CONTAINER_SCALE,
        SETTINGS.THREED,
        id,
        datas,
    ]);

    const cardPositionsMemo = useMemo(() => {
        if (!showElements.length)
            return {
                itemPositions: {} as Record<
                    string,
                    ReturnType<typeof calculateCardPositions>
                >,
                activeCard: -1,
            };

        const activeCard = showElements.findIndex(
            (el) => el.isActive || el.isClicked
        );

        const itemPositions = showElements.reduce<
            Record<string, ReturnType<typeof calculateCardPositions>>
        >((acc, item, i) => {
            // if (!item.ref) return acc;

            acc[item.id] = calculateCardPositions(
                item,
                i,
                activeCard,
                showElements.length,
                SETTINGS.CONTAINER_SCALE,
                activeForwardOffset,
                SETTINGS.THREED
            );

            return acc;
        }, {});
        return { itemPositions, activeCard };
    }, [
        showElements.map((el) => el.id).join(','),
        showElements.map((el) => el.isActive || el.isClicked).join(','),
        showElements.length,
        SETTINGS.CONTAINER_SCALE,
        SETTINGS.THREED,
        activeForwardOffset,
    ]);

    /**
     * Crer l'array du reducer qui sera partagé -
     * Il ne sera créé qu'une fois -
     */
    useEffect(() => {
        const currentIds = showElements.map((el) => el.id);
        cardsMemo.forEach((card) => {
            if (!currentIds.includes(card.id)) {
                reducer.addElements(card);
            } else {
                reducer.updateElements(card);
            }
        });
        if (cardsMemo.length < showElements.length) {
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
            if (activeContent) {
                // setShouldBreathe(activeURL);
                activeContent.isActive = false;
                activeContent.isClicked = false;
            }
        }

        // Animations init
        if (activeURL && !activeProject && !isInitialLoading) {
            // setShouldBreathe(activeURL);
            animationProgress = 0;
            setIsAnimatingIn(true);
        }
    }, [activeURL, isInitialLoading]);

    useFrame((state, delta) => {
        if (!projectsRef.current) return;

        frameCountRef += 1;

        frustumChecker(
            [projectsRef.current, titleRef.current],
            state,
            frameCountRef,
            isMobile
        );

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
        updateTitlePosition(titleRef, contentHeight ?? 0, delta);
        // Handle animation progress

        if (isAnimatingIn) {
            // !! IMPORTANT !! Disable collisions during animation
            SETTINGS.set({ COLLISIONS: false });

            animationProgress = Math.min(
                1,
                animationProgress + delta * animationSpeed
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
        const { itemPositions, activeCard } = cardPositionsMemo;
        showElements.forEach((item, i) => {
            if (
                !item.ref?.current ||
                !itemPositions[item.id] ||
                !projectsRef.current.visible
            )
                return;

            // Calculate positions for this card
            const { positions, targetRotationY } = itemPositions[item.id];

            // Handle animation during entry
            if (isAnimatingIn && activeURL) {
                const animationHandled = animateCardEntry(
                    item,
                    i,
                    showElements.length,
                    targetRotationY,
                    commonParams,
                    { startPos, targetPos, midPoint, bezierPos, positions }
                );

                if (animationHandled) return;
            }

            // Handle collisions
            if (activeCard === -1 && SETTINGS.COLLISIONS && activeURL) {
                handleCardCollisions(
                    item,
                    i,
                    showElements,
                    SETTINGS.CONTAINER_SCALE,
                    frameCountRef,
                    SETTINGS.COLLISIONS,
                    SETTINGS.set
                );
            }
            if (!activeURL) return;
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

    useEffect(() => {
        if (loadedCount >= showElements.length) {
            setIsInitialLoading(false);
        }
    }, [showElements, loadedCount]);

    return (
        <group visible={activeURL} ref={projectsRef}>
            <mesh ref={boundariesRef} visible={SETTINGS.debug}>
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
            <Float>
                <Title
                    name={'carousel__title'}
                    ref={titleRef}
                    rotation={[0, 3.164, 0]}
                >
                    Mes Projets
                </Title>
            </Float>

            <CardContainer reducer={reducer} SETTINGS={SETTINGS} />
        </group>
    );
}
