import { Image, ImageProps, useCursor } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import {
    memo,
    PropsWithChildren,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import { DoubleSide, Mesh } from 'three';

import {
    CARD_CLICKED_SCALE,
    CARD_HOVER_SCALE,
    DESKTOP_TITLE_POSITION,
    MOBILE_TITLE_POSITION,
} from '@/configs/3DCarousel.config';
import { easing } from 'maath';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes';
import { getSidesPositions } from '@/functions/3Dmodels';
import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes';
import { useSpring, animated } from '@react-spring/three';

export type CardProps = {
    card: ElementType;
    presenceRadius: number;
    reducer: ReducerType;
    SETTINGS: SettingsType;
    children?: ReactNode;
    onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
    onClick?: (e: ThreeEvent<PointerEvent>) => void;
};

/**
 * Composant Conteneur de cartes
 */
const MemoizedCard = memo(function Card({
    reducer,
    card,
    children,
    SETTINGS,
    ...props
}: PropsWithChildren<CardProps>) {
    const cardRef = useRef<Mesh & ImageProps>(null!);
    const sphereRef = useRef<Mesh>(null!);

    const { updateBending, updateWidth, isMobile, visible } = reducer;

    // const [width, setWidth] = useState(1);
    const [ratio, setRatio] = useState(1);

    // mobile Optimisations
    const segments = reducer.isMobile ? 8 : 12;

    const { cardScale } = useSpring({
        cardScale: card.isClicked
            ? 1
            : card.isActive
            ? card.baseScale
            : // ? (card.baseScale * width) / 2
              1.0,
        // Configuration de l'animation - très importante pour la fluidité
        config: {
            mass: 1.5,
            tension: 140,
            friction: 22,
            precision: 0.001,
            duration: 200,
        },
        delay: 200,
    });

    const cardHoverScale = card.isActive ? CARD_HOVER_SCALE : 1;
    const cardHoverRadius = card.isActive ? 0.02 : 0.05;
    const cardHoverZoom = card.isActive ? 1 : 1.1;

    useCursor(card.isActive || false);

    useFrame((_, delta) => {
        if (
            !cardRef.current ||
            (!visible?.includes('carousel') && !visible?.includes('card')) ||
            !cardRef.current.visible
        )
            return;
        const title = cardRef.current.getObjectByName('card__title');
        if (!title) return;
        const { material, scale, rotation } = cardRef.current;

        const targetScale: [number, number, number] = card.isClicked
            ? // ? [1.5, 1.5, 1.5]
              [CARD_CLICKED_SCALE * 2.5, CARD_CLICKED_SCALE * 2.5, 2]
            : card.isActive
            ? [cardHoverScale * 1.1, cardHoverScale, 1]
            : [cardHoverScale, cardHoverScale, 1];

        const scaleDampingFactor = card.isClicked
            ? 0.2
            : card.isActive
            ? 0.1
            : 0.3;

        easing.damp3(scale, targetScale, scaleDampingFactor, delta);

        easing.damp3(
            title.position,
            !card.isClicked
                ? isMobile
                    ? MOBILE_TITLE_POSITION
                    : DESKTOP_TITLE_POSITION
                : [0, -SETTINGS.y_HEIGHT / 4, 0.1],
            0,
            delta
        );
        easing.damp3(title.scale, !card.isClicked ? 1 : 0.5, 0.1, delta);

        easing.damp(
            material,
            'zoom',
            card.isClicked ? 1 : cardHoverZoom,
            0.3,
            delta
        );
        easing.damp(material, 'radius', cardHoverRadius, 0.2, delta);
        easing.damp(rotation, 'x', 0, 0.15, delta);
    });

    /**
     * Enregistre la ref ainsi que le radius
     * de la collision sphere de la carte
     * dans le reducerDatas
     */
    useEffect(() => {
        if (cardRef.current) {
            const positions = getSidesPositions(card, cardRef);

            const sphere = cardRef.current.getObjectByName(
                'card__spherePresenceHelper'
            );

            reducer.updateElements({
                ...card,
                ref: cardRef,
                presenceRadius: SETTINGS.PRESENCE_RADIUS,
                presenceSphere: sphere as Mesh,
                spacePositions: positions || undefined,
                bending: SETTINGS.BENDING,
                _loaded: true,
            });
        }

        return () => {
            // Cleanup textures and geometries
            if (cardRef.current) {
                if (Array.isArray(cardRef.current.material)) {
                    cardRef.current.material.forEach((mat) => mat.dispose());
                } else {
                    cardRef.current.material.dispose();
                }
                cardRef.current.geometry.dispose();
            }
        };
    }, []);

    /**
     * Calculate the ratio of the card
     * based on the clicked state for smoother animations
     */
    useEffect(() => {
        if (!cardRef.current) return;
        let width = card.baseScale;
        let bending = SETTINGS.BENDING;
        let ratio = 1;
        if (card.isClicked) {
            width = card.baseScale + 0.8;
            // ratio = card.baseScale / width;
            ratio = (card.baseScale * width) / 4;
            bending = 0.01;
        } else if (card.isActive) {
            width = card.baseScale + 0.5;
            // ratio = width;
            ratio = (card.baseScale * width) / 2;
            bending = 0.01;
        } else {
            width = card.baseScale;
            ratio = card.baseScale * width;
            // ratio = card.baseScale * 0.7;
            bending = SETTINGS.BENDING;
        }

        // setWidth(width);
        setRatio(ratio);
        updateWidth(card, width);
        updateBending(card, bending);
    }, [card.isActive, card.isClicked]);

    return (
        <animated.group scale={cardScale}>
            <Image
                position={card.position}
                ref={cardRef}
                url={import.meta.env.BASE_URL + card.url}
                // texture={card.texture}
                transparent
                side={DoubleSide}
                rotation={[
                    card.rotation[0] ?? 0,
                    card.rotation[1] ?? 0,
                    card.rotation[2] ?? 0,
                ]}
                // scale={card.currentWidth}
                // scale={width}
                // scale={ratio}
                scale={card.isClicked ? ratio : card.baseScale}
                {...props}
            >
                {children}
                <bentPlaneGeometry
                    args={[
                        card.bending,
                        card.baseScale,
                        card.isClicked
                            ? SETTINGS.y_HEIGHT / 2
                            : SETTINGS.y_HEIGHT,
                        segments,
                    ]}
                />
            </Image>
        </animated.group>
    );
});
export default MemoizedCard;
