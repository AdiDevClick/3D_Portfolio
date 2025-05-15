import {
    boundariesOptions,
    cardsSettings,
    carouselGeneralSettings,
    presenceSettings,
} from '@/configs/3DCarousel.config';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes';
import { useControls, folder } from 'leva';
import { useMemo } from 'react';

/**
 * Ajoute un panel de contrôle contenant différentes sections.
 * Version optimisée pour éviter les re-créations multiples
 */
export function useSettings(datas: any[]): SettingsType {
    const settingsConfig = useMemo(() => {
        // !! IMPORTANT !!
        // CARDS_COUNT.value will be replaced by the datas array
        // All values above are default/generic values
        const carouselSettings = {
            ...carouselGeneralSettings,
            CARDS_COUNT: {
                ...carouselGeneralSettings.CARDS_COUNT,
                value: datas.length,
            },
        };

        return {
            // Folder "Carousel Settings"
            CarouselSettings: folder(
                {
                    ...carouselSettings,
                },
                { collapsed: true }
            ),

            // Folder "Card Rules"
            CardRules: folder(
                {
                    ...cardsSettings,
                },
                { collapsed: true }
            ),

            // Folder "Boundaries"
            Boundaries: folder(
                {
                    ...boundariesOptions,
                },
                { collapsed: true }
            ),

            // Folder "Presence Area"
            PresenceArea: folder(
                {
                    ...presenceSettings,
                },
                { collapsed: true }
            ),
        };
    }, [datas.length]);

    // Adding a setter to the settings
    const [{ ...allSettings }, set] = useControls(
        'Carousel',
        () => settingsConfig
    );

    const result = {
        ...allSettings,
        set,
    };

    return result;
}
