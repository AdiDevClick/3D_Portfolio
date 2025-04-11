import { Image } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
    PropsWithChildren,
    ReactNode,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import { DoubleSide, Mesh, Vector3 } from 'three';
import {
    ElementType,
    ReducerType,
} from '../../../hooks/reducers/carouselTypes.js';
import { getSidesPositions } from '../../../functions/3Dmodels.js';
import { useNavigate } from 'react-router';
import {
    handleActiveCardEffects,
    handleClickedCardEffects,
    handleNormalAnimation,
    onClickHandler,
    onHover,
    onPointerOut,
} from '@/components/3DComponents/Carousel/Functions.js';
import { CARD_HOVER_SCALE } from '@/configs/3DCarousel.config.js';

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

    // Optimisation mobile
    const segments = reducer.isMobile ? 10 : 20;
    const textureQuality = reducer.isMobile ? 512 : 1024;

    const id = useId();

    // Local bendin state
    const [bending, setBending] = useState(SETTINGS.BENDING);
    // For ZoomBouncing effect
    const [width, setWidth] = useState(card.baseScale);

    // Références pour l'animation (pour éviter de re-render)
    // Facteur d'animation (t de 0 à 1)
    const animationProgressRef = useRef(0);
    const startPositionRef = useRef<Vector3>(null!);

    const cardHoverScale = card.isActive ? CARD_HOVER_SCALE : 1;
    const cardHoverRadius = card.isActive ? 0.25 : 0.1;
    const cardHoverZoom = card.isActive ? 1 : 1.5;

    const navigate = useNavigate();

    useFrame((state, delta) => {
        if (!cardRef.current) return;
        const { material, scale, rotation } = cardRef.current;
        const props = { bending, setBending, setWidth, delta, scale, width };

        if (!card.isClicked) {
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
            // Supposons que la hauteur de la carte se trouve dans la géométrie (par exemple, boxGeometry)
            // const geomParams = cardRef.current.geometry.parameters;
            // if (geomParams && geomParams.height) {
            //     // On déplace le mesh vers le bas de façon que le haut du mesh
            //     // soit aligné avec l'origin du groupe
            //     cardRef.current.position.y = -geomParams.height / 2;
            // }
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
            onPointerOut={(e) => onPointerOut(e, card, reducer)}
            onClick={(e) => onClickHandler(e, card, reducer)}
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
                // scale={(card.currentWidth - 0.1, card.currentWidth)}
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
