import Card from '@/components/3DComponents/Cards/Card.tsx';
import { onClickHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import { ProjectContainer } from '@/pages/Projects/ProjectContainer';
import {
    DESKTOP_HTML_CONTAINER_DEPTH,
    DESKTOP_HTML_CONTAINER_ROTATION,
    MOBILE_HTML_CONTAINER_POSITION,
    MOBILE_HTML_CONTAINER_ROTATION,
} from '@/configs/3DCarousel.config.ts';
import { Suspense } from 'react';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { SpherePresenceHelper } from '@/components/3DComponents/SpherePresence/SpherePresence.tsx';
import { useLocation, useNavigate } from 'react-router';
import { Title } from '@/components/3DComponents/Title/Title.tsx';

type CardContainerTypes = {
    reducer: ReducerType;
    SETTINGS: SettingsType;
};

let htmlContentRotation = [0, 0, 0] as [number, number, number];

/**
 * Conteneur pour les Cards et ses dépendances -
 * Il contient les cartes et les éléments HTML -
 */
export function CardContainer({ reducer, SETTINGS }: CardContainerTypes) {
    const navigate = useNavigate();
    const location = useLocation();

    if (reducer.isMobile) {
        htmlContentRotation = MOBILE_HTML_CONTAINER_ROTATION;
    } else {
        htmlContentRotation = DESKTOP_HTML_CONTAINER_ROTATION;
    }

    return reducer.showElements.map((card) => {
        return (
            <Card
                card={card}
                presenceRadius={SETTINGS.PRESENCE_RADIUS * card.baseScale}
                reducer={reducer}
                {...SETTINGS}
            >
                <Suspense fallback={null}>
                    <SpherePresenceHelper
                        name="card__spherePresenceHelper"
                        visible={SETTINGS.PRESENCE_CIRCLE}
                        radius={[SETTINGS.PRESENCE_RADIUS * card.baseScale, 32]}
                        color={'red'}
                    />
                </Suspense>

                <Suspense fallback={null}>
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
                </Suspense>
                {card.isClicked && (
                    <group name="htmlContainer">
                        <HtmlContainer
                            reducer={reducer}
                            className="html-container"
                            position={
                                reducer.isMobile
                                    ? MOBILE_HTML_CONTAINER_POSITION
                                    : [
                                          (card.currentWidth ?? 0) / 2,
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
            </Card>
        );
    });
}
