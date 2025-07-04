import {
    ErrorWithCause,
    introProps,
    loadCardByURLProps,
} from '@/components/3DComponents/Experience/ExperienceTypes';
import { wait } from '@/functions/promises';
import { Vector3 } from 'three';

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
        setIsURLLoaded,
        visible,
    } = options;

    try {
        if (showElements.length === 0) {
            throw createHttpError('Try again', 403);
        }

        const targetCard = showElements.find(
            (element: { id: string }) => element.id === id
        );

        if (!targetCard) {
            throw createHttpError('No project found', 404);
        }
        await wait(400);

        activateElement(targetCard, true);

        await wait(800);

        clickElement(targetCard);
        setIsURLLoaded(true);
    } catch (error) {
        const typedError = error as ErrorWithCause;

        if (
            (retries > 0 && typedError.cause?.status === 403) ||
            typedError.cause?.status === 500
        ) {
            await wait(delay, 'Attente pour un nouvel essai');
            return loadCardByURL(retries - 1, delay * 2, options);
        }

        if (typedError.cause?.status === 404) {
            return navigate('/error', { replace: false });
        }
        console.error('Erreur non gérée :', typedError, error);
    }
}

/**
 * Positions the camera on loading -
 *
 * @param ref - CameraControls ref
 * @param setIsIntro - Function to set the intro state
 */
async function positionCamOnLoading({
    ref,
    setIsIntro,
    cameraPositions,
}: introProps) {
    if (!ref.current) return;

    ref.current.smoothTime = 1.2;
    await ref.current.dolly(16.5, true);

    // Save/update the final position and fov for later use when switching back to home
    const finalPosition = ref.current.getPosition(new Vector3());
    // finalIntroTarget = ref.current.getTarget(new Vector3());
    const finalIntroFov =
        'fov' in ref.current.camera ? ref.current.camera.fov : 75;

    cameraPositions.home.position = finalPosition;
    cameraPositions.home.fov = finalIntroFov;

    ref.current.camera.updateProjectionMatrix();
    setIsIntro(false);
}

/**
 * Intro function to position the camera on the home page
 * @description : This function sets the camera position and fov
 * !! IMPORTANT !! - updateProjectionMatrix is MANDATORY
 *
 * @param ref - CameraControls ref
 * @param setIsIntro - Function to set the intro state
 */
export async function playIntro({
    ref,
    setIsIntro,
    cameraPositions,
}: introProps) {
    if (!ref.current) return;

    if ('fov' in ref.current.camera) {
        ref.current.camera.fov = cameraPositions.home.fov;
    }
    ref.current.camera.updateProjectionMatrix();
    ref.current.setPosition(...cameraPositions.home.startPosition);
    await positionCamOnLoading({ ref, setIsIntro, cameraPositions });
}
