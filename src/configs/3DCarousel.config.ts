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
export const MOBILE_TITLE_POSITION = [0, -1.2, 0.05] as [
    number,
    number,
    number
];
/** Position du conteneur HTML */
export const MOBILE_HTML_CONTAINER_POSITION = [0, 0, 0.05] as [
    // export const MOBILE_HTML_CONTAINER_POSITION = [0, -0.6, 0.05] as [
    // export const MOBILE_HTML_CONTAINER_POSITION = [0, -1.5, 0.05] as [
    number,
    number,
    number
];
/** Rotation du conteneur HTML */
export const MOBILE_HTML_CONTAINER_ROTATION = [0, 0.1, 0] as [
    number,
    number,
    number
];

/*****************
 * DESKTOP
 * @description : La position X du conteneur HTML est
 * dépendante de la largeur de la carte - Elle ne peut pas être modifiée.
 ***********/

/** Position du titre 3D */
export const DESKTOP_TITLE_POSITION = [0, 1.1, 0.15] as [
    number,
    number,
    number
];
/** Depth du conteneur HTML */
export const DESKTOP_HTML_CONTAINER_DEPTH = 0.05;
/** Rotation du conteneur HTML */
export const DESKTOP_HTML_CONTAINER_ROTATION = [0, 0, 0] as [
    number,
    number,
    number
];
/** Position du titre HTML des pages */
export const DESKTOP_HTML_TITLE_POSITION_SETTINGS = (
    height: number,
    margin: number
) => [0, height / 2 - margin * 2, 0];
// ) => new Vector3(0, height / 2 + margin - 1, 0);
/** Position des icônes des pages */
export const DESKTOP_HTML_ICONS_POSITION_SETTINGS = (
    height: number,
    width: number,
    margin: number
) => new Vector3(width / 2 - margin * 2.5, -(height / 2) + margin, 0);

export const MOBILE_PROJECT_CONTAINER_POSITION = () => {
    // Utiliser le même calcul de hauteur basé sur FOV
    const initialCameraFov = 19;
    const vFov = (initialCameraFov * Math.PI) / 180; // FOV en radians
    const visibleHeight = 2 * Math.tan(vFov / 2) * initialCameraFov; // Hauteur visible à distance 20

    // Calculer le décalage vertical en fonction du contenu
    // Plus le contenu est grand, plus il remonte
    const contentFactor = Math.min(visibleHeight / 15, 2.5);
    // const yOffset = visibleHeight - contentFactor * 1.2;
    const yOffset = -2 - contentFactor * 0.5;

    return DESKTOP_HTML_TITLE_POSITION_SETTINGS(visibleHeight, 0.5);
    // return [
    //     0, // X centré
    //     visibleHeight, // Y adaptatif avec décalage vers le haut
    //     5, // Z - plus proche de la caméra pour meilleure lisibilité
    // ];
};
// ) => new Vector3(width / 2 - margin * 2.5, -height / 2 - margin, 0);

/**
 * DEFAULTS POSITIONNINGS -
 */

/** Default carousel position on loading page */
// export const DEFAULT_CARD_POSITION = new Vector3(0, 0, 0);
export const DEFAULT_CARD_POSITION = [0, -100, 0];
// export const DEFAULT_CARD_POSITION = new Vector3(0, 0, 0);
// export const DEFAULT_CARD_POSITION = new Vector3(0, -100, 0);
// export const DEFAULT_PROJECTS_POSITION_SETTINGS = [0, -100, 0];
export const DEFAULT_PROJECTS_POSITION_SETTINGS = new Vector3(0, -100, 0);
// export const ACTIVE_PROJECTS_POSITION_SETTINGS = [0, 0.15, 0];
export const ACTIVE_PROJECTS_POSITION_SETTINGS = new Vector3(0, 0, 0);
/** Default HTML positions */
export const DEFAULT_HTML_POSITION_SETTINGS = [0, -0.8, 0];
// export const DEFAULT_HTML_POSITION_SETTINGS = new Vector3(0, -0.8, 0);

/** Default camera position on loading page */
// export const DEFAULT_CAMERA_POSITION = [0, 0, -20];
export const DEFAULT_CAMERA_POSITION = new Vector3(0, 0, -20);

/*****************
 * GENERAL SETTINGS
 *
 * @description : General settings for the carousel
 **/

/** On Hover card scale */
// export const CARD_HOVER_SCALE = 1.4;
export const CARD_HOVER_SCALE = 1.15;
// export const CARD_HOVER_SCALE = 1.5;

/** Double PI for common purposes */
export const TWO_PI = Math.PI * 2;

/** PI and Half for common purposes */
export const PI_AND_HALF = Math.PI * 1.5;

/*****************
 * 3D ICONS -
 *
 * @description : 3D Icons settings
 **/
/** Hover Color */
export const hoveredIconColor = '#4285F4';
/** Emissive Light intensity on Hover */
export const emissiveIntensity = 0.8;
