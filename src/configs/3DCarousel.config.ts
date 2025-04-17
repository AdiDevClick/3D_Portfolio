import { Vector3 } from 'three';

/**
 * Configuration initiale du carousel -
 * !! IMPORTANT !! CARD_COUNT.value sera remplacé par l'array d'image
 * qui sera récupéré depuis la database.
 */
export const carouselGeneralSettings = {
    CONTAINER_SCALE: { value: 2.4, min: 0.1, max: 20, step: 0.1 },
    CARD_SCALE: { value: 1.2, min: 0.1, max: 2, step: 0.1 },
    ACTIVE_CARD: false,
    CARD_ANIMATION: {
        value: 'Move_Out',
        options: ['Move_Out', 'Move_In'],
    },
    CARDS_COUNT: {
        value: 8,
        min: 1,
        max: 24,
        step: 1,
    },
    CARD_SPEED: { value: 1, min: 0, max: 10, step: 0.1 },
};

/**
 * Configuration du conteneur général -
 * A noter : Le conteneur sera toujours plus large que l'écran -
 * Si nécessaire, il faudra remplacer les valeurs de x, y et z
 * par les responsiveBoundaries.
 */
export const boundariesOptions = {
    attachCamera: true,
    debug: false,
    x: { value: 10, min: 0, max: 40 },
    y: { value: 4, min: 0, max: 40 },
    z: { value: 8.2, min: 0, max: 40 },
    path: {
        value: 'Circle',
        options: ['Circle', 'Rollercoaster', 'Infinity', 'Heart'],
    },
};

/**
 * Toggle 3D/2D settings - Default : true
 */
export const cardsSettings = {
    THREED: { value: true },
    ALIGNMENT: { value: true },
    BENDING: { value: 0.2, min: 0.01, max: 1, step: 0.1 },
    // x_WIDTH: { value: 1, min: 0.01, max: 10 },
    y_HEIGHT: { value: 2, min: 0.01, max: 10 },
};

/**
 * Configure la zone de collision -
 */
export const presenceSettings = {
    PRESENCE_CIRCLE: false,
    COLLISIONS: true,
    PRESENCE_RADIUS: { value: 0.5, min: 0, max: 10, step: 0.1 },
    CARD_WIREFRAME: false,
};

/*****************
 * MOBILE
 ***********/

/** Position du titre 3D */
export const MOBILE_TITLE_POSITION = [0, -1.2, 0.05];
/** Position du conteneur HTML */
export const MOBILE_HTML_CONTAINER_POSITION = [0, -1.5, 0.05];
/** Rotation du conteneur HTML */
export const MOBILE_HTML_CONTAINER_ROTATION = [0, 0.1, 0];

/*****************
 * DESKTOP
 * @description : La position X du conteneur HTML est
 * dépendante de la largeur de la carte - Elle ne peut pas être modifiée.
 ***********/

/** Position du titre 3D */
export const DESKTOP_TITLE_POSITION = [0, 1.1, 0.15];
/** Depth du conteneur HTML */
export const DESKTOP_HTML_CONTAINER_DEPTH = 0.05;
/** Rotation du conteneur HTML */
export const DESKTOP_HTML_CONTAINER_ROTATION = [0, 0, 0];

/**
 * DEFAULTS POSITIONNINGS -
 */

/** Default carousel position on loading page */
// export const DEFAULT_CARD_POSITION = new Vector3(0, 0, 0);
export const DEFAULT_CARD_POSITION = new Vector3(0, -100, 0);
// export const DEFAULT_PROJECTS_POSITION = new Vector3(0, 0, 0);
export const DEFAULT_PROJECTS_POSITION_SETTINGS = new Vector3(0, -100, 0);
export const ACTIVE_PROJECTS_POSITION_SETTINGS = new Vector3(0, 0.15, 0);
// export const ACTIVE_PROJECTS_POSITION = new Vector3(0, 0.15, 0);

/** Default camera position on loading page */
export const DEFAULT_CAMERA_POSITION = new Vector3(0, 0, -20);

/*****************
 * GENERAL SETTINGS
 ***********/

/** On Hover card scale */
export const CARD_HOVER_SCALE = 1.15;

/** Double PI for common purposes */
export const TWO_PI = Math.PI * 2;
