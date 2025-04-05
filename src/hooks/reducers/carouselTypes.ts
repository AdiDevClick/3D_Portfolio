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
}

export interface ReducerType {
    addElements: (element: ElementType) => void;
    activateElement: (element: ElementType, property: boolean) => void;
    clickElement: (element: ElementType) => void;
    animate: (element: ElementType, animationName: string) => void;
    updateScale: (element: ElementType, number: number) => void;
    updateElements: (element: ElementType) => void;
    deleteElements: (element: ElementType) => void;
    showElements: ElementType[];
    activeContent: ElementType | null | undefined;
    contentSizes: number[] | null | undefined;
    isMobile: boolean;
}
