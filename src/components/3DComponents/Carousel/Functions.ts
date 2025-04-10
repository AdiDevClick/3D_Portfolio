/**
 * CAROUSEL FUNCTIONS
 */

import { TWO_PI } from '@/configs/3DCarousel.config.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import { Vector3 } from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';

/**
 * Définit les propriétés qui seront intégrées aux cartes.
 *
 * @param datas - Les données des cartes.
 * @param i - L'index dans l'array du .map.
 * @param self - Le self array du .map.
 * @param id - String définit par le useId().
 */
export function createCardProperties(
    SETTINGS: SettingsType,
    datas: ElementType[],
    i: number,
    self: ElementType[],
    id: string
) {
    const defaultUrl = `src/assets/images/img${Math.floor(i % 10) + 1}.png`;
    const defaultContent = [
        'Intégration du Canvas avec ThreeJS',
        'Créé avec React et TypeScript',
        "Une implémentation responsive de l'expérience 3D",
    ];

    const angle = (i / SETTINGS.CARDS_COUNT) * TWO_PI;
    const position = SETTINGS.THREED ? new Vector3(100, 0, 500) : new Vector3();
    const rotation = [0, angle, 0];

    const cardAngles = {
        active: Math.atan2(
            Math.sin(angle) * SETTINGS.CONTAINER_SCALE,
            Math.cos(angle) * SETTINGS.CONTAINER_SCALE
        ),
        onHold: (i / self.length) * TWO_PI,
    };

    return {
        url: datas[i]?.cover || defaultUrl,
        description: datas[i]?.description || 'description',
        title: datas[i]?.title || 'title',
        cardTitle: datas[i]?.cardTitle || 'cardTitle',
        content: datas[i]?.content || defaultContent,
        stack: datas[i]?.stack || {},
        position,
        velocity: new Vector3(0, 0, 0),
        rotation,
        wander: randFloat(0, TWO_PI),
        animation: SETTINGS.CARD_ANIMATION,
        baseScale: SETTINGS.CARD_SCALE,
        active: SETTINGS.ACTIVE_CARD,
        id: datas[i]?.id || `${id}${i}`,
        containerScale: SETTINGS.CONTAINER_SCALE,
        cardAngles,
    };
}
