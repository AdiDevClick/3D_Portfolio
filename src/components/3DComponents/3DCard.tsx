import { Image, RoundedBox, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useMemo, useRef } from 'react';
import { DoubleSide, Mesh, SkinnedMesh } from 'three';
import { throttle } from '../../functions/promises.js';
import {
    ElementType,
    ReducerType,
} from '../../hooks/reducers/carouselTypes.js';
import { deltaTime } from 'three/src/nodes/TSL.js';

interface AdditionalProps {
    visibleWireframe?: boolean;
    presenceRadius?: number;
    presenceCircle?: boolean;
}

type CardProps = {
    reducer: ReducerType;
    card: ElementType;
} & AdditionalProps;

export default function Card({ reducer, card, ...props }: CardProps) {
    const { id, ...rest } = card;
    const cardRef = useRef<Mesh>(null);
    const cardHoverScale = card.isActive ? 1.15 : 1;
    const cardHoverRadius = card.isActive ? 0.25 : 0.1;
    const cardHoverZoom = card.isActive ? 1 : 1.5;

    if (card.presenceRadius && card.presenceRadius !== 0.5)
        console.log('different radius : ', card.presenceRadius);

    const onClickHandler = (e) => {
        e.stopPropagation();
        // reducer.animate(card, 'dropoff');
    };
    const onHover = (e) => {
        e.stopPropagation();
        reducer.activateElement(card);
    };

    const onPointerOut = (e) => {
        e.stopPropagation();
        if (card.isActive) {
            reducer.activateElement(card);
            console.log(card.presenceRadius);
        }
    };

    const throttledUpdate = useMemo(
        () =>
            throttle((newScale: number) => {
                reducer.updateScale(card, newScale);
            }, 100),
        [reducer, card]
    );

    useFrame((state, delta) => {
        if (!cardRef.current) return;

        // Scale the card size up
        easing.damp3(cardRef.current.scale, cardHoverScale, 0.15, delta);

        // Modify card radius to be rounder
        easing.damp(
            cardRef.current.material,
            'radius',
            cardHoverRadius,
            0.2,
            delta
        );

        // Scale the zoom inside the plane mesh
        easing.damp(
            cardRef.current.material,
            'zoom',
            cardHoverZoom,
            0.2,
            delta
        );

        if (card.animation === 'dropoff') {
            card.position.x =
                Math.sin(card.position.x * 0.1 + 0.25) -
                Math.sqrt(5 ^ (2 - card.position.x) ^ 3);
        }
        const newScale = cardRef.current.scale.x;

        card.isActive
            ? easing.damp3(cardRef.current.position, [cardRef.current.position.x, cardRef.current.position.y, cardRef.current.position.z - 1], 0.15, delta)
            : // ? easing.damp3(cardRef.current.position, [0.5, 0, -2], 0.15, delta)
              easing.damp3(
                  cardRef.current.position,
                  card.position,
                  0.15,
                  delta
              );

        // Save new scale property for the card
        if (newScale !== card.currentScale) {
            throttledUpdate(newScale);
        }
    });

    /**
     * Enregistre la ref de la carte dans le reducerDatas
     */
    useEffect(() => {
        if (cardRef.current) {
            reducer.updateElements({
                ...card,
                ref: cardRef,
                presenceRadius: props.presenceRadius,
            });
        }
    }, []);

    return (
        <Image
            ref={cardRef}
            url={card.url}
            transparent
            side={DoubleSide}
            onPointerOver={onHover}
            onPointerOut={onPointerOut}
            onClick={onClickHandler}
            {...rest}
        >
            {props.visibleWireframe && (
                <meshBasicMaterial
                    visible={props.visibleWireframe}
                    wireframe
                    side={DoubleSide}
                />
            )}
            <bentPlaneGeometry args={[0.2, card.baseScale, 2, 20]} />
            <mesh visible={props.presenceCircle}>
                <sphereGeometry args={[props.presenceRadius, 32]} />
                <meshBasicMaterial color={'red'} wireframe />
            </mesh>
        </Image>
    );
}
