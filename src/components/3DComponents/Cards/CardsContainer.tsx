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

    const [isCarouselMoving, setIsCarouselMoving] = useState(false);
    const [isCarouselClicked, setIsCarouselClicked] = useState(false);

    const lastPointerPosition = useRef({ x: 0, y: 0 });
    const groupRef = useRef<Group>(null!);
    const { camera } = useThree();
    const lastCameraPosition = useRef(new Vector3());
    const lastCameraRotation = useRef(new Quaternion());
    const cameraMovementThreshold = 0.15;

    const animation = useSpring({
        scale: isCarouselClicked ? 0.8 : 1,
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
    const eventBox = useCallback((node: Mesh | null, card: ElementType) => {
        if (!node) return;
        if (card.ref?.current?.position) {
            node?.position.copy(card.ref.current.position);
            node?.rotation.copy(card.ref.current.rotation);
            initializedEvents = true;
        }
    }, []);

    const endCarouselMovement = useDebounce(() => {
        setIsCarouselMoving(false);
    }, 100);

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
            if (totalDistance > 0.5) {
                setIsCarouselMoving(true);
                endCarouselMovement();
            }

            lastPointerPosition.current = { x: e.point.x, y: e.point.y };
        },
        [reducer.isMobile]
    );

    const startCarouselMovement = (e) => {
        e.stopPropagation();
        setIsCarouselClicked(true);
        setIsCarouselMoving(true);
    };

    const debouncedStartCarouselMovement = useDebounce(
        startCarouselMovement,
        110
    );

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        if (isCarouselClicked) return;

        // Check previous camera position
        const positionDelta = new Vector3()
            .copy(camera.position)
            .distanceTo(lastCameraPosition.current);

        // Compare Quarternions for rotation
        const rotationDelta = camera.quaternion.angleTo(
            lastCameraRotation.current
        );

        if (positionDelta > cameraMovementThreshold || rotationDelta > 0.01) {
            // if (positionDelta > cameraMovementThreshold || rotationDelta > 0.01) {
            // console.log('mouvement de la camera');
            setIsCarouselMoving(true);
            // if (!isCarouselClicked) {
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

        // Update last camera position & rotation
        lastCameraPosition.current.copy(camera.position);
        lastCameraRotation.current.copy(camera.quaternion);
    });

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
            onPointerMove={!isCarouselClicked && handlePointerMove}
            onPointerDown={debouncedStartCarouselMovement}
            onPointerUp={(e) => {
                e.stopPropagation();
                setIsCarouselClicked(false);
                endCarouselMovement();
            }}
            // scale={animation.scale}
            // scale={isCarouselMoving ? 0.8 : 1}
        >
            {reducer.showElements.map((card, i) => {
                return (
                    <group key={card.url + i}>
                        <mesh
                            ref={(e) => eventBox(e, card)}
                            onPointerOver={(e) =>
                                !isCarouselMoving &&
                                !isCarouselClicked &&
                                debouncedOnHoverHandler(
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
                                onHover(e, card, reducer, isCarouselMoving)
                            }
                            onPointerOut={(e) => onPointerOut(e, card, reducer)}
                            name={`eventBox_${card.id}`}
                            visible={false}
                        >
                            <boxGeometry args={[card.baseScale, 2, 1]}>
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
                                    isCarouselMoving
                                )
                            }
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
                                                    isCarouselMoving
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
