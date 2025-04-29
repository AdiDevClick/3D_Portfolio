import { RefObject } from 'react';
import { Mesh, Vector3 } from 'three';

export interface CarouselState {
    /** Tableau des cards */
    elements: ElementType[];
}

type sidesPositions = {
    /** Bottom side of the element */
    bottom: number;
    /** Top side of the element */
    top: number;
    /** Left side of the element */
    left: number;
    /** Right side of the element */
    right: number;
    /** Front side of the element */
    front: number | null;
    /** Back side of the element */
    back: number | null;
};
interface CardContentType {
    /** The content stack property */
    stack: {};
    /** The main title */
    cardTitle: string;
    /** The secondaty title shown in the clicked card */
    title: string;
    /** An array of strings containing the skills */
    content: string[];
    /** The description of the project next to the title of the card content */
    description: string;
    /** The links of the project */
    links: { name: string; link: string; logo: string }[];
}

type typeAngles = { active: number; onHold: number };

export interface ElementType extends CardContentType {
    id: string;
    currentScale: number;
    baseScale: number;
    url: string;
    /**
     * Vector 3 Position of the card on creation -
     * This will create a navigation effect
     */
    position: Vector3;
    rotation: [number, number, number];
    /** Activate the wireframe helper ? */
    visibleWireframe?: boolean;
    presenceRadius?: number;
    presenceCircle?: boolean;
    isActive?: boolean;
    isClicked?: boolean;
    /** The 3D object reference of the card */
    ref?: RefObject<Mesh>;
    animation?: string;
    /** Current container Scale */
    containerScale: number;
    /** Stores the side positions of the object (for collisions) */
    spacePositions?: sidesPositions;
    /** Stores the angle of the card in order to reattribute it after movement */
    cardAngles: typeAngles;
    currentWidth: number;
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
    /** Update the card Width */
    updateWidth: (element: ElementType, number: number) => void;
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
