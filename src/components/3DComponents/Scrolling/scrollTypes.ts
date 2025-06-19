import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { ScrollControlsState } from '@react-three/drei';
import React from 'react';

export interface ScrollResetProps {
    visible: ReducerType['visible'];
}

export type WheelingState = {
    direction?: string;
    moving?: boolean;
};

export type ScrollCompleteState = {
    position?: string;
    complete?: boolean;
};

export type ActivatePageSwitcherProps = {
    setIsWheeling: React.Dispatch<React.SetStateAction<WheelingState>>;
    setIsScrollCompleted: React.Dispatch<
        React.SetStateAction<ScrollCompleteState>
    >;
    direction: string;
    resetDelay?: number;
};

export interface HandleMoveProps
    extends HandleTouchStartProps,
        ScrollResetProps,
        Omit<ActivatePageSwitcherProps, 'direction' | 'resetDelay'> {
    scroll: ScrollControlsState;
}

export interface SetCompleteScrollStatusProps
    extends Omit<ActivatePageSwitcherProps, 'setIsWheeling' | 'resetDelay'> {
    isWheeling: WheelingState;
    condition: boolean;
    scroll: ScrollControlsState;
    position: string;
}

export interface HandleTouchStartProps {
    e: TouchEvent &
        React.TouchEvent<HTMLElement> &
        WheelEvent &
        React.WheelEvent<HTMLElement> &
        Event &
        MouseEvent &
        React.MouseEvent<HTMLElement>;
}

export interface ScrollEventsProps
    extends HandleTouchStartProps,
        ScrollResetProps {}
