const MathPI = Math.PI * 2;

const collision = new Vector3();

type CarouselProps = {
    boundaries: object;
    datas: [];
};
export default function Carousel({ boundaries, datas }: CarouselProps) {
    const { updateElements, addElements, ...reducerItems } = useCarousel();

    // Override cards count with datas.length
    const carouselSettings = {
        ...carouselGeneralSettings,
        CARDS_COUNT: {
            ...carouselGeneralSettings.CARDS_COUNT,
            value: datas.length,
        },
    };

    // Carousel General Settings
    const { ...settings } = useControls('Carousel Settings', carouselSettings, {
        collapsed: true,
    });

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

    useEffect(() => {
        const currentIds = reducerItems.showElements.map((el) => el.id);
        cards.forEach((card) => {
            if (!currentIds.includes(card.id)) {
                addElements(card); // Ajout des nouveaux éléments
            } else {
                updateElements(card); // Mise à jour des éléments existants
            }
        });

        if (cards.length < reducerItems.showElements.length) {
            reducerItems.deleteElements(cards);
        }
    }, [cards]);

    useFrame((state, delta) => {
        for (let index = 0; index < reducerItems.showElements.length; index++) {
            const actualItem = reducerItems.showElements[index];
            // const actualItem = cards[index];
            const actualCardPosition = actualItem.position;
            let othersDistance;
            let inRangeDistance;

            collision.multiplyScalar(0);

            reducerItems.showElements.forEach((c, i) => {
                if (index === i) {
                    // distance = c.position.distanceTo(card[i]?.position);
                    return;
                }
                othersDistance = c.position;
                // Calculate distance from others
                inRangeDistance =
                    actualCardPosition.distanceTo(othersDistance) -
                    PRESENCE_RADIUS * settings.CARD_SCALE;
                // Calculate collision with others
                if (inRangeDistance > 0 && inRangeDistance < PRESENCE_RADIUS) {
                    console.log(
                        'distance => ',
                        inRangeDistance,
                        'PRESENCE_RADIUS => ',
                        PRESENCE_RADIUS
                    );
                }
            });
        }
    });

    return reducerItems.showElements.map((card, i) => (
        <Card
            key={id + i}
            card={card}
            presenceCircle={PRESENCE_CIRCLE}
            presenceRadius={PRESENCE_RADIUS * card.baseScale}
            visibleWireframe={CARD_WIREFRAME}
            reducerDatas={reducerItems}
            updateElements={updateElements}
        />
    ));
}
