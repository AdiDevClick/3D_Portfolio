import Card from '@/components/3DComponents/Cards/Card.tsx';
import { CardMainTitle } from '@/components/3DComponents/Cards/CardMainTitle.tsx';
import { onClickHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import { ProjectContainer } from '@/components/HTML/projects/ProjectContainer';
import {
    DESKTOP_HTML_CONTAINER_DEPTH,
    DESKTOP_HTML_CONTAINER_ROTATION,
    MOBILE_HTML_CONTAINER_POSITION,
    MOBILE_HTML_CONTAINER_ROTATION,
} from '@/configs/3DCarousel.config.ts';
import { useId } from 'react';
import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { SpherePresenceHelper } from '@/components/3DComponents/SpherePresence/SpherePresence.tsx';
import { useLocation, useNavigate } from 'react-router';

type CardContainerTypes = {
    reducer: ReducerType;
    SETTINGS: SettingsType;
};

/**
 * Conteneur pour les Cards et ses dépendances -
 * Il contient les cartes et les éléments HTML -
 */
export function CardContainer({ reducer, SETTINGS }: CardContainerTypes) {
    const id = useId();
    const navigate = useNavigate();
    const location = useLocation();

    return reducer.showElements.map((card, i) => (
        <Card
            key={id + i}
            card={card}
            presenceRadius={SETTINGS.PRESENCE_RADIUS * card.baseScale}
            reducer={reducer}
            {...SETTINGS}
        >
            <SpherePresenceHelper
                visible={SETTINGS.PRESENCE_CIRCLE}
                radius={[SETTINGS.PRESENCE_RADIUS * card.baseScale, 32]}
                color={'red'}
            />
            {card.ref?.current && (
                <CardMainTitle reducer={reducer} card={card} />
            )}
            {card.isClicked && (
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
                    rotation={
                        reducer.isMobile
                            ? MOBILE_HTML_CONTAINER_ROTATION
                            : DESKTOP_HTML_CONTAINER_ROTATION
                    }
                    dynamicContent={true}
                >
                    <ProjectContainer
                        onClick={(e) =>
                            onClickHandler(e, card, reducer, location, navigate)
                        }
                        card={card}
                    />
                </HtmlContainer>
            )}
            {SETTINGS.CARD_WIREFRAME && (
                <meshBasicMaterial
                    visible={SETTINGS.CARD_WIREFRAME}
                    wireframe
                    // side={DoubleSide}
                />
            )}
        </Card>
    ));
}
