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
    return {
        url: datas[i]
            ? datas[i].cover
            : `src/assets/images/img${Math.floor(i % 10) + 1}.png`,
        description: datas[i] ? datas[i].description : 'description',
        title: datas[i] ? datas[i].title : 'title',
        cardTitle: datas[i] ? datas[i].cardTitle : 'cardTitle',
        content: datas[i]
            ? datas[i].content
            : [
                  'Intégration du Canvas avec ThreeJS',
                  'Créé avec React et TypeScript',
                  "Une implémentation responsive de l'expérience 3D",
              ],
        stack: datas[i] ? datas[i].stack : {},
        position: SETTINGS.THREED ? new Vector3(100, 0, 500) : new Vector3(),
        velocity: new Vector3(0, 0, 0),
        rotation: [0, (i / SETTINGS.CARDS_COUNT) * TWO_PI, 0],
        // rotation: [0, Math.PI + (i / settings.CARDS_COUNT) * TWO_PI, 0],
        wander: randFloat(0, TWO_PI),
        animation: SETTINGS.CARD_ANIMATION,
        baseScale: SETTINGS.CARD_SCALE,
        // currentScale: settings.CARD_SCALE,
        active: SETTINGS.ACTIVE_CARD,
        id: datas[i] ? datas[i].id : `${id}${i}`,
        containerScale: SETTINGS.CONTAINER_SCALE,
        cardAngles: {
            active: Math.atan2(
                Math.sin((i / SETTINGS.CARDS_COUNT) * TWO_PI) *
                    SETTINGS.CONTAINER_SCALE,
                Math.cos((i / SETTINGS.CARDS_COUNT) * TWO_PI) *
                    SETTINGS.CONTAINER_SCALE
            ),
            onHold: (i / self.length) * TWO_PI,
        },
    };
}
