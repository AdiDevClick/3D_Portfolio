import Carousel from '@/components/3DComponents/Carousel/Carousel.tsx';
import { useEffect, useState } from 'react';

// Composant activateur simple
function CarouselActivator() {
    const [loadingStage, setLoadingStage] = useState(0);
    const [cardsLoaded, setCardsLoaded] = useState(0);
    const totalCards = 10; // Nombre total de cartes

    useEffect(() => {
        // Étape 1: Charger la structure de base (immédiat)
        setLoadingStage(1);

        // Étape 2: Charger les premières cartes visibles (rapide)
        setTimeout(() => {
            setLoadingStage(2);
            setCardsLoaded(3); // Les 3 cartes principales
        }, 200);

        // Étape 3: Charger toutes les cartes (progressif)
        const loadNextCard = () => {
            if (cardsLoaded < totalCards) {
                setCardsLoaded((prev) => Math.min(prev + 1, totalCards));
                setTimeout(loadNextCard, 100);
            }
        };

        setTimeout(loadNextCard, 500);
    }, []);

    return (
        <group>
            <Carousel
                loadingStage={loadingStage}
                numberOfCardsToShow={cardsLoaded}
            />
        </group>
    );
}
