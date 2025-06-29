/**
 * CAROUSEL FUNCTIONS
 */

// Extending Window interface to include custom properties
interface CustomWindow extends Window {
    _textureCache?: Record<string, any>;
    _textureCacheStats?: {
        hits: number;
        misses: number;
        totalLoaded: number;
        savedLoadTime: number;
    };
}

declare global {
    interface Window {
        _textureCache?: Record<string, any>;
        _textureCacheStats?: {
            hits: number;
            misses: number;
            totalLoaded: number;
            savedLoadTime: number;
        };
    }
}

import { CollisionConfig } from '@/components/3DComponents/Carousel/FunctionsTypes.ts';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_CARD_POSITION,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
    PI_AND_HALF,
    TWO_PI,
} from '@/configs/3DCarousel.config.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { effectiveRadius, isNeighbor } from '@/functions/collisions.ts';
import { MathPos } from '@/functions/positionning.ts';
import { wait } from '@/functions/promises';
import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { RootState, ThreeEvent } from '@react-three/fiber';
import { easing } from 'maath';
import { RefObject, WheelEvent } from 'react';
import {
    Cache,
    Euler,
    Group,
    LinearFilter,
    LinearMipmapLinearFilter,
    Mesh,
    TextureLoader,
    Vector3,
} from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';

type commonParamsTypes = {
    animationProgress: number;
    delta: number;
};
//
// const hoverPromisesArray = [];
const hoverPromisesArray = new Map<string, Promise<void>>();

/**
 * Définit les propriétés qui seront intégrées aux cartes.
 *
 * @param datas - Les données des cartes.
 * @param i - L'index dans l'array du .map.
 * @param self - Le self array du .map.
 * @param id - String définit par le useId().
 */
export function createCardProperties(
    SETTINGS: SettingsType,
    datas: ElementType[],
    i: number,
    self: ElementType[],
    id: string,
    isMobile: boolean
) {
    if (!window._textureCache) {
        window._textureCache = {};
        window._textureCacheStats = {
            hits: 0,
            misses: 0,
            totalLoaded: 0,
            savedLoadTime: 0,
        };
    }

    const defaultContent = {
        title: 'title',
        cardTitle: 'cardTitle',
        url: `assets/images/img${Math.floor(i % 10) + 1}.png`,
        description: 'description',
        content: [
            'Intégration du Canvas avec ThreeJS',
            'Créé avec React et TypeScript',
            "Une implémentation responsive de l'expérience 3D",
        ],
        stack: {
            JavaScript: 'assets/icons/javascript.svg',
            CSS: 'assets/icons/css.svg',
            HTML: 'assets/icons/html.svg',
        },
        links: [
            {
                name: 'GitHub',
                link: 'https://github.com/AdiDevClick/OC_SEO',
                logo: 'assets/icons/github.svg',
            },
            {
                name: 'Visit Website',
                link: 'https://adidevclick.github.io/OC_SEO/',
                logo: 'assets/icons/github.svg',
            },
        ],
    };

    // const texturePath = datas[i]?.cover || defaultContent.url;

    // let texture;
    // // let startTime;

    // Cache.enabled = true;

    // // Utiliser une texture en cache si disponible
    // if (window._textureCache[texturePath]) {
    //     texture = window._textureCache[texturePath];
    //     // window._textureCacheStats.hits++;
    //     // console.log(`✅ Texture CACHE HIT: ${texturePath}`);
    // } else {
    //     // Sinon charger avec des paramètres optimisés
    //     const textureLoader = new TextureLoader();

    //     // Réduire la taille des textures pour mobile
    //     const url = isMobile
    //         ? texturePath.replace('.png', '-small.png')
    //         : texturePath;

    //     // Mesurer le temps de chargement
    //     // startTime = performance.now();
    //     // window._textureCacheStats.misses++;
    //     // console.log(`🔄 Loading texture: ${texturePath}`);

    //     texture = textureLoader.load(texturePath, (loadedTexture) => {
    //         // Optimiser
    //         loadedTexture.generateMipmaps = !isMobile;
    //         loadedTexture.minFilter = isMobile
    //             ? LinearFilter
    //             : LinearMipmapLinearFilter;
    //         loadedTexture.anisotropy = isMobile ? 1 : 4;

    //         // Stocker dans le cache
    //         window._textureCache[texturePath] = loadedTexture;

    //         // Statistiques
    //         // const loadTime = performance.now() - startTime;
    //         // window._textureCacheStats.totalLoaded++;
    //         // window._textureCacheStats.savedLoadTime += loadTime;
    //         // console.log(
    //         //     `✅ Texture loaded in ${loadTime.toFixed(2)}ms: ${texturePath}`
    //         // );
    //     });
    // }

    // Optimiser la texture
    // texture.generateMipmaps = !isMobile;
    // texture.minFilter = isMobile ? LinearFilter : LinearMipmapLinearFilter;
    // texture.anisotropy = 4;

    const angle = (i / SETTINGS.CARDS_COUNT) * TWO_PI;
    const position = SETTINGS.THREED
        ? DEFAULT_CARD_POSITION
        : DEFAULT_CARD_POSITION;
    const rotation = [0, angle, 0];

    const cardAngles = {
        active: Math.atan2(
            Math.sin(angle) * SETTINGS.CONTAINER_SCALE,
            Math.cos(angle) * SETTINGS.CONTAINER_SCALE
        ),
        onHold: (i / self.length) * TWO_PI,
    };

    return {
        url: datas[i]?.cover || defaultContent.url,
        description: datas[i]?.description || defaultContent.description,
        title: datas[i]?.title || defaultContent.title,
        cardTitle: datas[i]?.cardTitle || defaultContent.cardTitle,
        content: datas[i]?.content || defaultContent.content,
        stack: datas[i]?.stack || defaultContent.stack,
        links: datas[i]?.links || defaultContent.links,
        position,
        velocity: new Vector3(0, 0, 0),
        rotation,
        wander: randFloat(0, TWO_PI),
        animation: SETTINGS.CARD_ANIMATION,
        baseScale: SETTINGS.CARD_SCALE,
        loaded: SETTINGS.ACTIVE_CARD,
        id: datas[i]?.id || `${id}${i}`,
        containerScale: SETTINGS.CONTAINER_SCALE,
        cardAngles,
        isInitialized: false,
        currentWidth: 1,
        currentScale: 1,
        bending: SETTINGS.BENDING,
        // texture,
    };
}

// const allowedClosestClasses = [
//     '.card',
//     '.card__close',
//     '.card__title',
//     '.card__description',
//     '.card__content',
// ];

/**
 * Gère le clic sur une carte
 */
export async function onClickHandler(
    e: ThreeEvent<MouseEvent>,
    card: ElementType,
    reducer: ReducerType,
    location: { pathname: string },
    navigate: any,
    isMobile: boolean,
    isCarouselMoving: boolean,
    isCarouselClicked: boolean
): Promise<void> {
    e.stopPropagation();
    // Deny any other clicked elements if one is opened
    if (reducer.activeContent && reducer.activeContent?.id !== card.id) {
        return;
    }

    if (isCarouselMoving && e.nativeEvent.type === 'pointerup') {
        return;
    }

    if (
        !isMobile &&
        (isCarouselClicked || isCarouselMoving) &&
        e.nativeEvent.type === 'click'
    ) {
        if (
            !e.nativeEvent.target ||
            // !(e.nativeEvent.target as HTMLElement).closest('.card__close')
            !(e.nativeEvent.target as HTMLElement).closest('.card')
        ) {
            return;
        }
    }

    if (card.isClicked && card.isActive) {
        reducer.activateElement(card, false);
    } else {
        reducer.activateElement(card, true);
        await wait(300);
    }

    reducer.clickElement(card);
    navigate(!card.isClicked ? `/projets/${card.id}` : '/projets', {
        // navigate(!card.isClicked ? `${location.pathname}/${card.id}` : '/projets', {
        replace: false,
    });
}

/**
 * Gère la sortie du pointeur d'une carte
 */
export function onPointerOut(
    e: ThreeEvent<PointerEvent>,
    card: ElementType,
    reducer: ReducerType,
    isCarouselMoving: boolean
) {
    e.stopPropagation();
    if (reducer.activeContent?.isClicked || isCarouselMoving) return;
    // console.log('activeCard', reducer.activeContent?.id);

    if (reducer.activeContent?.id === card.id && !card.isClicked) {
        // console.log(
        //     'POINTER OUT EFFECTUE',
        //     card.id,
        //     reducer.activeContent?.id,
        //     card.ref?.current.position
        // );
        reducer.activateElement(card, false);
    }

    // endCarouselMovement();
}

/**
 * Gère le hover d'une carte
 */
export function onHover(
    e: ThreeEvent<PointerEvent>,
    card: ElementType,
    reducer: ReducerType,
    isCarouselMoving: boolean,
    isCarouselClicked: boolean
) {
    e.stopPropagation();

    // Moving Carousel ?
    if (
        isCarouselMoving ||
        isCarouselClicked ||
        reducer.activeContent?.isClicked ||
        reducer.activeContent?.isActive ||
        reducer.isMobile ||
        reducer.activeContent?.id === card.id
    ) {
        return;
    }
    // } else {
    //     setIsCarouselMoving(true);
    // }

    // Card is already active but a new hover is triggered ?
    if (reducer.activeContent && reducer.activeContent.id !== card.id) {
        // console.log("JE CLEAR L'ACTIVE CONTENT", card.id);
        // reducer.activeContent = null;
        reducer.activeContent.isActive = false;
    }
    // console.log('UN HOVER EST EN COURS', console.clear());

    if (!reducer.activeContent?.isActive) {
        // console.log(
        //     'UN HOVER EST EN COURS sur carte : ',
        //     card.id,
        //     '\n card isActive ? ',
        //     card.isActive,
        //     '\n activeContent id :',
        //     reducer.activeContent?.id,
        //     isCarouselMoving
        // );
        // console.log('Je hover la carte', card.id, card.ref?.current.position);
        reducer.activateElement(card, true);
    }
    // if (!isCarouselMoving) setIsCarouselMoving(true);
}

/**
 * Handles collision detection between cards
 */
export function handleCardCollisions(
    currentCard: ElementType,
    index: number,
    cardsArray: ElementType[],
    containerScale: number,
    frameCount: number,
    collisionsEnabled: boolean,
    updateSettings: (settings: SettingsType['set']) => void
) {
    if (!collisionsEnabled || frameCount % 50 !== 0) return;

    cardsArray.forEach((otherCard, otherIndex) => {
        if (
            otherIndex === index ||
            !otherCard.ref?.current ||
            !currentCard.ref?.current
        )
            return;

        const inRangeDistance =
            currentCard.ref.current.position.distanceTo(
                otherCard.ref.current.position
            ) - effectiveRadius(currentCard, otherCard);

        const newScale = handleNeighborCollision(
            index,
            otherIndex,
            inRangeDistance,
            otherCard.presenceRadius || 0,
            containerScale
        );

        if (newScale !== null) {
            updateSettings({ CONTAINER_SCALE: newScale });
        }
    });
}

/**
 * Updates the carousel container position and scale
 */
export function animateCarouselContainer(
    projectsRef: RefObject<Group>,
    isAnimatingIn: boolean,
    activeURL: boolean,
    activeContent: ReducerType['activeContent'],
    state: RootState,
    { animationProgress, delta }: commonParamsTypes
) {
    if (!projectsRef.current) return;

    if (projectsRef.current.visible || activeURL) {
        // Position the carousel
        easing.damp3(
            projectsRef.current.position,
            activeURL
                ? ACTIVE_PROJECTS_POSITION_SETTINGS.clone()
                : DEFAULT_PROJECTS_POSITION_SETTINGS.clone(),
            0.2,
            delta
        );

        // Breathing effect when inactive
        if (!activeContent) {
            const breathingEffect =
                Math.sin(state.clock.elapsedTime * 2) * 0.002;
            const targetScale = 1 + breathingEffect;

            easing.damp3(
                projectsRef.current.scale,
                activeURL
                    ? [targetScale, targetScale, targetScale]
                    : [40, 40, 40],
                0.3,
                delta
            );
        }
    }

    // Rotation effect
    if (activeURL) {
        handleCarouselRotation(
            projectsRef.current.rotation,
            isAnimatingIn,
            animationProgress,
            delta
        );
    } else {
        if (!projectsRef.current.visible) return;
        easing.damp3(projectsRef.current.scale, [1, 1, 1], 0.3, delta);
    }
}

/**
 * Updates the title position
 */
export function updateTitlePosition(
    titleRef: RefObject<Group | Mesh>,
    contentHeight: number,
    delta: number
) {
    if (!titleRef.current) return;
    if (titleRef.current.visible) {
        const titlePosition = DESKTOP_HTML_TITLE_POSITION_SETTINGS(
            contentHeight,
            0.6
        );
        easing.damp3(
            titleRef.current.position,
            titlePosition as [number, number, number],
            0.2,
            delta
        );
    }
}

/**
 * Handles carousel rotation during animation
 */
export function handleCarouselRotation(
    rotation: Euler,
    isAnimatingIn: boolean,
    animationProgress: number,
    delta: number
) {
    const rotationTarget = isAnimatingIn ? animationProgress * PI_AND_HALF : 0;
    easing.damp(
        rotation,
        'y',
        rotationTarget,
        isAnimatingIn ? 0.3 : 0.4,
        delta
    );
}

let positions;
let targetRotationY = 0;
/**
 * Calculates card positions for the circular arrangement
 */
export function calculateCardPositions(
    item: ElementType,
    index: number,
    activeCard: number,
    showElementsLength: number,
    containerScale: number,
    activeForwardOffset: number,
    threed: boolean
) {
    const { active, onHold } = item.cardAngles;
    const currentRotation = item.ref?.current?.rotation.y || 0;
    const flipDirection = item.id % 2 === 0 ? 1 : -1;
    let rotateTwice = active + flipDirection * TWO_PI;
    if (Math.abs(currentRotation - rotateTwice) < 0.1) {
        // If the current rotation matches the actual target rotation,
        // we need to flip it again to ensure the card is flipped correctly
        rotateTwice += TWO_PI;
    }
    // const flipDirection = (index + 1) % 2 === 0 ? 1 : -1;

    if (activeCard !== -1) {
        if (index === activeCard) {
            // Finding initial angle position
            // It should be : [sin(angle)*R, 0, cos(angle)*R]
            const targetRadius = containerScale + activeForwardOffset;
            positions = MathPos(active, targetRadius);
            targetRotationY = rotateTwice;
        } else {
            // Non-active card positioning during selection
            const relativeIndex = index < activeCard ? index : index - 1;
            const angleStep = TWO_PI / (showElementsLength - 1);
            let nonActiveCardAngle = relativeIndex * angleStep;
            // Cards on the left side of the active card
            if (index < activeCard) {
                // Use space from previews card and simply add half the active card size/angle
                nonActiveCardAngle = onHold + angleStep / 2;
            } else {
                // Cards on the right side of the active card
                // Use space from previews card and simply remove half the active card size/angle
                nonActiveCardAngle = onHold - angleStep / 2;
                // Prevents Infinity from causing issues
                if (nonActiveCardAngle === Infinity) {
                    nonActiveCardAngle = angleStep / 2;
                }
            }
            const contractedRadius = containerScale * 0.95;
            positions = MathPos(nonActiveCardAngle, contractedRadius);
            targetRotationY = nonActiveCardAngle;
        }
    } else {
        // If no active cards, we spread them all on the ring
        positions = MathPos(onHold, containerScale);
        targetRotationY = onHold;
    }

    // If 3D is disabled
    if (!threed) positions = [0, 0, 0];

    return { positions, targetRotationY };
}

/**
 * Handles the special card animation during entry
 */
export function animateCardEntry(
    card: any,
    index: number,
    totalCards: number,
    targetRotationY: number,
    { animationProgress, delta }: commonParamsTypes,
    {
        targetPos,
        startPos,
        midPoint,
        bezierPos,
        positions,
    }: {
        targetPos: Vector3;
        startPos: Vector3;
        midPoint: Vector3;
        bezierPos: Vector3;
        positions: number[];
    }
) {
    const { position, rotation } = card.ref.current;

    /**
     * Complex animation logic for the cards entering
     */
    const cardStartProgress = (index / totalCards) * (1 - 0.3);
    const cardEndProgress = cardStartProgress + 1 / totalCards + 0.1;

    let cardProgress;

    if (animationProgress < cardStartProgress) {
        cardProgress = 0;
    } else if (animationProgress > cardEndProgress) {
        cardProgress = 1;
    } else {
        // Animating between start and end progress
        cardProgress =
            (animationProgress - cardStartProgress) /
            (cardEndProgress - cardStartProgress);
        // Easing function for the animation
        cardProgress = customEasing.expOut(cardProgress);
    }

    ///////// START ANIMATION ////////////
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
        positions[0] + (index % 2 === 0 ? 10 : -10),
        // Higher Y-axis position
        positions[1] - 1,
        // Deeper Z-axis position
        positions[2] + (index % 2 === 0 ? -5 : 5)
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
            bezierPos.y += Math.sin((subProgress - 0.8) * 5 * Math.PI) * 0.3;
        }

        // Bounce effect on the Y axis when the card is close to the target position
        const waveIntensity = (1 - cardProgress) * 0.7;
        bezierPos.y +=
            Math.sin(cardProgress * Math.PI * 3) * 0.2 * waveIntensity;
        // const waveIntensity = 1 - cardProgress;
        // bezierPos.y += Math.sin(cardProgress) * 3 * waveIntensity;
    }

    // Rotation effect on incoming cards
    let currentRotationY;

    if (cardProgress < 0.3) {
        // Initial orientation
        const initialAngle = (index % 2 === 0 ? -1 : 1) * Math.PI * 0.3;
        currentRotationY =
            initialAngle * (1 - cardProgress / 0.3) +
            targetRotationY * (cardProgress / 0.3);
    } else {
        // Final orientation
        currentRotationY = targetRotationY;
    }

    // Tilt effect on incoming cards
    const tiltX =
        (1 - cardProgress) * 1 * Math.sin(cardProgress * Math.PI * 1.5);
    const tiltZ =
        Math.sin(cardProgress * Math.PI * 3) * 0.15 * (1 - cardProgress);

    // Applying the transformations to the card's position and rotation
    position.lerp(bezierPos, Math.min(1, delta * 15));
    rotation.y = currentRotationY;
    rotation.x = tiltX;
    rotation.z = tiltZ;

    return true;
}

const DEFAULT_COLLISION_CONFIG: CollisionConfig = {
    margin: 0.4,
    deltaScale: 0.1,
    minScaleDifference: 0.001,
};

/**
 * Calcul des collisions entre éléments voisins
 */
export function handleNeighborCollision(
    currentIndex: number,
    neighborIndex: number,
    inRangeDistance: number,
    presenceRadius: number,
    containerScale: number,
    config: CollisionConfig = DEFAULT_COLLISION_CONFIG
): number | null {
    if (!isNeighbor(currentIndex, neighborIndex)) {
        return null;
    }

    let targetScale = containerScale;

    if (inRangeDistance > presenceRadius + config.margin) {
        targetScale = containerScale - config.deltaScale;
    } else if (inRangeDistance <= presenceRadius - config.margin) {
        targetScale = containerScale + config.deltaScale;
    }

    const scaleDifference = Math.abs(targetScale - containerScale);
    return scaleDifference > config.minScaleDifference ? targetScale : null;
}

/**
 * Calcul des collisions entre éléments du Radius
 */
export function handleCollisions(
    currentIndex: number,
    neighborIndex: number,
    inRangeDistance: number
): void {
    if (
        inRangeDistance <= 0 &&
        neighborIndex !== currentIndex + 1 &&
        neighborIndex !== currentIndex - 1
    ) {
        console.log('There is collision between some cards');
    }
}

/**
 * Réactive le scrolling des contenu 3D
 * quand ils sont ouverts -
 */
export function onScrollHandler(e: WheelEvent) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // e.stopPropagation();
    // e.preventDefault();
    // console.log(scrollTop, scrollHeight, clientHeight, e.deltaY, e);
    if (
        (scrollTop + e.deltaY > 0 && e.deltaY < 0) ||
        (scrollHeight - (scrollTop + e.deltaY) > clientHeight && e.deltaY > 0)
    ) {
        e.stopPropagation();
    }

    // if (e.targetTouches[0]) {
    //     const card = e.currentTarget.parentNode?.querySelector('.card');
    //     if (
    //         scrollTop - 1 < 0 ||
    //         (scrollHeight - (scrollTop + e.deltaY) > clientHeight &&
    //             e.deltaY > 0)
    //     ) {
    //         console.log('Je touche le top');
    //         // e.preventDefault();
    //         // e.stopPropagation();
    //         card.style.touchAction = 'none';
    //     } else {
    //         card?.removeAttribute('style');
    //     }
    // }
    // e.stopPropagation();
    // e.preventDefault();
    // Ne bloquer le scroll que si nécessaire pour le contenu HTML

    // Si on est au début/fin du contenu et qu'on essaie de défiler plus loin
    // if (
    //     (scrollTop === 0 && e.deltaY < 0) || // Haut du contenu + scroll vers le haut
    //     (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0) // Bas du contenu + scroll vers le bas
    // ) {
    //     // Laisser l'événement se propager au canvas pour le scroll global
    //     console.log('test');
    //     // e.stopPropagation();
    //     //
    //     return;
    // }

    //     // Sinon, garder le scroll dans le contenu HTML
    //     e.stopPropagation();
    // Ne pas bloquer le scroll du canvas
    // e.stopPropagation(); <- Supprimez cette ligne

    // Pour le contenu HTML qui a son propre scroll
    // const target = e.currentTarget as HTMLElement;

    // // Permettre au canvas de scroller quand le contenu HTML est au début ou à la fin
    // const isAtTop = scrollTop === 0 && e.deltaY < 0;
    // const isAtBottom =
    //     Math.abs(scrollHeight - clientHeight - scrollTop) < 1 && e.deltaY > 0;

    // if (!isAtTop && !isAtBottom) {
    //     // Uniquement pour le scroll interne du contenu, pas pour le canvas
    //     // e.stopPropagation();
    // }
}

/**
 * Custom easing functions
 * @see https://easings.net/en#easeInOutBack
 */
export const customEasing = {
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

// const animateItem = {
//     function: easing.damp,
//     property: projectsRef.current.scale,
//     axe: 'y',
//     duration: 0.3,
//     position: {
//         active: [targetScale, targetScale, targetScale],
//         inactive: [40, 40, 40],
//     },

//     delta: delta,
// };
// export function animate(array) {
//     array = Array.isArray(array) ? array : [array];
//     array.forEach((element) => {
//         element.function(
//             element.property,
//             axe && element.axe,
//             element.position
//                 ? element.position.active
//                 : element.position.inactive,
//             element.duration,
//             element.delta
//         );
//     });
// }
// export function handleCollisions(elementPosition, item, element);

// const throttledUpdatedScale = useMemo(
//     () =>
//         throttle((newScale: number) => {
//             reducer.updateScale(card, newScale);
//         }, 100),
//     [reducer, card]
// );

// const throttledUpdatedPosition = useMemo(() => {
//     getSidesPositions(card, cardRef);
//     throttle((newScale: number) => {
//         reducer.updatePosition(card, newScale);
//     }, 100);
// }, [reducer, card]);

// const measureContent = useMemo(
//     () =>
//         debounce((element: HTMLElement | null, currentScale: number) => {
//             if (!element) return;
//             console.log('object');
//             measure(element, {
//                 scaleRatio: currentScale,
//                 setScaleRatio,
//                 done,
//                 setDone,
//             });
//         }, 100),
//     [done]
// );

/**
 * Calculate the shortest angle path between two angles
 *
 * @param fromAngle - The starting angle in radians
 * @param toAngle - The target angle in radians
 */
export function shortestAnglePath(fromAngle: number, toAngle: number): number {
    // Angle difference from one side to the other
    let diff = toAngle - fromAngle;

    // This ensures that the camera rotates in the shortest direction
    // from one half to the other
    while (diff > Math.PI) {
        diff -= TWO_PI;
    }
    while (diff < -Math.PI) {
        diff += TWO_PI;
    }

    return diff;
}
// Normaliser les angles entre -π et π
// export function normalizeAngle(angle, toAngle) {
//     let diff = toAngle - angle;

//     // This ensures that the camera rotates in the shortest direction
//     // from one half to the other
//     while (diff > Math.PI) {
//         diff -= TWO_PI;
//     }
//     while (diff < -Math.PI) {
//         diff += TWO_PI;
//     }

//     return diff + angle;
// }
export function normalizeAngle(angle, targetAngle) {
    // ✅ FLIP: Ajouter rotation de 180° pour effet flip
    // const flipAmount = TWO_PI; // 180 degrés

    // // Choisir direction de flip basée sur position
    // const shouldFlipForward = Math.sin(targetAngle) > 0;
    // const flipDirection = shouldFlipForward ? flipAmount : -flipAmount;

    // return targetAngle + flipDirection;
    return ((angle + Math.PI) % TWO_PI) - Math.PI;
}
