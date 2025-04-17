import { useEffect } from 'react';
import { useOutletContext } from 'react-router';

// Composant activateur simple
export function CarouselActivator() {
    const { setCarouselActive, ...autre } = useOutletContext();
    console.log(autre);
    useEffect(() => {
        setCarouselActive(true);
        return () => setCarouselActive(false);
    }, []);

    return null;
}
