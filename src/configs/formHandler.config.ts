/**
 * Email error : Can only be email@email.co
 */
export const emailInputRegex = new RegExp(
    '([a-z0-9A-Z._-]+)@([a-z0-9A-Z_-]+)\\.([a-zA-Z.]{2,6})$'
);

/**
 * Phone number regex
 * Allows numbers, spaces, and an optional leading plus sign.
 */
export const phoneRegex = /^\+?[0-9\s]+$/;

/**
 * Email inputs error
 */
export const emailErrorMessage = "Votre adresse email n'est pas correcte.";

/**
 * Empty inputs error
 */
export const emptyInputsErrorMessage = 'Un email et un message sont requis';

/**
 * Successfully sent message
 */
export const successMessage = 'Merci pour votre message !';
