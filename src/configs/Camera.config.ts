/**
 * Card Configurations
 * @module CardConfigs
 */

/**
 * Focus time when a card is clicked on mobile -
 * @description Used to delay the focus on the card
 * - This will zoom out the camera to let the user see the enter card
 * - This is based on the presenceSphere radius attached to the card
 * @constant {boolean}
 */
export const FOCUS_DELAY_MOBILE = 400;

/**
 * Camera Z position for the mobile version
 * when a card is clicked
 * @constant {number}
 */
export const CAMERA_MOBILE_Z_POSITION = 0;
// export const CAMERA_MOBILE_Z_POSITION = -0.9;

/**
 * Camera Y position for the mobile version
 * when a card is clicked
 */
export const CAMERA_MOBILE_Y_POSITION = 0;
// export const CAMERA_MOBILE_Y_POSITION = -0.2;
// export const CAMERA_MOBILE_Y_POSITION = -0.8;

export const CAMERA_FOV_MOBILE = 19;
export const CAMERA_FOV_DESKTOP = 20;

/**
 * Small offset for the camera
 * when a card is clicked -
 * @description Puts the camera a bit on the sides
 */
export const CAMERA_CLICKED_MOBILE_OFFSET = 0;
export const CAMERA_CLICKED_DESKTOP_OFFSET = 1.4;

/**
 * Not hovered camera offset
 *
 * @description This can help the camera to be more centered
 * Lower value = more centered
 */
export const CAMERA_HOVER_DESKTOP_OFFSET = 0.2;

/**
 * Small tilt offset for the camera to avoid true flat angle
 * @description Can help the html container to be more visible
 */
export const CAMERA_ANGLE_OFFSET = Math.PI / 28;

/**
 * Extra pullback for mobile and desktop
 * when a card is hovered
 */
export const CAMERA_EXTRA_PULLBACK_MOBILE = 5.5;
export const CAMERA_EXTRA_PULLBACK_DESKTOP = 3.5;
export const CAMERA_HOVER_PULLBACK_DESKTOP = 6.2;

/**
 * OFFSET for the camera
 * when a card is hovered
 * @constant {number}
 */
export const CAMERA_ACTIVE_FORWARD_OFFSET = 10.5;

/**
 * Angle limits for the camera
 * when a card is clicked - Used in the camerahook
 * @description 20 degrees
 * @constant {number}
 */
export const CAMERA_ANGLELIMITS = Math.PI / 9;

/**
 * Safety margin for the camera
 * to make sure it doesn't go too close to the cards
 *
 * Higher value = more safety margin
 * @constant {number}
 */
export const CAMERA_SAFETY_MARGIN = 4;
export const CAMERA_CLICKED_DESKTOP_CARD_SAFETY_MARGIN = 6.5;

/**
 *
 * @description INTERPOLATIONS FOR EDGES PART
 *
 */

/**
 * Card on the edges ? Set the camera closer to the card
 *
 * Higher value = closer to the card
 */
export const CAMERA_MAX_EDGE_COMPENSATION = 0.5;
/**
 * Rotation speed for the camera for
 * cards on the edges
 *
 * Higher value = faster rotation
 */
export const CAMERA_EDGE_LERP_FACTOR = 0.8;
/**
 * Compensation factor for the camera
 * when a card is on the edges
 * Higher value = more compensation
 */
export const CAMERA_EDGE_COMPENSATION_FACTOR = 9;

/**
 *
 * @description WHEN A CARD IS CLICKED
 *
 */

/**
 * Sets the camera to a maximum speed
 * when a card is clicked
 * @description Interpolation factor
 *
 * Higher value = faster rotation
 */
export const CAMERA_CLICKED_MAX_LERP_FACTOR = 0.85;

/**
 * Multiplier for the lerp factor to adjust the speed
 * toward a clicked card
 *
 * @description Interpolation factor
 *
 * Higher value = faster rotation
 */
export const CAMERA_CLICKED_LERP_MULTIPLIER = 1.5;

/**
 *
 * @description ADJUSTING POSITIONS AND OFFSETS
 *
 */

/**
 * Offset to adjust shifting the camera on the edges
 *
 * Higher value = more offset
 */
export const CAMERA_OFFSET_EDGE_ADJUSTMENT = 1;

/**
 * Vertical position divisor for the camera
 * @description Used to center the camera vertically
 *
 * Higher value = more centered
 */
export const CAMERA_VERTICAL_CENTER_DIVISOR = 5;

/**
 *
 * @description CAMERA TRANSITION DURATION
 *
 */

// /**
//  * Durée par défaut des transitions de caméra (en secondes)
//  * Peut être modifiée pour des animations plus rapides ou plus lentes
//  */
// export const CAMERA_TRANSITION_DURATION = 0.8;

// /**
//  * Facteurs pour le calcul de la durée de transition adaptative
//  */
// export const CAMERA_MIN_TRANSITION_DURATION = 0.4;
// export const CAMERA_EDGE_TRANSITION_FACTOR = 0.5;
export const CAMERA_CLICKED_MIN_RATIO_DESKTOP = 6.5; // Ratio Z/containerScale minimum
export const CAMERA_CLICKED_MIN_RATIO_MOBILE = 5.5; // Version mobile
export const CAMERA_CLICKED_SAFETY_MARGIN = 1;
export const CAMERA_DISTANCE_MOBILE_MULTIPLIER = 1.2; // Multiplier pour la distance mobile
export const CAMERA_DISTANCE_DESKTOP_MULTIPLIER = 1.5; // Multiplier pour la distance desktop
