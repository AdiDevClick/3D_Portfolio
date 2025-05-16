import { RefObject } from 'react';

export type Origin = { x: number; y: number } | null;

export interface TouchEventProps {
    /** Element that will receive the transition */
    transitionElement: RefObject<HTMLElement>;
    setIsClickInProgress: (isClickInProgress: boolean) => void;
    // setClicked: Dispatch<SetStateAction<boolean>>;
    isClickInProgress: boolean;
    setOrigin: (origin: Origin) => void;
    /** The origin of the transition using X & Y */
    origin: Origin;
    // origin: { x?: number; y?: number };
    setIsMoving: (isMoving: boolean) => void;
    // setIsMoving: Dispatch<SetStateAction<boolean>>;
    isMoving: boolean;
    activeElementRef: RefObject<HTMLElement>;
    lastTranslate: { x: number; y: number } | null;
    setLastTranslate: (lastTranslate: { x: number; y: number } | null) => void;
    elementSize: { width: number; height: number } | null;
    setElementSize: (
        elementSize: { width: number; height: number } | null
    ) => void;
    abortControllerRef: RefObject<AbortController | null>;
    setIsOpen: (isOpen: boolean) => void;
    isMobile: boolean;
}
