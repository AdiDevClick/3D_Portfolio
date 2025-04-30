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
import { useId, useRef } from 'react';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { SpherePresenceHelper } from '@/components/3DComponents/SpherePresence/SpherePresence.tsx';
import { useLocation, useNavigate } from 'react-router';
import { Title } from '@/components/3DComponents/Title/Title.tsx';

type CardContainerTypes = {
    reducer: ReducerType;
    SETTINGS: SettingsType;
};

// let titlePosition = [0, 0, 0] as [number, number, number];
let htmlContentRotation = [0, 0, 0] as [number, number, number];

/**
 * Conteneur pour les Cards et ses dépendances -
 * Il contient les cartes et les éléments HTML -
 */
export function CardContainer({ reducer, SETTINGS }: CardContainerTypes) {
    const id = useId();
    const navigate = useNavigate();
    const location = useLocation();

    const titleRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef(null);

    if (reducer.isMobile) {
        // titlePosition = MOBILE_TITLE_POSITION;
        htmlContentRotation = MOBILE_HTML_CONTAINER_ROTATION;
    } else {
        // titlePosition = DESKTOP_TITLE_POSITION;
        htmlContentRotation = DESKTOP_HTML_CONTAINER_ROTATION;
    }

    return reducer.showElements.map((card, i) => {
        card.isClicked ? (cardRef.current = card) : null;
        return (
            <Card
                key={id + i}
                card={card}
                presenceRadius={SETTINGS.PRESENCE_RADIUS * card.baseScale}
                reducer={reducer}
                {...SETTINGS}
            >
                <SpherePresenceHelper
                    name="spherePresenceHelper"
                    visible={SETTINGS.PRESENCE_CIRCLE}
                    radius={[SETTINGS.PRESENCE_RADIUS * card.baseScale, 32]}
                    color={'red'}
                />
                {card.ref?.current && (
                    <Title
                        ref={titleRef}
                        name="title"
                        // position={titlePosition}
                        size={10}
                        textProps={{
                            scale: 0.01 * reducer.generalScaleX,
                            bevelSize: 1,
                        }}
                    >
                        {card.cardTitle ? card.cardTitle : 'test'}
                    </Title>
                )}
                {card.isClicked && (
                    <group name="htmlContainer">
                        <HtmlContainer
                            reducer={reducer}
                            className="html-container"
                            position={
                                reducer.isMobile
                                    ? MOBILE_HTML_CONTAINER_POSITION
                                    : [
                                          card.currentWidth / 2,
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
                        // side={DoubleSide}
                    />
                )}
            </Card>
        );
    });
}
