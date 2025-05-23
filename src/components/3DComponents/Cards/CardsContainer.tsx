import {
    onClickHandler,
    onHover,
    onPointerOut,
} from '@/components/3DComponents/Carousel/Functions';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer';
import { ProjectContainer } from '@/pages/Projects/ProjectContainer';
import {
    DESKTOP_HTML_CONTAINER_DEPTH,
    DESKTOP_HTML_CONTAINER_ROTATION,
    MOBILE_HTML_CONTAINER_POSITION,
    MOBILE_HTML_CONTAINER_ROTATION,
} from '@/configs/3DCarousel.config';
import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes';
import { SpherePresenceHelper } from '@/components/3DComponents/SpherePresence/SpherePresence';
import { useLocation, useNavigate } from 'react-router';
import { Title } from '@/components/3DComponents/Title/Title';
import MemoizedCard from '@/components/3DComponents/Cards/Card';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContactShadows } from '@react-three/drei';
import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
import { Group, Mesh, Quaternion, Vector3 } from 'three';
import useDebounce from '@/hooks/useDebounce';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

type CardsContainerTypes = {
    reducer: ReducerType;
    SETTINGS: SettingsType;
};
const distancesArray: { index: number; distance: number }[] = [];

let initializedEvents = false;

/**
 * Conteneur pour les Cards et ses dépendances -
 * Il contient les cartes et les éléments HTML -
 */
const MemoizedCardsContainer = memo(function CardsContainer({
    reducer,
    SETTINGS,
}: CardsContainerTypes & { isCarouselLoaded: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [isCarouselMoving, setIsCarouselMoving] = useState(
        false
        // reducer.activeContent?.isActive || false
    );
    const [isCarouselClicked, setIsCarouselClicked] = useState(
        // false
        reducer.activeContent?.isClicked || false
    );
    const frameRateCount = useRef(0);

    const lastPointerPosition = useRef({ x: 0, y: 0 });
    const groupRef = useRef<Group>(null!);
    const { camera } = useThree();
    const lastCameraPosition = useRef(new Vector3());
    const lastCameraRotation = useRef(new Quaternion());
    const cameraMovementThreshold = 0.25;
    // const cameraMovementThreshold = 0.15;
    const pointerThreshold = 0.9;
    const rotationThreshold = 0.012;
    const endMovementDebounceDelay = 200;

    const animation = useSpring({
        scale: isCarouselMoving ? 0.8 : 1,
        config: {
            mass: 1,
            tension: 120,
            friction: 14,
        },
        delay: 500,
    });

    let htmlContentRotation = [0, 0, 0] as [number, number, number];

    if (reducer.isMobile) {
        htmlContentRotation = MOBILE_HTML_CONTAINER_ROTATION;
    } else {
        htmlContentRotation = DESKTOP_HTML_CONTAINER_ROTATION;
    }

    /**
     * Allows to set the position of the event box
     *
     * @param node - The event box
     * @param card - The card to set the position
     */
    const eventBox = useCallback(
        (node: Mesh | null, card: ElementType) => {
            if (!node) return;
            card.eventBox = node;

            if (card.ref?.current?.position) {
                node.position.copy(card.ref.current.position);
                node.rotation.copy(card.ref.current.rotation);
                // node.rotation.set(card.ref.current.rotation.x, 0, 0);
                // node.rotation.set(0, card.ref.current.rotation.y, 0);
            }
        },
        [isCarouselMoving]
    );

    const endCarouselMovement = useDebounce(() => {
        // console.log('END MOVEMENT');

        setIsCarouselMoving(false);
    }, endMovementDebounceDelay);

    const handlePointerMove = useCallback(
        (e: ThreeEvent<PointerEvent>) => {
            if (reducer.isMobile) return;
            e.stopPropagation();

            const distanceX = Math.abs(
                e.point.x - lastPointerPosition.current.x
            );
            const distanceY = Math.abs(
                e.point.y - lastPointerPosition.current.y
            );
            const totalDistance = distanceX + distanceY;
            if (totalDistance > pointerThreshold) {
                setIsCarouselMoving(true);
                // console.log(
                //     'POINTER TRANSITION EN COURS, TOTAL DISTANCE :',
                //     totalDistance
                // );
                endCarouselMovement();
            }

            lastPointerPosition.current = { x: e.point.x, y: e.point.y };
        },
        [reducer.isMobile]
    );

    const startCarouselMovement = (e) => {
        e.stopPropagation();
        // setIsCarouselClicked(true);
        setIsCarouselMoving(true);
    };

    const debouncedStartCarouselMovement = useDebounce(
        startCarouselMovement,
        110
    );

    useFrame((state) => {
        if (!groupRef.current) return;
        frameRateCount.current += 1;

        if (frameRateCount.current % 20 === 0) {
            // Handle event Box scale
            distancesArray.length = 0;

            const camera = state.camera;

            reducer.showElements.forEach((item, i) => {
                if (!item.ref.current) return;

                const distanceFromCamera = item.ref.current.position.distanceTo(
                    camera.position
                );

                distancesArray.push({
                    index: i,
                    distance: distanceFromCamera,
                });
            });

            distancesArray.sort((a, b) => a.distance - b.distance);

            const closestCardIndex =
                distancesArray.length > 0 ? distancesArray[0].index : -1;

            reducer.showElements.forEach((item, i) => {
                if (!item.eventBox) return;

                if (
                    i === closestCardIndex ||
                    i === closestCardIndex - 1 ||
                    i === closestCardIndex - 2 ||
                    i === closestCardIndex + 1 ||
                    i === closestCardIndex + 2
                ) {
                    item.eventBox.material.color.setRGB(0.5, 1, 0.5);
                    item.eventBox.scale.set(1, 1, 1);
                } else {
                    item.eventBox.material.color.setRGB(1, 0.5, 0.5);
                    item.eventBox.scale.set(0.1, 0.1, 0.1);
                }
            });
        }

        if (!isCarouselClicked || reducer.activeContent?.isActive) return;

        // Check previous camera position
        const positionDelta = new Vector3()
            .copy(camera.position)
            .distanceTo(lastCameraPosition.current);

        // Compare Quarternions for rotation
        const rotationDelta = camera.quaternion.angleTo(
            lastCameraRotation.current
        );

        if (
            positionDelta > cameraMovementThreshold ||
            rotationDelta > rotationThreshold
        ) {
            // if (positionDelta > cameraMovementThreshold || rotationDelta > 0.01) {
            setIsCarouselMoving(true);
            // if (!isCarouselClicked) {
            // console.log(
            //     'CAMERA TRANSITION EN COURS, DELTA :',
            //     positionDelta,
            //     '\n ROTATION DELTA :',
            //     rotationDelta
            // );
            endCarouselMovement();
            // }
        }
        // if (isCarouselClicked || isCarouselMoving) {
        // easing.damp3(
        //     groupRef.current.scale,
        //     isCarouselMoving ? 0.8 : 1,
        //     // isCarouselClicked || isCarouselMoving ? 0.8 : 1,
        //     0.8,
        //     delta
        // );
        // // }
        // endCarouselMovement();

        // Update last camera position & rotation
        lastCameraPosition.current.copy(camera.position);
        lastCameraRotation.current.copy(camera.quaternion);

        // if (frameRateCount.current % 50 === 0) {
        //     reducer.showElements.forEach((card) => {
        //         if (card.ref?.current && card.eventBox) {
        //             const { position } = card.ref.current;
        //             // const { isVisible, interactivityDepth } =
        //             //     evaluateCardVisibility(
        //             //         camera,
        //             //         card.ref.current.position
        //             //     );
        //             // console.log(isVisible, card.id);
        //             const distance = camera.position.distanceTo(position);

        //             if ()
        //             // console.log('distance', distance, 'card id :', card.id);

        //             // Ajuster la profondeur de l'eventBox
        //             // if (card.eventBox.geometry) {
        //             //     // Si la carte est active, garder une profondeur maximale
        //             //     const finalDepth = card.isActive
        //             //         ? 1.5
        //             //         : interactivityDepth;

        //             //     // Mettre à jour la géométrie
        //             //     // card.eventBox.scale.z = 1;
        //             //     card.eventBox.scale.z = finalDepth;

        //             //     // Rendre l'eventBox interactive ou non
        //             //     card.eventBox.visible = isVisible || card.isActive;
        //             // }
        //         }
        //     });
        // }
    });

    // useEffect(() => {
    //     if (isCarouselMoving) {
    //         console.log('carousel moving t');
    //     } else {
    //         console.log('carousel not moving');
    //     }

    //     if (isCarouselClicked) {
    //         console.log('objects clicked');
    //     } else {
    //         console.log('objects not clicked');
    //     }
    // }, [isCarouselMoving, isCarouselClicked]);

    const cardsPropsMemo = useMemo(() => {
        return {
            SETTINGS,
            reducer,
        };
    }, [reducer, SETTINGS]);

    const debouncedOnHoverHandler = useDebounce(onHover, 200);
    return (
        <animated.group
            ref={groupRef}
            name="cards-container"
            // onPointerMove={isCarouselMoving && handlePointerMove}
            onPointerMove={isCarouselClicked && handlePointerMove}
            // onPointerDown={debouncedStartCarouselMovement}
            onPointerDown={(e) => {
                e.stopPropagation();
                // setIsCarouselMoving(true);
                setIsCarouselClicked(true);
            }}
            onPointerUp={(e) => {
                e.stopPropagation();
                setIsCarouselClicked(false);
                // endCarouselMovement();
            }}
            // onClick={(e) => {
            //     e.stopPropagation();
            //     console.log('test');
            //     // setIsCarouselClicked(false);
            //     // endCarouselMovement();
            // }}
            // scale={animation.scale}
            // scale={isCarouselMoving ? 0.8 : 1}
        >
            {reducer.showElements.map((card, i) => {
                return (
                    <group key={card.url + i}>
                        <mesh
                            key={`eventBox_${card.id}`}
                            ref={(e) => eventBox(e, card)}
                            onPointerOver={(e) =>
                                // !isCarouselMoving &&
                                // // !isCarouselClicked &&
                                // debouncedOnHoverHandler(
                                //     e,
                                //     card,
                                //     reducer,
                                //     isCarouselMoving,
                                //     setIsCarouselMoving
                                // )
                                !isCarouselMoving &&
                                !isCarouselClicked &&
                                onHover(
                                    e,
                                    card,
                                    reducer,
                                    isCarouselMoving,
                                    setIsCarouselMoving
                                )
                            }
                            onPointerMove={(e) =>
                                !isCarouselMoving &&
                                !isCarouselClicked &&
                                card.id !== reducer.activeContent?.id &&
                                onHover(
                                    e,
                                    card,
                                    reducer,
                                    isCarouselMoving,
                                    setIsCarouselMoving
                                )
                            }
                            onPointerOut={(e) =>
                                onPointerOut(
                                    e,
                                    card,
                                    reducer,
                                    endCarouselMovement
                                )
                            }
                            name={`eventBox_${card.id}`}
                            visible={false}
                        >
                            <boxGeometry
                                args={[
                                    card.baseScale,
                                    2,
                                    1,
                                    // card.isActive ? 1.5 : 0.5,
                                ]}
                            >
                                <meshStandardMaterial
                                    color={'white'}
                                    opacity={0}
                                    transparent
                                />
                            </boxGeometry>
                        </mesh>
                        <MemoizedCard
                            onClick={(e) =>
                                onClickHandler(
                                    e,
                                    card,
                                    reducer,
                                    location,
                                    navigate,
                                    isCarouselMoving,
                                    setIsCarouselClicked
                                )
                            }
                            // onPointerOver={(e) =>
                            //     !isCarouselMoving &&
                            //     !isCarouselClicked &&
                            //     debouncedOnHoverHandler(
                            //         e,
                            //         card,
                            //         reducer,
                            //         isCarouselMoving,
                            //         setIsCarouselMoving
                            //     )
                            // }
                            card={card}
                            presenceRadius={
                                SETTINGS.PRESENCE_RADIUS * card.baseScale
                            }
                            {...cardsPropsMemo}
                        >
                            <SpherePresenceHelper
                                position={[0, -0.2, 0]}
                                name="card__spherePresenceHelper"
                                visible={SETTINGS.PRESENCE_CIRCLE}
                                radius={[
                                    SETTINGS.PRESENCE_RADIUS * card.baseScale,
                                    32,
                                ]}
                                color={'red'}
                            />
                            {!reducer.isMobile ? (
                                <Title
                                    name="card__title"
                                    size={10}
                                    textProps={{
                                        scale: 0.01 * reducer.generalScaleX,
                                        bevelSize: 0.2,
                                        bevelOffset: 0.2,
                                        bevelThickness: 0.2,
                                    }}
                                >
                                    {card.cardTitle ? card.cardTitle : 'test'}
                                </Title>
                            ) : (
                                <FallbackText name="card__title">
                                    {card.cardTitle ? card.cardTitle : 'test'}
                                </FallbackText>
                            )}

                            {card.isClicked && (
                                <group name="htmlContainer">
                                    <HtmlContainer
                                        className="html-container"
                                        position={
                                            reducer.isMobile
                                                ? MOBILE_HTML_CONTAINER_POSITION
                                                : [
                                                      (card.currentWidth ?? 0) /
                                                          2,
                                                      0,
                                                      DESKTOP_HTML_CONTAINER_DEPTH,
                                                  ]
                                        }
                                        rotation={htmlContentRotation}
                                        dynamicContent={true}
                                    >
                                        <ProjectContainer
                                            onClick={(e) =>
                                                onClickHandler(
                                                    e,
                                                    card,
                                                    reducer,
                                                    location,
                                                    navigate,
                                                    isCarouselMoving,
                                                    setIsCarouselClicked
                                                )
                                            }
                                            card={card}
                                        />
                                    </HtmlContainer>
                                </group>
                            )}
                            {SETTINGS.CARD_WIREFRAME && (
                                <meshBasicMaterial
                                    visible={SETTINGS.CARD_WIREFRAME}
                                    wireframe
                                />
                            )}
                        </MemoizedCard>

                        <ContactShadows
                            key={card.id + i + 'shadow'}
                            frames={120}
                            position={[0, -1.02, 0]}
                            // scale={card.isClicked || card.isActive ? 10 : 5}
                            blur={1}
                            opacity={0.6}
                        />
                        {/* <mesh
                            receiveShadow
                            position={[
                                card.position[0],
                                card.position[1] - 0.5,
                                card.position[2],
                            ]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            scale={[
                                card.isClicked
                                    ? card.baseScale * 2
                                    : card.baseScale * 1.2,
                                card.isClicked
                                    ? card.baseScale * 2
                                    : card.baseScale * 1.2,
                                1,
                            ]}
                        >
                            <planeGeometry />
                            <shadowMaterial transparent opacity={0.4} />
                        </mesh> */}
                    </group>
                );
            })}
        </animated.group>
    );
});

export default MemoizedCardsContainer;
const evaluateCardVisibility = (camera, cardPosition) => {
    // Direction dans laquelle la caméra regarde
    const cameraDirection = new Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
    );

    // Direction de la caméra vers la carte
    const cardDirection = new Vector3()
        .subVectors(cardPosition, camera.position)
        .normalize();

    // Angle entre la direction de la caméra et la carte
    const angle = cameraDirection.angleTo(cardDirection);

    // Distance entre la caméra et la carte
    const distance = camera.position.distanceTo(cardPosition);

    // Facteurs d'interactivité
    const angleThreshold = Math.PI / 2; // 90 degrés
    const angleFactor = Math.max(0, 1 - angle / angleThreshold);

    const distanceThreshold = 15; // Ajuster selon votre échelle
    const distanceFactor = Math.max(0, 1 - distance / distanceThreshold);

    // Combinaison des facteurs (angle a plus d'importance)
    const visibilityFactor = angleFactor * 0.7 + distanceFactor * 0.3;

    return {
        isVisible: visibilityFactor > 0.15, // Seuil de visibilité
        interactivityDepth: Math.max(0.1, visibilityFactor * 2), // Profondeur de l'eventBox
    };
};
