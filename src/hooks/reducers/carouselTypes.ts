import { RefObject } from 'react';
import { Mesh, Vector3 } from 'three';

export interface CarouselState {
    /** Tableau des cards */
    elements: ElementType[];
}

// Define payload types based on the function signatures
export type PayloadTypes = {
    UPDATE_ELEMENTS: ElementType;
    ADD_ELEMENTS: ElementType;
    DELETE_ELEMENTS: ElementType[];
    CLICK_ELEMENT: ElementType;
    ACTIVATE_ELEMENT: { element: ElementType; property: boolean };
    ANIMATE_ELEMENT: { id: string };
    UPDATE_ELEMENT_SCALE: { element: ElementType; property: number };
    UPDATE_ELEMENT_WIDTH: { element: ElementType; property: number };
};

// Generate action types from payload types
export type CarouselActions = {
    [K in keyof PayloadTypes]: {
        type: K;
        payload: PayloadTypes[K];
    };
}[keyof PayloadTypes];

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
    rotation: number[];
    /** Activate the wireframe helper ? */
    visibleWireframe?: boolean;
    presenceRadius?: number;
    presenceCircle?: boolean;
    isActive?: boolean;
    isClicked?: boolean;
    /** The 3D object reference of the card */
    ref?: RefObject<Mesh>;
    animation?:
        | string
        | string[]
        | { value: string; options: string[] }
        | undefined;
    /** Current container Scale */
    containerScale: number;
    /** Stores the side positions of the object (for collisions) */
    spacePositions?: sidesPositions;
    /** Stores the angle of the card in order to reattribute it after movement */
    cardAngles: typeAngles;
    currentWidth: number;
    /** Cover image for the card */
    cover?: string;
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
    /** Update the card bending */
    updateBending: (element: ElementType, number: number) => void;
    /** Add some new properties to the element - Avoid using it */
    updateElements: (element: ElementType) => void;
    /** Delete an element based on it's ID */
    deleteElements: (element: ElementType[]) => void;
    /** Display all the elements in the State */
    showElements: ElementType[];
    /** Store the current hovered/clicked element */
    activeContent: ElementType | null | undefined;
    /** Store the viewport width and height in pixels*/
    contentSizes: number[] | null;
    /** Store the viewport normalized height for content calculations */
    contentHeight: number | null;
    /** Store the viewport normalized width  for content calculations */
    contentWidth: number | null;
    /** Store the calculated X-axis Scalar value to fit on all devices */
    generalScaleX: number;
    /** Store the calculated Y-axis Scalar value to fit on all devices */
    generalScaleY: number;
    /** Store the boolean value of a mobile device or not */
    isMobile: boolean;
    /** Store the boolean value of a tablet device or not */
    isTablet: boolean;
    /** Store active page in order to reduce loading data */
    visible: string | null;
}
