import {
    onClickHandler,
    onHover,
    onPointerOut,
} from '@/components/3DComponents/Carousel/Functions.ts';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import { ProjectContainer } from '@/pages/Projects/ProjectContainer';
import {
    DESKTOP_HTML_CONTAINER_DEPTH,
    DESKTOP_HTML_CONTAINER_ROTATION,
    DESKTOP_HTML_TITLE_POSITION_SETTINGS,
    MOBILE_HTML_CONTAINER_POSITION,
    MOBILE_HTML_CONTAINER_ROTATION,
    MOBILE_PROJECT_CONTAINER_POSITION,
} from '@/configs/3DCarousel.config.ts';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { SpherePresenceHelper } from '@/components/3DComponents/SpherePresence/SpherePresence.tsx';
import { useLocation, useNavigate } from 'react-router';
import { Title } from '@/components/3DComponents/Title/Title.tsx';
import MemoizedCard from '@/components/3DComponents/Cards/Card.tsx';
import { memo, useMemo } from 'react';
import { ContactShadows } from '@react-three/drei';
import { FallbackText } from '@/components/3DComponents/Title/FallbackText.tsx';

type CardsContainerTypes = {
    reducer: ReducerType;
    SETTINGS: SettingsType;
};

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

    let htmlContentRotation = [0, 0, 0] as [number, number, number];

    if (reducer.isMobile) {
        htmlContentRotation = MOBILE_HTML_CONTAINER_ROTATION;
    } else {
        htmlContentRotation = DESKTOP_HTML_CONTAINER_ROTATION;
    }

    const cardsPropsMemo = useMemo(() => {
        return {
            SETTINGS,
            reducer,
        };
    }, [reducer, SETTINGS]);

    return (
        <group name="cards-container">
            {reducer.showElements.map((card, i) => {
                return (
                    <group key={card.id + i}>
                        <MemoizedCard
                            onPointerOver={(e) => onHover(e, card, reducer)}
                            onPointerOut={(e) =>
                                onPointerOut(e, card, reducer, navigate)
                            }
                            onClick={(e) =>
                                onClickHandler(
                                    e,
                                    card,
                                    reducer,
                                    location,
                                    navigate
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
                                        bevelSize: 1,
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
                                                    navigate
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
                            frames={1}
                            position={[0, -1.02, 0]}
                            blur={1}
                            opacity={0.6}
                        />
                    </group>
                );
            })}
        </group>
    );
});

export default MemoizedCardsContainer;
// export default memo(CardContainer, (prevProps, nextProps) => {
//     // Ne re-render que si ces props spécifiques ont changé
//     return (
//         prevProps.SETTINGS === nextProps.SETTINGS &&
//         prevProps.reducer.showElements === nextProps.reducer.showElements
//     );
// });
