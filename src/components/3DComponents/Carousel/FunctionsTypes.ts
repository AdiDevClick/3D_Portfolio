/**
 * @description This file contains the types used in the Carousel component.
 * @author Adrien Quijo
 */

import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { Vector3 } from 'three';

export interface CardProps {
    updateBending: ReducerType['updateBending'];
    updateWidth: ReducerType['updateWidth'];
    delta: number;
    scale: Vector3;
    card: ElementType;
}

export interface CollisionConfig {
    margin: number;
    deltaScale: number;
    minScaleDifference: number;
}
