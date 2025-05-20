/**
 * Card Configurations
 * @module CardConfigs
 */

/**
 * Camera Z position for the mobile version
 * when a card is clicked
 * @constant {number}
 */
export const CAMERA_MOBILE_Z_POSITION = 1;

/**
 * Camera Y position for the mobile version
 * when a card is clicked
 */
export const CAMERA_MOBILE_Y_POSITION = 0.5;

export const CAMERA_FOV_MOBILE = 19;
export const CAMERA_FOV_DESKTOP = 20;

/**
 * Small offset for the camera
 * when a card is clicked -
 * @description Puts the camera a bit on the sides
 */
export const CAMERA_ANGLE_OFFSET = Math.PI / 28;

/**
 * Extra pullback for mobile and desktop
 * when a card is hovered
 */
export const CAMERA_EXTRA_PULLBACK_MOBILE = 5.5;
export const CAMERA_EXTRA_PULLBACK_DESKTOP = 3.5;

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
 * @constant {number}
 */
export const CAMERA_SAFETY_MARGIN = 8;
