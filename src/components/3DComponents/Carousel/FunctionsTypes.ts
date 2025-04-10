/**
 * @description This file contains the types used in the Carousel component.
 * @author Adrien Quijo
 */

import { Vector3 } from 'three';

export interface CardProps {
    bending: number;
    setBending: (fn: (prev: number) => number) => void;
    setWidth: (fn: (prev: number) => number) => void;
    delta: number;
    scale: Vector3;
    width: number;
}
