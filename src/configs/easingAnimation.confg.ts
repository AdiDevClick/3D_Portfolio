import { easing } from 'maath';

export const ANIM_POSITION_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.3,
    animateProperty: 'position' as const,
};
export const ANIM_SCALE_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.2,
    animateProperty: 'scale' as const,
};
