import { RefObject } from 'react';
import { Euler, Group, Vector2, Vector3 } from 'three';
import { easing } from 'maath';

/**
 * Easing function type from @react-three/drei
 */
export type EasingFunctionTypes = (
    target: Vector3,
    destination: Vector3,
    time: number,
    delta: number
) => void;
export type MaathEasingFunction =
    | typeof easing.damp3 // ✅ Fonction spécifique
    | typeof easing.damp2 // ✅ Fonction spécifique
    | typeof easing.dampE // ✅ Fonction spécifique
    | typeof easing.damp;
/**
 * Configuration for a single animation item
 */
export interface AnimationItemType {
    /** Reference to the Three.js object to animate */
    ref: RefObject<Group | null>;

    /** Type of animation to apply */
    type: keyof Pick<Group, 'position' | 'scale' | 'rotation'>;

    /** Target position/scale/rotation to animate towards */
    effectOn: Vector3 | [number, number, number] | number[] | Vector2 | Euler;

    /** Animation duration/damping time */
    time: number;
    /** Easing function to use (e.g., easing.damp3) */
    animationType: MaathEasingFunction | EasingFunctionTypes;
}

/**
 * Props for the useAnimateItems hook
 */
export interface AnimateItemProps {
    /** Animation configuration for single item */
    item: AnimationItemType;

    /** Whether the page/component is currently active */
    isActive: boolean;

    /** Reference to main group for global visibility check */
    groupRef?: RefObject<Group | null>;
    /** Time delta for smooth animation */
    delta: number;
}
