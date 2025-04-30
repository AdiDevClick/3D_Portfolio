import { Image, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
    PropsWithChildren,
    ReactNode,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
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

interface AdditionalProps {
    visibleWireframe?: boolean;
    presenceRadius?: number;
    BENDING: number;
    y_HEIGHT: number;
    children: ReactNode;
}

type CardProps = {
    reducer: ReducerType;
    card: ElementType;
} & AdditionalProps;

/**
 * Composant Conteneur de cartes
 */
export default function Card({
    reducer,
    card,
    children,
    ...SETTINGS
}: PropsWithChildren<CardProps>) {
    const cardRef = useRef<Mesh>(null!);
    const navigate = useNavigate();
    const location = useLocation();

    // Local bendin state
    const [bending, setBending] = useState(SETTINGS.BENDING);
    // For ZoomBouncing effect
    const [width, setWidth] = useState(card.baseScale);

    // mobile Optimisations
    const segments = reducer.isMobile ? 10 : 20;
    const textureQuality = reducer.isMobile ? 512 : 1024;

    const id = useId();

    const cardHoverScale = card.isActive ? CARD_HOVER_SCALE : 1;
    const cardHoverRadius = card.isActive ? 0.1 : 0.05;
    const cardHoverZoom = card.isActive ? 1 : 1.5;

    useCursor(card.isActive);

    useFrame((_, delta) => {
        const title = cardRef.current.getObjectByName('title');
        if (!cardRef.current || !title) return;

        const { material, scale, rotation } = cardRef.current;
        const props = { bending, setBending, setWidth, delta, scale, width };

        if (!card.isClicked) {
            easing.damp3(
                title.position,
                reducer.isMobile
                    ? MOBILE_TITLE_POSITION
                    : DESKTOP_TITLE_POSITION,
                0.2,
                delta
            );

            handleNormalAnimation(
                material,
                rotation,
                cardHoverScale,
                cardHoverRadius,
                cardHoverZoom,
                card.isActive,
                card.baseScale,
                SETTINGS.BENDING,
                props
            );

            if (card.isActive) {
                handleActiveCardEffects(card.baseScale, props);
            }
        } else {
            handleClickedCardEffects(card.baseScale, props);
            easing.damp3(
                title.position,
                [0, -SETTINGS.y_HEIGHT / 2, 0.1],
                0.2,
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
            // Force calculated default position
            cardRef.current.position.set(
                card.position.x,
                card.position.y,
                card.position.z
            );

            reducer.updateElements({
                ...card,
                ref: cardRef,
                presenceRadius: SETTINGS.presenceRadius,
                spacePositions: getSidesPositions(card, cardRef),
            });
        }
        return () => {
            // Cleanup textures and geometries
            cardRef.current?.material.dispose();
            cardRef.current?.geometry.dispose();
        };
    }, []);

    useEffect(() => {
        if (cardRef.current) {
            reducer.updateWidth(card, width);
        }
    }, [width]);

    return (
        <group
            key={id}
            onPointerOver={(e) => onHover(e, card, reducer)}
            onPointerOut={(e) => onPointerOut(e, card, reducer, navigate)}
            onClick={(e) =>
                onClickHandler(e, card, reducer, location, navigate)
            }
        >
            <Image
                ref={cardRef}
                url={card.url}
                transparent
                side={DoubleSide}
                rotation={card.rotation}
                scale={
                    card.isActive
                        ? [card.currentWidth - 0.1, card.currentWidth]
                        : card.baseScale
                }
                // generateMipmaps={!reducer.isMobile}
                // args={[textureQuality, textureQuality]}
            >
                {children}

                <bentPlaneGeometry
                    args={[
                        card.isActive ? bending : SETTINGS.BENDING,
                        card.isActive ? card.currentWidth : card.baseScale,
                        SETTINGS.y_HEIGHT,
                        segments,
                    ]}
                />
            </Image>
        </group>
    );
}

function Rig(props) {
    const ref = useRef(null);
    const scroll = useScroll();
    useFrame((state, delta) => {
        // console.log(scroll);
        // ref.current.lookAt(1, 0.5, 0); // Look at center
        // ref.current.position.y = 1; // Rotate contents
        // ref.current.rotation.y = -scroll.offset * 2; // Rotate contents
        // ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
        // state.events.update(); // Raycasts every frame rather than on pointer-move
        // Move camera
        // easing.damp3(
        //     state.camera.position,
        //     [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
        //     0.3,
        //     delta
        // );
        // state.camera.lookAt(0, 0, 0); // Look at center
    });
    return <group ref={ref} {...props} />;
}
