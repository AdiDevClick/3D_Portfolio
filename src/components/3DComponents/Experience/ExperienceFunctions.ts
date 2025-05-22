import {
    ErrorWithCause,
    loadCardByURLProps,
} from '@/components/3DComponents/Experience/ExperienceTypes';
import { wait } from '@/functions/promises';

/**
 * Allows a TypeScript function to throw an error with a custom message and status code.
 */
export function createHttpError(message: string, status: number): Error {
    const error = new Error(message);

    Object.defineProperty(error, 'cause', {
        value: { status },
        enumerable: true,
    });
    return error;
}

/**
 * Load a card by its URL.
 * @description : It's a recursive function that will retry loading the card.
 * It will throw an error if the card is not found or if the maximum number of retries is reached.
 *
 * @param retries - Number of retries
 * @param delay - Delay between retries
 * @param options - Options for card loading
 */
export async function loadCardByURL(
    retries = 5,
    delay = 500,
    options: loadCardByURLProps
) {
    const {
        id,
        showElements,
        activateElement,
        clickElement,
        setViewMode,
        navigate,
    } = options;
    try {
        if (showElements.length === 0) {
            throw createHttpError('Try again', 403);
        }

        setViewMode('carousel');

        const targetCard = showElements.find(
            (element: { id: string }) => element.id === id
        );

        if (!targetCard) {
            throw createHttpError('No project found', 404);
        }
        // Wait for the carousel mode to establish
        await wait(400);
        // Activate card to focus
        activateElement(targetCard, true);

        await wait(600);

        // Activate click after a short delay
        clickElement(targetCard);
    } catch (error) {
        const typedError = error as ErrorWithCause;

        if (retries > 0 && typedError.cause?.status === 403) {
            await wait(delay, 'Attente pour un nouvel essai');
            return loadCardByURL(retries - 1, delay * 2, options);
        }

        if (typedError.cause?.status === 404) {
            setViewMode('carousel');
            return navigate('/error', { replace: false });
        }
        console.error('Erreur non gérée :', typedError, error);
    }
}
