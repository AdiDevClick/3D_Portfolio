import { RefObject } from 'react';

export interface Origin {
    x: number;
    y: number;
}

export interface TouchEventProps {
    /** Element that will receive the transition */
    transitionElement: RefObject<HTMLElement>;
    setClicked: (clicked: boolean) => void;
    // setClicked: Dispatch<SetStateAction<boolean>>;
    isClick: boolean;
    setOrigin: (origin: Origin) => void;
    // setOrigin: (origin: { x?: number; y?: number }) => void;
    // setOrigin: Dispatch<SetStateAction<{ x?: number; y?: number }>>;
    /** The origin of the transition using X & Y */
    origin: Origin | null;
    // origin: { x?: number; y?: number };
    setIsMoving: (isMoving: boolean) => void;
    // setIsMoving: Dispatch<SetStateAction<boolean>>;
    isMoving: boolean;
    activeElementRef: RefObject<HTMLElement>;
}
