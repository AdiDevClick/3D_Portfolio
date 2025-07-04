import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { CameraControls } from '@react-three/drei';
import { RefObject } from 'react';
import { NavigateFunction } from 'react-router';
import { Vector3 } from 'three';

export interface ErrorWithCause extends Error {
    cause?: { status: number };
}

export type ExperienceProps = { reducer: ReducerType };

export type loadCardByURLProps = {
    id: string;
    showElements: ReducerType['showElements'];
    activateElement: ReducerType['activateElement'];
    clickElement: ReducerType['clickElement'];
    setViewMode: ReducerType['setViewMode'];
    navigate: NavigateFunction;
    visible: ReducerType['visible'];
    setIsURLLoaded: (value: boolean) => void;
};

export type introProps = {
    ref: RefObject<CameraControls | null>;
    setIsIntro: (value: boolean) => void;
    cameraPositions: CameraPosition;
};

type BaseCameraPosition = {
    position: Vector3;
    target: Vector3;
    fov: number;
};

export type CameraPosition = {
    home: BaseCameraPosition & {
        startPosition: [number, number, number];
    };
    contact: BaseCameraPosition;
    carousel: BaseCameraPosition;
};
