import { RefObject } from 'react';
import { Mesh, Vector3 } from 'three';

export interface CarouselState {
    elements: ElementType[]; // Tableau des éléments
}

type sidesPositions = {
    bottom: number;
    top: number;
    left: number;
    right: number;
    front: number | null;
    back: number | null;
};

type typeAngles = { active: number; onHold: number };

export interface ElementType {
    id: string;
    currentScale: number;
    baseScale: number;
    url: string;
    position: Vector3;
    rotation: [number, number, number];
    visibleWireframe?: boolean;
    presenceRadius?: number;
    presenceCircle?: boolean;
    isActive?: boolean;
    isClicked?: boolean;
    ref?: RefObject<Mesh>;
    animation?: string;
    containerScale?: number;
    spacePositions?: sidesPositions;
    cardAngles?: typeAngles;
    stack: {};
}

export interface ReducerType {
    /** Add an element to the State */
    addElements: (element: ElementType) => void;
    /** Activate or Deactivate the hover State */
    activateElement: (element: ElementType, property: boolean) => void;
    /** Activate or Deactivate the clicked State */
    clickElement: (element: ElementType) => void;
    /** Store animations */
    animate: (element: ElementType, animationName: string) => void;
    /** Update the card Scale */
    updateScale: (element: ElementType, number: number) => void;
    /** Add some new properties to the element - Avoid using it */
    updateElements: (element: ElementType) => void;
    /** Delete an element based on it's ID */
    deleteElements: (element: ElementType) => void;
    /** Display all the elements in the State */
    showElements: ElementType[];
    /** Store the current hovered/clicked element */
    activeContent: ElementType | null | undefined;
    /** Store the viewport width and height */
    contentSizes: number[] | null | undefined;
    /** Store the boolean value of a mobile device or not mobile */
    isMobile: boolean;
}
