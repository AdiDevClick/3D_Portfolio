import { RefObject } from 'react';
import { Mesh, Texture, Vector3 } from 'three';

export interface CarouselState {
    /** Tableau des cards */
    elements: ElementType[];
    loadedCount: number;
    /** Indique si l'appareil est un mobile */
    isMobile: boolean;
    /** Indique si l'appareil est une tablette */
    isTablet: boolean;
    /** Tailles du contenu (tableau de largeur et hauteur) */
    contentSizes: number[] | null;
    /** Largeur du contenu normalisée */
    contentWidth: number | null;
    /** Hauteur du contenu normalisée */
    contentHeight: number | null;
    /** Facteur d'échelle sur l'axe X pour adapter à tous les appareils */
    generalScaleX: number;
    /** Facteur d'échelle sur l'axe Y pour adapter à tous les appareils */
    generalScaleY: number;
    /** Mode de vue actuel ('home', 'carousel', etc.) */
    visible: string | null;
}

// Define payload types based on the function signatures
export type PayloadTypes = {
    BATCH_UPDATE: Partial<CarouselState>;
    UPDATE_ELEMENTS: ElementType;
    ADD_ELEMENTS: ElementType;
    DELETE_ELEMENTS: ElementType[];
    CLICK_ELEMENT: ElementType;
    ACTIVATE_ELEMENT: { element: ElementType; property: boolean };
    ANIMATE_ELEMENT: { id: string };
    UPDATE_ELEMENT_SCALE: { element: ElementType; property: number };
    UPDATE_ELEMENT_WIDTH: { element: ElementType; property: number };
    UPDATE_ELEMENT_BENDING: { element: ElementType; property: number };
    UPDATE_LOAD_COUNT: number;
    SET_MOBILE: boolean;
    SET_TABLET: boolean;
    SET_CONTENT_SIZES: number[] | null;
    SET_CONTENT_WIDTH: number | null;
    SET_CONTENT_HEIGHT: number | null;
    SET_GENERAL_SCALEX: number;
    SET_GENERAL_SCALEY: number;
    SET_VIEW_MODE: string | null;
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
    bending: number;
    texture?: Texture;
    /** The loaded state of the card in the card container */
    _loaded?: boolean;
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
    /** Store the current loaded count of elements */
    updateLoadCount: (increment: number) => void;
    /** Met à jour plusieurs propriétés d'état en une seule action */
    batchUpdate: (updates: Partial<CarouselState>) => void;

    /** Définit les dimensions du contenu */
    setContentSizes: (sizes: number[] | null) => void;

    /** Définit la largeur du contenu normalisée */
    setContentWidth: (width: number | null) => void;

    /** Définit la hauteur du contenu normalisée */
    setContentHeight: (height: number | null) => void;

    /** Définit le facteur d'échelle sur l'axe X */
    setGeneralScaleX: (scale: number) => void;

    /** Définit le facteur d'échelle sur l'axe Y */
    setGeneralScaleY: (scale: number) => void;

    /** Définit le mode de vue actuel */
    setViewMode: (viewMode: string | null) => void;

    /** Définit si l'appareil est une tablette */
    setTablet: (isTablet: boolean) => void;

    /** Définit si l'appareil est un mobile */
    setMobile: (isMobile: boolean) => void;

    /** Indique si toutes les cartes sont chargées */
    allCardsLoaded: boolean;
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
    /** Store the current loaded count of elements in Carousel */
    loadedCount: number;
}
