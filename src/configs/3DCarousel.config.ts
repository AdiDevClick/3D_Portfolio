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

export const TWO_PI = Math.PI * 2;
