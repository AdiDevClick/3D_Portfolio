import { useEffect } from 'react';

export function useProjectActivator({
    ref,
    setViewMode,
    showElements,
    navigate,
    activateElement,
    clickElement,
    activeContent,
    id,
}) {
    if (!ref.current || !activeContent || !id) {
        return;
    }

    let attempts = 0;
    const maxAttempts = 5;
    const initialDelay = 500;

    useEffect(() => {
        const activateCardByURL = () => {
            attempts++;

            // !! IMPORTANT !! Sets the camera to the carousel position
            // reducer.setViewMode('carousel');

            if (attempts > maxAttempts) {
                // Max attempts reached - redirect to carousel
                setViewMode('carousel');
                navigate('/projets', { replace: true });
                return;
            }

            if (showElements.length === 0) {
                // Retry
                return setTimeout(activateCardByURL, 300);
            }

            const targetCard = showElements.find(
                (element) => element.id === id
            );

            if (!targetCard) {
                // No cards ? - redirect to carousel
                setViewMode('carousel');
                navigate('/projets', { replace: true });
                return;
            }

            // Laisser le temps au mode carousel de s'établir
            setTimeout(() => {
                // Activate card to focus
                activateElement(targetCard, true);

                // Activate click after a short delay
                setTimeout(() => {
                    clickElement(targetCard);
                }, 600);
            }, 400);
        };

        // Awaits the initialization of the elements (initialDelay)
        // And then activate the card
        const timer = setTimeout(activateCardByURL, initialDelay);

        return () => clearTimeout(timer);
    }, [showElements]);
}
