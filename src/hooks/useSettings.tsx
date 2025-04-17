import {
    boundariesOptions,
    cardsSettings,
    carouselGeneralSettings,
    presenceSettings,
} from '@/configs/3DCarousel.config.ts';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes.tsx';
import { useControls, folder, useStoreContext } from 'leva';
import { useMemo } from 'react';

/**
 * Ajoute un panel de contrôle contenant différentes sections.
 * Version optimisée pour éviter les re-créations multiples
 */
export function useSettings(datas: []): SettingsType {
    // Utiliser useMemo pour ne calculer la configuration qu'une seule fois
    // lorsque datas.length change
    const settingsConfig = useMemo(() => {
        // Préparation des paramétrages du carousel adaptés au nombre d'éléments
        const carouselSettings = {
            ...carouselGeneralSettings,
            CARDS_COUNT: {
                ...carouselGeneralSettings.CARDS_COUNT,
                value: datas.length,
            },
        };

        // Configuration regroupée pour Leva avec tous les dossiers
        return {
            // Dossier "Carousel Settings"
            CarouselSettings: folder(
                {
                    ...carouselSettings,
                },
                { collapsed: true }
            ),

            // Dossier "Card Rules"
            CardRules: folder(
                {
                    ...cardsSettings,
                },
                { collapsed: true }
            ),

            // Dossier "Boundaries"
            Boundaries: folder(
                {
                    ...boundariesOptions,
                },
                { collapsed: true }
            ),

            // Dossier "Presence Area"
            PresenceArea: folder(
                {
                    ...presenceSettings,
                },
                { collapsed: true }
            ),
        };
    }, [datas.length]);

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
