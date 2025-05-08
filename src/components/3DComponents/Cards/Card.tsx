import { Image, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { DoubleSide, Mesh } from 'three';
import {
    ElementType,
    ReducerType,
} from '../../../hooks/reducers/carouselTypes.js';
import { getSidesPositions } from '../../../functions/3Dmodels.js';
import { useLocation, useNavigate } from 'react-router';
import {
    handleActiveCardEffects,
    handleClickedCardEffects,
    handleNormalAnimation,
    onClickHandler,
    onHover,
    onPointerOut,
} from '@/components/3DComponents/Carousel/Functions.js';
import {
    CARD_HOVER_SCALE,
    DESKTOP_TITLE_POSITION,
    MOBILE_TITLE_POSITION,
} from '@/configs/3DCarousel.config.js';
import { easing } from 'maath';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.js';

type CardProps = {
    reducer: ReducerType;
    card: ElementType;
    SETTINGS: SettingsType;
    presenceRadius?: number;
    children?: React.ReactNode;
};

/**
 * Composant Conteneur de cartes
 */
export default function Card({
    reducer,
    card,
    children,
    SETTINGS,
}: PropsWithChildren<CardProps>) {
    const cardRef = useRef<Mesh>(null!);
    const navigate = useNavigate();
    const location = useLocation();

    // mobile Optimisations
    const segments = reducer.isMobile ? 8 : 12;

    const cardHoverScale = card.isActive ? CARD_HOVER_SCALE : 1;
    const cardHoverRadius = card.isActive ? 0.1 : 0.05;
    const cardHoverZoom = card.isActive ? 1 : 1.5;

    useCursor(card.isActive || false);

    useFrame((_, delta) => {
        if (
            !cardRef.current ||
            (!reducer.visible?.includes('carousel') &&
                !reducer.visible?.includes('card'))
        )
            return;
        const title = cardRef.current.getObjectByName('card__title');
        if (!title) return;
        const { material, scale, rotation } = cardRef.current;
        if (!cardRef.current) return;

        const props = {
            delta,
            scale,
            reducer,
            card,
        };

        if (!card.isClicked) {
            easing.damp3(
                title.position,
                reducer.isMobile
                    ? MOBILE_TITLE_POSITION
                    : DESKTOP_TITLE_POSITION,
                0.1,
                delta
            );
            handleNormalAnimation(
                material,
                rotation,
                cardHoverScale,
                cardHoverRadius,
                cardHoverZoom,
                SETTINGS.BENDING,
                props
            );

            if (card.isActive) {
                handleActiveCardEffects(card.baseScale, props, cardHoverScale);
            }
        } else {
            handleClickedCardEffects(card.baseScale, props, cardHoverScale);
            easing.damp3(
                title.position,
                [0, -SETTINGS.y_HEIGHT / 2, 0.1],
                0.1,
                delta
            );
        }
    });

    /**
     * Enregistre la ref ainsi que le radius
     * de la collision sphere de la carte
     * dans le reducerDatas
     */
    useEffect(() => {
        if (cardRef.current) {
            const positions = getSidesPositions(card, cardRef);
            reducer.updateElements({
                ...card,
                ref: cardRef,
                presenceRadius: SETTINGS.PRESENCE_RADIUS,
                spacePositions: positions || undefined,
            });

            // Update the card's loaded state
            reducer.updateLoadCount(1);
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

    // console.log('Je load la carte');
    return (
        <Image
            ref={cardRef}
            onPointerOver={(e) => onHover(e, card, reducer)}
            onPointerOut={(e) => onPointerOut(e, card, reducer, navigate)}
            onClick={(e) =>
                onClickHandler(e, card, reducer, location, navigate)
            }
            position={card.position}
            url={card.url}
            // texture={card.texture}
            transparent
            side={DoubleSide}
            rotation={[card.rotation[0], card.rotation[1], card.rotation[2]]}
            // scale={
            //     card.isActive
            //         ? [card.currentWidth - 0.1, card.currentWidth]
            //         : card.baseScale
            // }
            // args={[textureQuality, textureQuality]}
        >
            {children}
            <bentPlaneGeometry
                args={[
                    card.isActive ? card.bending : SETTINGS.BENDING,
                    card.isActive ? card.currentWidth : card.baseScale,
                    SETTINGS.y_HEIGHT,
                    segments,
                ]}
            />
        </Image>
    );
}
