import { useCallback, useReducer } from 'react';
import { carouselReducer } from './CarouselReducer.tsx';
import { ReducerType } from './carouselTypes.ts';

export function useCarousel(): ReducerType {
    const [state, dispatch] = useReducer(carouselReducer, {
        elements: [],
    });

    return {
        showElements: state.elements,
        updateElements: useCallback((element) => {
            if (!element || !element.id) {
                console.warn('Element invalide pour mise à jour', element);
                return;
            }
            dispatch({ type: 'UPDATE_ELEMENTS', payload: element });
        }, []),
        addElements: useCallback(
            (element) => dispatch({ type: 'ADD_ELEMENTS', payload: element }),
            []
        ),
        activateElement: useCallback(
            (element) =>
                dispatch({ type: 'ACTIVATE_ELEMENT', payload: element }),
            []
        ),
        animate: useCallback(
            (element, property) =>
                dispatch({
                    type: 'START_ANIMATION',
                    payload: { element, property },
                }),
            []
        ),
        updateScale: useCallback(
            (element, property) =>
                dispatch({
                    type: 'UPDATE_ELEMENT_SCALE',
                    payload: { element, property },
                }),
            []
        ),
        deleteElements: useCallback(
            (element) =>
                dispatch({ type: 'DELETE_ELEMENTS', payload: element }),
            []
        ),
    };
}
