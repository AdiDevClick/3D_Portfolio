/**
 * CAROUSEL FUNCTIONS
 */

import {
    CardProps,
    CollisionConfig,
} from '@/components/3DComponents/Carousel/FunctionsTypes.ts';
import { DEFAULT_CARD_POSITION, TWO_PI } from '@/configs/3DCarousel.config.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { isNeighbor } from '@/functions/collisions.ts';
import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { ThreeEvent } from '@react-three/fiber';
import { easing } from 'maath';
import { Euler, Vector3 } from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';

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
    id: string
) {
    const defaultUrl = `src/assets/images/img${Math.floor(i % 10) + 1}.png`;
    const defaultContent = [
        'Intégration du Canvas avec ThreeJS',
        'Créé avec React et TypeScript',
        "Une implémentation responsive de l'expérience 3D",
    ];

    const angle = (i / SETTINGS.CARDS_COUNT) * TWO_PI;
    const position = SETTINGS.THREED ? DEFAULT_CARD_POSITION : new Vector3();
    const rotation = [0, angle, 0];

    const cardAngles = {
        active: Math.atan2(
            Math.sin(angle) * SETTINGS.CONTAINER_SCALE,
            Math.cos(angle) * SETTINGS.CONTAINER_SCALE
        ),
        onHold: (i / self.length) * TWO_PI,
    };

    return {
        url: datas[i]?.cover || defaultUrl,
        description: datas[i]?.description || 'description',
        title: datas[i]?.title || 'title',
        cardTitle: datas[i]?.cardTitle || 'cardTitle',
        content: datas[i]?.content || defaultContent,
        stack: datas[i]?.stack || {},
        position,
        velocity: new Vector3(0, 0, 0),
        rotation,
        wander: randFloat(0, TWO_PI),
        animation: SETTINGS.CARD_ANIMATION,
        baseScale: SETTINGS.CARD_SCALE,
        active: SETTINGS.ACTIVE_CARD,
        id: datas[i]?.id || `${id}${i}`,
        containerScale: SETTINGS.CONTAINER_SCALE,
        cardAngles,
    };
}

/**
 * Gère le clic sur une carte
 */
export function onClickHandler(
    e: ThreeEvent<MouseEvent>,
    card: ElementType,
    reducer: ReducerType
): void {
    e.stopPropagation();
    // Deny any other clicked elements if one is opened
    if (reducer.activeContent?.id === card.id) reducer.clickElement(card);
    if (!reducer.activeContent) reducer.clickElement(card);
    // reducer.animate(card, 'dropoff');
    // navigate('/error/page');
    // return <Navigate to={'/error/page'} replace={true} />;
}

/**
 * Gère la sortie du pointeur d'une carte
 */
export function onPointerOut(
    e: ThreeEvent<PointerEvent>,
    card: ElementType,
    reducer: ReducerType
): void {
    e.stopPropagation();
    if (reducer.activeContent?.isClicked) return;
    reducer.activateElement(card, false);
}

/**
 * Gère le hover d'une carte
 */
export function onHover(
    e: ThreeEvent<PointerEvent>,
    card: ElementType,
    reducer: ReducerType
): void {
    e.stopPropagation();
    if (reducer.activeContent?.isClicked) return;
    reducer.activateElement(card, true);
}

/**
 * Gère les animations d'une carte par défaut
 */
export function handleNormalAnimation(
    material: any,
    rotation: Euler,
    cardHoverScale: number,
    cardHoverRadius: number,
    cardHoverZoom: number,
    isActive: boolean,
    baseScale: number,
    maxBending: number,
    { ...props }: CardProps
) {
    // // Scale the card size up
    easing.damp3(props.scale, cardHoverScale, 0.15, props.delta);
    // Modify card radius to be rounder
    easing.damp(material, 'radius', cardHoverRadius, 0.2, props.delta);
    // Scale the zoom inside the plane mesh
    easing.damp(material, 'zoom', cardHoverZoom, 0.2, props.delta);
    // Rotation reset
    easing.damp(rotation, 'x', 0, 0.15, props.delta);

    if (!isActive && props.width > baseScale) {
        props.setWidth((prev) => prev - props.delta);
    }

    if (!isActive && props.bending < maxBending) {
        props.setBending((prev) => prev + props.delta);
    }
}

/**
 * Gère les effets d'une carte cliquée
 */
export function handleClickedCardEffects(
    baseScale: number,
    { ...props }: CardProps
) {
    // Scale up animation
    const targetScale = new Vector3(1.5, 1.5, 1.5);
    easing.damp3(props.scale, targetScale, 0.15, props.delta);
    props.scale.lerp(targetScale, 0.1);

    // Bending effect disabled
    if (props.bending > 0) props.setBending((prev) => prev - props.delta);
    // Zoom Bounce effect
    if (props.width < baseScale + 0.4) {
        props.setWidth((prev) => prev + props.delta);
    }
}

/**
 * Gère les effets d'une carte active
 */
export function handleActiveCardEffects(
    baseScale: number,
    { ...props }: CardProps
): void {
    // Remove bending effect
    if (props.bending > 0) {
        props.setBending((prev) => prev - props.delta);
    }

    // Increase width with bounce effect
    if (props.width < baseScale + 0.2) {
        props.setWidth((prev) => prev + props.delta);
        // Boucing effect
        // easing.damp3(props.scale, 0.5, 0.15, props.delta);
    }
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
