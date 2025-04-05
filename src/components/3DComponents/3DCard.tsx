import { Image, Scroll, ScrollControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useRef, useState } from 'react';
import { DoubleSide, Group, Mesh, Vector3 } from 'three';
import { throttle } from '../../functions/promises.js';
import {
    ElementType,
    ReducerType,
} from '../../hooks/reducers/carouselTypes.js';
import { getSidesPositions } from '../../functions/3Dmodels.js';
import { useNavigate } from 'react-router';
import '@css/Card.scss';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.js';
import { ProjectContainer } from '@/components/projects/ProjectContainer.js';
import { Helper } from '@/components/3DComponents/Helper.js';

interface AdditionalProps {
    visibleWireframe?: boolean;
    presenceRadius?: number;
    presenceCircle?: boolean;
    BENDING: number;
    y_HEIGHT: number;
}

type CardProps = {
    reducer: ReducerType;
    card: ElementType;
} & AdditionalProps;

/**
 * Composant Carte
 */
export default function Card({ reducer, card, ...props }: CardProps) {
    const groupRef = useRef<Group>(null!);
    const cardRef = useRef<Mesh>(null!);
    const htmlRef = useRef<HTMLElement>(null!);
    const htmlGroupRef = useRef<HTMLElement>(null!);
    const spherePresenceRef = useRef<Mesh>(null!);

    // État local pour savoir si la carte est cliquée
    // const [isClicked, setIsClicked] = useState(false);
    const [bending, setBending] = useState(props.BENDING);
    // For ZoomBouncing effect
    const [width, setWidth] = useState(card.baseScale);

    const [htmlWidth, setHtmlWidth] = useState(0);

    // Références pour l'animation (pour éviter de re-render)
    // Facteur d'animation (t de 0 à 1)
    const animationProgressRef = useRef(0);
    const startPositionRef = useRef<Vector3>(null!);

    const cardHoverScale = card.isActive ? 1.15 : 1;
    const cardHoverRadius = card.isActive ? 0.25 : 0.1;
    const cardHoverZoom = card.isActive ? 1 : 1.5;

    const navigate = useNavigate();

    const onClickHandler = (e) => {
        e.stopPropagation();
        // Deny any other clicked elements if one is opened
        if (reducer.activeContent?.id === card.id) reducer.clickElement(card);
        if (!reducer.activeContent) reducer.clickElement(card);
        if (cardRef.current) {
            startPositionRef.current = cardRef.current.position.clone();
            // Réinitialisez la progression d'animation
            animationProgressRef.current = 0;
        }
        // reducer.animate(card, 'dropoff');
        // navigate('/error/page');
        // return <Navigate to={'/error/page'} replace={true} />;
    };
    const onHover = (e) => {
        e.stopPropagation();
        if (reducer.activeContent?.isClicked) return;
        reducer.activateElement(card, true);
    };

    const onPointerOut = (e) => {
        e.stopPropagation();
        if (reducer.activeContent?.isClicked) return;
        reducer.activateElement(card, false);
    };

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

    useFrame((state, delta) => {
        if (!cardRef.current) return;
        const { material, scale } = cardRef.current;

        if (!card.isClicked) {
            // Scale the card size up
            easing.damp3(scale, cardHoverScale, 0.15, delta);
            // Modify card radius to be rounder
            easing.damp(material, 'radius', cardHoverRadius, 0.2, delta);
            // Scale the zoom inside the plane mesh
            easing.damp(material, 'zoom', cardHoverZoom, 0.2, delta);
            // Et forcer la rotation X à revenir à 0 (ou autre valeur par défaut) en mode hover
            easing.damp(cardRef.current.rotation, 'x', 0, 0.15, delta);

            const newScale = scale.x;

            // Bending effect on Hover / non hover
            if (card.isActive) {
                if (bending > 0) setBending((prev) => prev - delta);
                // Zoom Bounce effect
                if (width < card.baseScale + 0.2)
                    setWidth((prev) => prev + delta);
            } else {
                setBending((prev) => Math.min(prev + delta, props.BENDING));
                // unzoom effect
                if (width > card.baseScale) {
                    setWidth((prev) => prev - delta);
                } else {
                    setWidth((prev) => Math.min(prev + delta, card.baseScale));
                }
            }

            // if (newScale !== card.currentScale) {
            //     throttledUpdatedScale(newScale);
            // }
        } else {
            // easing.damp3(
            //     cardRef.current.scale,
            //     new Vector3(1.5, 1.5, 1.5),
            //     0.15,
            //     delta
            // );
            // cardRef.current.scale.lerp(new Vector3(1.5, 1.5, 1.5), 0.1);
            if (bending > 0) setBending((prev) => prev - delta);
            // Shows the whole picture instead of thumbnail
            if (width < card.baseScale + 0.4) setWidth((prev) => prev + delta);
            // if (card.animation === 'dropoff') {
            //     easing.damp3(
            //         position,
            //         Math.sin(card.position.x * 0.1 + 0.25) -
            //             Math.sqrt(5 ^ (2 - card.position.x) ^ 3),
            //         0.15,
            //         delta
            //     );
            // }
        }
    });

    /**
     * Enregistre la ref de la carte dans le reducerDatas
     */
    useEffect(() => {
        if (cardRef.current) {
            // Helper(cardRef, true, false);
            // Force calculated default position
            cardRef.current.position.set(
                card.position.x,
                card.position.y,
                card.position.z
            );

            // Save presence Radius in sphere
            // spherePresenceRef.current.presenceRadius = 0.5 * card.baseScale;

            reducer.updateElements({
                ...card,
                ref: cardRef,
                presenceRadius: props.presenceRadius,
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
    }, []);

    // useLayoutEffect(() => {
    //     if (htmlRef.current) {
    //         setHtmlWidth(htmlRef.current.getBoundingClientRect().width);
    //         console.log(htmlRef.current.getBoundingClientRect().width);
    //     }
    // }, [htmlRef, htmlWidth, card]);

    return (
        <group
            ref={groupRef}
            onPointerOver={onHover}
            onPointerOut={onPointerOut}
            onClick={onClickHandler}
        >
            {/* <axesHelper args={[5]} /> */}
            {/* <axesHelper args={[5]} position={[0, 0, 0]} /> */}
            <Image
                ref={cardRef}
                url={card.url}
                transparent
                side={DoubleSide}
                rotation={card.rotation}
                // position={card.position}
                scale={[width - 0.1, width]}
                // sidePositions={card.sidePositions}
            >
                {props.visibleWireframe && (
                    <meshBasicMaterial
                        visible={props.visibleWireframe}
                        wireframe
                        side={DoubleSide}
                    />
                )}

                {/* <mesh> */}
                <bentPlaneGeometry
                    args={[bending, width, props.y_HEIGHT, 20]}
                />
                {/* </mesh> */}

                <mesh ref={spherePresenceRef} visible={props.presenceCircle}>
                    <sphereGeometry args={[props.presenceRadius, 32]} />
                    <meshBasicMaterial color={'red'} wireframe />
                </mesh>
                {
                    card.isClicked && (
                        // <ScrollControls>
                        // <Scroll>
                        <HtmlContainer width={width} reducer={reducer}>
                            <ProjectContainer
                                onClick={onClickHandler}
                                card={card}
                                // style={{ top: '100px' }}
                            />
                        </HtmlContainer>
                        // </Scroll>
                        // </ScrollControls>

                        // <Rig>
                    )
                    //</Rig>
                    //
                }
                {/* {card.isClicked && <axesHelper args={[2]} />} */}
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

<group>
    {/* <Text
    key={'key-text' + card.id}
    maxWidth={0.1}
    anchorY={0}
    fontSize={0.1}
    // rotation={[0, card.cardAngles?.active, 0]}
    rotation={[0, 3.15, 0]}
    anchorX={0}
    color={'red'}
    position={[-0.5, 1, -0.05]}
    visible={card.isActive}
>
    test
</Text> */}

    {/* // <Text
//     maxWidth={0.1}
//     position={[0, 0, -0.1]}
//     // position={[
//     //     cardRef.current?.position.x,
//     //     cardRef.current?.position.y,
//     //     cardRef.current?.position.z,
//     // ]}
//     anchorY={'top'}
//     anchorX={'center'}
//     fontSize={0.1}
//     rotation={[0, 3.15, 0]}
//     color={'white'}
// >
//     test2
// </Text> */}
</group>;
{
    /* {card.isClicked && (
                <Text
                    maxWidth={0.1}
                    position={[
                        cardRef.current?.position.x,
                        cardRef.current?.position.y,
                        cardRef.current?.position.z - 0.1,
                    ]}
                    anchorY={'top'}
                    anchorX={-1}
                    fontSize={0.1}
                    rotation={[0, card.cardAngles?.active, 0]}
                    color={'white'}
                >
                    test2
                </Text>
            )} */
}
