import {
    onClickHandler,
    onHover,
    onPointerOut,
} from '@/components/3DComponents/Carousel/Functions';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer';
import { ProjectContainer } from '@/pages/Projects/ProjectContainer';
import {
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
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { ContactShadows } from '@react-three/drei';
import { Group, Mesh, Quaternion, Vector3 } from 'three';
import useDebounce from '@/hooks/useDebounce';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { cardEventBoxMaterial } from '@/components/3DComponents/Cards/CardMaterials';
import { useThrottle } from '@/hooks/useThrottle';

type CardsContainerTypes = {
    reducer: ReducerType;
    SETTINGS: SettingsType;
};
const distancesArray: { index: string; distance: number; title?: string }[] =
    [];
const vec = new Vector3();

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
     * Sets the position of the event box
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
            }
        },
        [isCarouselMoving]
    );

    const endCarouselMovement = useDebounce(() => {
        setIsCarouselMoving(false);
    }, endMovementDebounceDelay);

    /**
     * Handles pointer move on the carousel.
     * @description If the pointer moves more than a threshold,
     * it sets the carousel as moving
     * @param e - The pointer event
     */
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
                endCarouselMovement();
            }

            lastPointerPosition.current = { x: e.point.x, y: e.point.y };
        },
        [reducer.isMobile]
    );

    const startCarouselMovement = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsCarouselMoving(true);
    };
    const carouselClick = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (!isCarouselClicked) setIsCarouselClicked(true);
    };

    const endCarouselClick = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (isCarouselClicked) setIsCarouselClicked(false);
    };

    const debouncedStartCarouselClick = useDebounce(carouselClick, 110);
    const debouncedEndCarouselClick = useDebounce(endCarouselClick, 150);
    // const debouncedStartCarouselMovement = useDebounce(
    //     startCarouselMovement,
    //     110
    // );

    useFrame((state) => {
        if (!groupRef.current) return;
        frameRateCount.current += 1;

        // Handle event Box scale
        if (frameRateCount.current % 10 === 0) {
            distancesArray.length = 0;

            const camera = state.camera;

            reducer.showElements.forEach((item, i) => {
                if (!item.ref?.current) return;

                const distanceFromCamera = item.ref.current.position.distanceTo(
                    camera.position
                );
                distancesArray.push({
                    index: String(item.id),
                    distance: distanceFromCamera,
                    title: item.cardTitle,
                });
            });

            distancesArray.sort((a, b) => a.distance - b.distance);

            reducer.showElements.forEach((item) => {
                if (!item.eventBox) return;

                for (let i = 0; i < distancesArray.length; i++) {
                    if (i <= 4 && item.id === distancesArray[i].index) {
                        item.eventBox.scale.set(1, 1, 1);
                        break;
                    } else {
                        item.eventBox.scale.set(0, 0, 0);
                    }
                }
            });
        }

        if (!isCarouselClicked || reducer.activeContent?.isActive) return;

        // Check previous camera position
        const positionDelta = vec
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
            setIsCarouselMoving(true);
            endCarouselMovement();
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
    });

    const cardsPropsMemo = useMemo(() => {
        return {
            SETTINGS,
            reducer,
        };
    }, [reducer, SETTINGS]);

    const throttledOnHoverHandler = useThrottle((e, card) => {
        if (
            isCarouselMoving ||
            isCarouselClicked ||
            card.id === reducer.activeContent?.id
        ) {
            return;
        }
        onHover(e, card, reducer, isCarouselMoving, isCarouselClicked);
    }, 30);

    const debouncedOnHoverHandler = useDebounce((e, card) => {
        if (
            isCarouselMoving ||
            isCarouselClicked ||
            card.id === reducer.activeContent?.id
        ) {
            return;
        }
        onHover(e, card, reducer, isCarouselMoving, isCarouselClicked);
    }, 20);
    const debouncedOnHoverOutHandler = useDebounce((e, card) => {
        onPointerOut(e, card, reducer, isCarouselMoving);
    }, 50);

    return (
        <animated.group
            ref={groupRef}
            name="cards-container"
            onPointerMove={isCarouselClicked && handlePointerMove}
            onPointerDown={debouncedStartCarouselClick}
            onPointerUp={debouncedEndCarouselClick}
            // scale={animation.scale}
            // scale={isCarouselMoving ? 0.8 : 1}
        >
            {reducer.showElements.map((card, i) => {
                return (
                    <group key={card.url + i}>
                        <mesh
                            castShadow={false}
                            receiveShadow={false}
                            key={`eventBox_${card.id}`}
                            ref={(e) => eventBox(e, card)}
                            onPointerOver={(e) =>
                                !isCarouselMoving &&
                                !isCarouselClicked &&
                                debouncedOnHoverHandler(e, card)
                            }
                            onPointerMove={(e) => {
                                // throttledOnHoverHandler(e, card);
                                onHover(
                                    e,
                                    card,
                                    reducer,
                                    isCarouselMoving,
                                    isCarouselClicked
                                );
                            }}
                            onPointerOut={(e) =>
                                debouncedOnHoverOutHandler(e, card)
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
                                material={cardEventBoxMaterial}
                            />
                        </mesh>
                        <MemoizedCard
                            onClick={(e) =>
                                onClickHandler(
                                    e,
                                    card,
                                    reducer,
                                    location,
                                    navigate,
                                    reducer.isMobile,
                                    isCarouselMoving,
                                    isCarouselClicked
                                )
                            }
                            card={card}
                            presenceRadius={
                                SETTINGS.PRESENCE_RADIUS * card.baseScale
                            }
                            {...cardsPropsMemo}
                        >
                            <SpherePresenceHelper
                                name="card__spherePresenceHelper"
                                visible={SETTINGS.PRESENCE_CIRCLE}
                                debug={SETTINGS.DEBUG_SPHERE_WIREFRAME}
                                radius={[
                                    SETTINGS.PRESENCE_RADIUS * card.baseScale,
                                    32,
                                ]}
                            />

                            <Title
                                text={card.cardTitle ? card.cardTitle : 'test'}
                                name="card__title"
                                size={reducer.isMobile ? 20 : 12}
                                scalar={reducer.generalScaleX}
                                isMobile={reducer.isMobile}
                                // textProps={{
                                //     // scale: 0.01 * reducer.generalScaleX,
                                //     bevelSize: 0.2,
                                //     bevelOffset: 0.2,
                                //     bevelThickness: 0.2,
                                // }}
                            />

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
                                                      0,
                                                  ]
                                        }
                                        isMobile={reducer.isMobile}
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
                                                    reducer.isMobile,
                                                    isCarouselMoving,
                                                    isCarouselClicked
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

                        {(reducer.visible === 'carousel' ||
                            reducer.visible === 'card-detail') && (
                            <ContactShadows
                                key={card.id + i + 'shadow'}
                                frames={120}
                                position={[0, -1.02, 0]}
                                // scale={card.isClicked || card.isActive ? 10 : 5}
                                blur={1}
                                opacity={0.4}
                                // scale={card.isActive ? 3 : 2}
                                smooth={true}
                                // far={1}
                            />
                        )}
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
