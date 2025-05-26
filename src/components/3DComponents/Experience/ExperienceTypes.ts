import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { NavigateFunction } from 'react-router';

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
};
