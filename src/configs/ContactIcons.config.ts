import { Vector3 } from 'three';

/** Margin positions for Mobile */
export const MOBILE_ICONS_MARGINS_POSITION_SETTINGS = { x: 0.8, y: 1.2 };
/** Margin positions for Desktop */
export const DESKTOP_ICONS_MARGINS_POSITION_SETTINGS = { x: 1, y: 1 };

/** Function that positions icons to the lower left corner of the screen */
export const CONTACT_ICONS_POSITION_SETTINGS = (
    height: number,
    width: number,
    margin: { x: number; y: number }
) => new Vector3(width / 2 - margin.x, -(height / 2) + margin.y, 0);
