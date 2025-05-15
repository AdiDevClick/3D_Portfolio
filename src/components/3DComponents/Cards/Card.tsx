import { Image, ImageProps, useCursor } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { memo, PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { DoubleSide, Mesh } from 'three';
import {
    handleActiveCardEffects,
    handleClickedCardEffects,
    handleNormalAnimation,
} from '@/components/3DComponents/Carousel/Functions';
import {
    CARD_HOVER_SCALE,
    DESKTOP_TITLE_POSITION,
    MOBILE_TITLE_POSITION,
} from '@/configs/3DCarousel.config';
import { easing } from 'maath';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes';
import { getSidesPositions } from '@/functions/3Dmodels';
import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes';

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
const MemoizedCard = memo(
    function Card({
        reducer,
        card,
        children,
        SETTINGS,
        ...props
    }: PropsWithChildren<CardProps>) {
        const cardRef = useRef<Mesh & ImageProps>(null!);
        const { updateBending, updateWidth, isMobile, visible } = reducer;

        // mobile Optimisations
        const segments = reducer.isMobile ? 8 : 12;

        const cardHoverScale = card.isActive ? CARD_HOVER_SCALE : 1;
        const cardHoverRadius = card.isActive ? 0.1 : 0.05;
        const cardHoverZoom = card.isActive ? 1 : 1.5;

        useCursor(card.isActive || false);

        useFrame((_, delta) => {
            if (
                !cardRef.current ||
                (!visible?.includes('carousel') &&
                    !visible?.includes('card')) ||
                !cardRef.current.visible
            )
                return;
            const title = cardRef.current.getObjectByName('card__title');
            if (!title) return;
            const { material, scale, rotation } = cardRef.current;

            const props = {
                delta,
                scale,
                updateBending,
                updateWidth,
                card,
            };
            if (!card.isClicked) {
                easing.damp3(
                    title.position,
                    isMobile ? MOBILE_TITLE_POSITION : DESKTOP_TITLE_POSITION,
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
                    handleActiveCardEffects(
                        card.baseScale,
                        props,
                        cardHoverScale
                    );
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
                    _loaded: true,
                });
            }

            return () => {
                // Cleanup textures and geometries
                if (cardRef.current) {
                    if (Array.isArray(cardRef.current.material)) {
                        cardRef.current.material.forEach((mat) =>
                            mat.dispose()
                        );
                    } else {
                        cardRef.current.material.dispose();
                    }
                    cardRef.current.geometry.dispose();
                }
            };
        }, []);

        return (
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
                {...props}
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
    // (prevProps, nextProps) => {
    //     return (
    //         prevProps.card.id === nextProps.card.id &&
    //         prevProps.card.isActive === nextProps.card.isActive &&
    //         prevProps.card.isClicked === nextProps.card.isClicked &&
    //         prevProps.card.currentWidth === nextProps.card.currentWidth
    //     );
    // }
);
export default MemoizedCard;
