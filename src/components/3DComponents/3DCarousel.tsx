import { useEffect, useId, useMemo } from 'react';
import Card from './3DCard.tsx';
import { useControls } from 'leva';
import {
    cardsSettings,
    carouselGeneralSettings,
    presenceSettings,
} from '../../configs/3DCarousel.config.tsx';
import { Vector3 } from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';
import { useFrame } from '@react-three/fiber';
import { useCarousel } from '../../hooks/reducers/useCarousel.tsx';
import { ElementType } from '../../hooks/reducers/carouselTypes.ts';
import { throttle } from '../../functions/promises.js';

const MathPI = Math.PI * 2;

const collision = new Vector3();

type CarouselProps = {
    boundaries: object;
    datas: [];
};
export default function Carousel({ boundaries, datas }: CarouselProps) {
    const { ...reducer } = useCarousel();

    // Override cards count with datas.length
    const carouselSettings = {
        ...carouselGeneralSettings,
        CARDS_COUNT: {
            ...carouselGeneralSettings.CARDS_COUNT,
            value: datas.length,
        },
    };

    // Carousel General Settings
    // const [{ CARDS_COUNT, CONTAINER_SCALE, CARD_ANIMATION }, set] = useControls(
    //     () => {
    //         carouselSettings,
    //     }
    // );

    const [settings, set] = useControls(
        'Carousel Settings',
        () => ({
            ...carouselSettings, // Ajout de tous les paramètres définis dans carouselSettings
        }),
        { collapsed: true }
    );

    // 3D Toggle Settings
    const { threeD, ALIGNMENT } = useControls('Card Rules', cardsSettings, {
        collapsed: true,
    });

    // Collision Detection Settings
    const { PRESENCE_CIRCLE, PRESENCE_RADIUS, CARD_WIREFRAME } = useControls(
        'Presence Area',
        presenceSettings,
        { collapsed: true }
    );

    const id = useId();

    const margin = 0.1; // Marge pour éviter les oscillations fréquentes
    const lowerThreshold = 0; // Collision
    const upperThreshold = PRESENCE_RADIUS + margin; // Trop éloigné

    const cards = useMemo(() => {
        return new Array(settings.CARDS_COUNT).fill(null).map((_, i) => ({
            url: datas[i]
                ? datas[i].cover
                : `src/assets/images/img${Math.floor(i % 10) + 1}.png`,
            position: new Vector3(
                threeD
                    ? Math.sin((i / settings.CARDS_COUNT) * MathPI) *
                      settings.CONTAINER_SCALE
                    : 0,
                0,
                threeD
                    ? Math.cos((i / settings.CARDS_COUNT) * MathPI) *
                      settings.CONTAINER_SCALE
                    : 0
            ),
            velocity: new Vector3(0, 0, 0),
            rotation: [
                0,
                Math.PI + (i / settings.CARDS_COUNT) * Math.PI * 2,
                0,
            ],
            wander: randFloat(0, Math.PI * 2),
            animation: settings.CARD_ANIMATION,
            baseScale: settings.CARD_SCALE,
            currentScale: settings.CARD_SCALE,
            active: settings.ACTIVE_CARD,
            id: datas[i] ? datas[i].id : id + i, // Id unique
        }));
    }, [
        settings.CARDS_COUNT,
        settings.CARD_SCALE,
        settings.CONTAINER_SCALE,
        threeD,
    ]);

    /**
     * Crer l'array du reducer qui sera partagé -
     * Il ne sera créé qu'une fois -
     */
    useEffect(() => {
        const currentIds = reducer.showElements.map((el) => el.id);
        cards.forEach((card) => {
            if (!currentIds.includes(card.id)) {
                reducer.addElements(card); // Ajout des nouveaux éléments
            } else {
                reducer.updateElements(card); // Mise à jour des éléments existants
            }
        });

        if (cards.length < reducer.showElements.length) {
            reducer.deleteElements(cards);
        }
    }, [cards]);

    useFrame((state, delta) => {
        for (let index = 0; index < reducer.showElements.length; index++) {
            const actualItem = reducer.showElements[index];
            const actualCardPosition = actualItem.position;

            collision.multiplyScalar(0);
            actualItem.width = actualItem.ref.current

            reducer.showElements.forEach((c, i) => {
                if (index === i) {
                    return;
                }

                // const actualCardPosition = actualItem.position.clone();
                const othersCardPosition = c.position;
                // const othersCardPosition = c.position.clone();
                // const othersDistance = c.position;

                const scaleRatio = actualItem.currentScale / c.currentScale;

                const radiusDifference =
                    effectiveRadius(actualItem, PRESENCE_RADIUS, 0.2) +
                    effectiveRadius(c, PRESENCE_RADIUS, 4) * scaleRatio;

                // Pondération dynamique
                // const radiusDifference =
                //     actualItem.baseScale *
                //         actualItem.currentScale *
                //         PRESENCE_RADIUS +
                //     c.baseScale * c.currentScale * PRESENCE_RADIUS;

                // Calculate distance from others
                const inRangeDistance =
                    actualCardPosition.distanceTo(othersCardPosition) -
                    radiusDifference;

                // Calculate collision with others
                if (inRangeDistance <= 0) {
                    // if (inRangeDistance > 0 && inRangeDistance < PRESENCE_RADIUS) {

                    set({ CONTAINER_SCALE: settings.CONTAINER_SCALE + 0.05 });
                }
                // if (inRangeDistance > upperThreshold + margin) {
                //     const currentContainerScale = settings.CONTAINER_SCALE;
                //     const newContainerScale =
                //         currentContainerScale +
                //         (settings.CONTAINER_SCALE -
                //             0.05 -
                //             currentContainerScale) *
                //             0.1;
                //     set({ CONTAINER_SCALE: settings.CONTAINER_SCALE - 0.05 });
                // }
                // if (inRangeDistance > 4)
                // set({ CONTAINER_SCALE: settings.CONTAINER_SCALE - 0.05 });
            });
        }
    });

    return reducer.showElements.map((card, i) => (
        <Card
            key={id + i}
            card={card}
            presenceCircle={PRESENCE_CIRCLE}
            presenceRadius={PRESENCE_RADIUS * card.baseScale}
            visibleWireframe={CARD_WIREFRAME}
            reducer={reducer}
        />
    ));
}

function effectiveRadius(
    card: ElementType,
    globalRadius: number,
    ponderateFactor: number
) {
    const baseComponent = card.baseScale * globalRadius;
    const additional =
        Math.max(card.currentScale - 1, 0) * globalRadius * ponderateFactor;
    return baseComponent + additional;
}
