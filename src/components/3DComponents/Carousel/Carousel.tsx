import {
    act,
    Suspense,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Mesh, Object3DEventMap, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import {
    animateCardEntry,
    animateCarouselContainer,
    calculateCardPositions,
    createCardProperties,
    handleCardCollisions,
    updateTitlePosition,
} from '@/components/3DComponents/Carousel/Functions';
import { useLocation, useParams } from 'react-router';
import { Billboard, useScroll } from '@react-three/drei';
import { Group } from 'three';
import { frustumChecker } from '@/utils/frustrumChecker';
import datasJson from '@data/projects.json';
import { ElementType } from '@/hooks/reducers/carouselTypes';

const datas = datasJson as unknown as ElementType[];

import MemoizedCardsContainer from '@/components/3DComponents/Cards/CardsContainer';
import { CarouselProps } from '@/components/3DComponents/Carousel/FunctionsTypes';
import {
    CARD_ACTIVE_FORWARD_OFFSET,
    CARD_ANIMATION_SPEED,
} from '@/configs/Cards.config';
import { debugOrangeBox } from '@/components/3DComponents/Carousel/CarouselMaterials';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';

let animationProgress = 0;

const startPos = new Vector3();
const targetPos = new Vector3();
const midPoint = new Vector3();
const bezierPos = new Vector3();

let frameCountRef = 0;
// let isCarouselLoaded = false;
let count = 0;
export default function Carousel({
    boundaries,
    reducer,
    SETTINGS,
}: CarouselProps) {
    const {
        contentHeight,
        activeContent,
        showElements,
        isMobile,
        allCardsLoaded,
        visible,
        generalScaleX,
    } = reducer;

    const projectsRef = useRef<Group>(null!);
    const titleRef = useRef<Mesh | Group<Object3DEventMap>>(null!);
    const boundariesRef = useRef<Mesh>(null!);

    const location = useLocation();
    const params = useParams();
    const id = useId();
    const scroll = useScroll();

    // États pour l'animation
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isCarouselLoaded, setIsCarouselLoaded] = useState(false);

    const activeURL = location.pathname.includes('projets');
    const activeProject = activeURL && params.id;

    /**
     * Création des propriétés des cartes -
     */
    const cardsMemo = useMemo(() => {
        return new Array(SETTINGS.CARDS_COUNT)
            .fill(null)
            .map((_, i, self) =>
                createCardProperties(SETTINGS, datas, i, self, id, isMobile)
            );
    }, [SETTINGS.CARDS_COUNT, SETTINGS.CARD_SCALE, SETTINGS.CONTAINER_SCALE]);

    /**
     * Card positions -
     * @description  This will calculate the positions of the cards
     */
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
                CARD_ACTIVE_FORWARD_OFFSET,
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
        CARD_ACTIVE_FORWARD_OFFSET,
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
            reducer.deleteElements(cardsMemo as unknown as ElementType[]);
        }
    }, [cardsMemo]);

    /**
     * Démarre l'animation lorsque la page devient active
     */
    useEffect(() => {
        // Leave the page ? - Turn off animations
        if (!activeURL) {
            if (isAnimatingIn) setIsAnimatingIn(false);
            setIsCarouselLoaded(false);
            if (activeContent) {
                // setShouldBreathe(activeURL);
                activeContent.isActive = false;
                activeContent.isClicked = false;
            }
            return;
        }

        // Animations init
        if (activeURL) {
            // Make sure the carousel is loaded when direct URL access
            if (activeProject && !isCarouselLoaded) {
                setIsCarouselLoaded(true);
                return;
            }

            if (!activeProject && !isInitialLoading && !isCarouselLoaded) {
                // setShouldBreathe(activeURL);
                animationProgress = 0;
                setIsAnimatingIn(true);
                return;
            }
            // !! IMPORTANT !! Reset any active content
            if (
                visible === 'card-detail' &&
                !activeProject &&
                activeContent?.isClicked
            ) {
                if (activeContent) {
                    activeContent.isActive = false;
                    activeContent.isClicked = false;
                }
            }
        }
    }, [activeURL, isInitialLoading, activeProject, visible]);

    if (count > 0) count = 0;
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

        // animate carousel container
        animateCarouselContainer(
            projectsRef,
            isAnimatingIn,
            activeURL,
            activeContent,
            state,
            commonParams
        );

        // Update title position
        if (isCarouselLoaded)
            updateTitlePosition(titleRef, contentHeight ?? 0, delta);

        // Handle animation progress
        if (isAnimatingIn) {
            // !! IMPORTANT !! Disable collisions during animation
            SETTINGS.set({ COLLISIONS: false });
            if (!isCarouselLoaded) setIsCarouselLoaded(true);

            animationProgress = Math.min(
                1,
                animationProgress + delta * CARD_ANIMATION_SPEED
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
        if (allCardsLoaded) {
            setIsInitialLoading(false);
        }
    }, [showElements, allCardsLoaded]);

    return (
        <group visible={activeURL} ref={projectsRef}>
            <mesh
                receiveShadow={false}
                castShadow={false}
                ref={boundariesRef}
                visible={SETTINGS.debug}
                material={debugOrangeBox}
            >
                <boxGeometry
                    args={[boundaries.x, boundaries.y, boundaries.z]}
                />
            </mesh>
            <Billboard>
                <FloatingTitle
                    text="Mes Projets"
                    scalar={isMobile ? generalScaleX * 1.2 : generalScaleX}
                    name={'carousel__title'}
                    ref={titleRef}
                    // size={40}
                    rotation={[0, 3.164, 0]}
                />
            </Billboard>

            <Suspense fallback={null}>
                <MemoizedCardsContainer
                    reducer={reducer}
                    SETTINGS={SETTINGS}
                    isCarouselLoaded={isCarouselLoaded}
                />
            </Suspense>
            {/* <mesh
                visible={activeURL}
                position-y={-1.2}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[3, 20]} />
                <MeshReflectorMaterial
                    color="#878790"
                    blur={[400, 400]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={3}
                    depthScale={1}
                    minDepthThreshold={0.85}
                    metalness={0}
                    roughness={1}
                />
            </mesh> */}

            {/* <Suspense fallback={<PlaceholderIcon />}>
                <CardsContainer reducer={reducer} SETTINGS={SETTINGS} />
            </Suspense> */}

            {/* <mesh
                receiveShadow
                position={[0, -1.2, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                    blur={[40, 10]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={15}
                    depthScale={1}
                    minDepthThreshold={0.85}
                    color="#151515"
                    metalness={0.6}
                    roughness={0.5}
                />
            </mesh> */}
            {/* <mesh
                receiveShadow
                position={[0, -1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={[10, 10, 1]}
            >
                <planeGeometry />
                <meshStandardMaterial
                    color="#f0f0f0"
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh> */}
            {/* <ContactShadows
                frames={1}
                position={[0, -1, 0]}
                blur={1}
                opacity={0.6}
            /> */}
        </group>
    );
}

// Ajouter avant votre composant ParticlesEffect
function GradientFloor() {
    return (
        <mesh
            receiveShadow
            position={[0, -1.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[20, 20, 1]}
        >
            <planeGeometry />
            <meshStandardMaterial
                color="#f8f0ea"
                roughness={0.7}
                metalness={0.1}
                envMapIntensity={0.8}
            >
                {/* Shader pour créer un dégradé radial */}
                <shaderMaterial
                    attach="onBeforeCompile"
                    args={[
                        (shader) => {
                            shader.fragmentShader =
                                shader.fragmentShader.replace(
                                    '#include <color_fragment>',
                                    `
                            #include <color_fragment>
                            // Créer un dégradé radial
                            float dist = length(vUv - vec2(0.5));
                            float gradient = smoothstep(0.4, 0.8, dist);
                            diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.85, gradient);
                            `
                                );
                        },
                    ]}
                />
            </meshStandardMaterial>
        </mesh>
    );
}
