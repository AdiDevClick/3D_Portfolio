import { PlaneGeometry, Vector3 } from 'three';

export interface CarouselState {
    elements: ElementType[]; // Tableau des éléments
}

export interface ElementType {
    id: string;
    currentScale: number;
    baseScale: number;
    url: string;
    position: Vector3;
    visibleWireframe?: boolean;
    presenceRadius?: number;
    presenceCircle?: boolean;
    isActive?: boolean;
    ref?: PlaneGeometry;
    animation?: string;
}

export interface ReducerType {
    addElements: (element: ElementType) => void;
    activateElement: (element: ElementType) => void;
    animate: (element: ElementType, animationName: string) => void;
    updateScale: (element: ElementType, number: number) => void;
    updateElements: (element: ElementType) => void;
    deleteElements: (element: ElementType) => void;
    showElements: ElementType[];
}
