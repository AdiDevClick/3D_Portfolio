import {
    boundariesOptions,
    cardsSettings,
    carouselGeneralSettings,
    presenceSettings,
} from '@/configs/3DCarousel.config.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { useControls } from 'leva';

/**
 * Ajoute un panel de contrôle contenant différentes sections.
 */
export function useSettings(datas: []): SettingsType {
    /**
     * Boundaries Settings
     */
    const { ...BOUDARIES_RULES } = useControls(
        'Boundaries',
        boundariesOptions,
        { collapsed: true }
    );

    /**
     * Carousel settings
     */
    const [{ ...SETTINGS }, set] = useControls(
        'Carousel Settings',
        () => ({
            // !! IMPORTANT !! Override cards count with datas.length
            ...carouselGeneralSettings,
            CARDS_COUNT: {
                ...carouselGeneralSettings.CARDS_COUNT,
                value: datas.length,
            },
        }),
        { collapsed: true }
    );

    /**
     * Card Rules Settings
     */
    const { ...CARD_RULES } = useControls('Card Rules', cardsSettings, {
        collapsed: true,
    });

    /**
     * Collision Detection Settings
     */
    const { ...COLLISIONS_RULES } = useControls(
        'Presence Area',
        presenceSettings,
        { collapsed: true }
    );

    return {
        ...SETTINGS,
        set,
        ...COLLISIONS_RULES,
        ...CARD_RULES,
        ...BOUDARIES_RULES,
    };
}
