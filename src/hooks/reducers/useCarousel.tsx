import { useCallback, useReducer } from 'react';
import { ReducerType } from './carouselTypes.ts';
import { carouselReducer } from '@/hooks/reducers/carouselReducer.tsx';

/**
 * Reducer pour le Carousel
 */
export function useCarousel(): ReducerType {
    const [state, dispatch] = useReducer(carouselReducer, {
        elements: [],
    });
    let activeContent = null;
    let contentSizes = null;

    if (state.elements.length > 0) {
        activeContent = state.elements.find(
            (value) => value.isActive || value.isClicked
        );
    }
    return {
        isMobile: false,
        contentSizes: contentSizes,
        activeContent: activeContent,
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
            (element, property) =>
                dispatch({
                    type: 'ACTIVATE_ELEMENT',
                    payload: { element, property },
                }),
            []
        ),
        clickElement: useCallback(
            (element) => dispatch({ type: 'CLICK_ELEMENT', payload: element }),
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
        updateWidth: useCallback(
            (element, property) =>
                dispatch({
                    type: 'UPDATE_ELEMENT_WIDTH',
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
