import { useCallback, useReducer } from 'react';
import { CarouselState, ReducerType } from './carouselTypes.ts';
import { carouselReducer } from '@/hooks/reducers/carouselReducer.tsx';

// Initial state
const initialState: CarouselState = {
    elements: [],
    loadedCount: 0,
};

/**
 * Reducer pour le Carousel
 */
export function useCarousel(): ReducerType {
    const [state, dispatch] = useReducer(carouselReducer, initialState);
    let activeContent = null;
    let contentSizes = null;
    let contentWidth = null;
    let contentHeight = null;
    let visible = null;

    if (state.elements.length > 0) {
        activeContent = state.elements.find(
            (value) => value.isActive || value.isClicked
        );
    }
    return {
        loadedCount: state.loadedCount,
        visible: visible,
        isMobile: false,
        isTablet: false,
        contentSizes: contentSizes,
        contentWidth: contentWidth,
        contentHeight: contentHeight,
        generalScaleX: 1,
        generalScaleY: 1,
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
                    type: 'ANIMATE_ELEMENT',
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
        updateBending: useCallback(
            (element, property) =>
                dispatch({
                    type: 'UPDATE_ELEMENT_BENDING',
                    payload: { element, property },
                }),
            []
        ),
        deleteElements: useCallback(
            (element) =>
                dispatch({ type: 'DELETE_ELEMENTS', payload: element }),
            []
        ),
        updateLoadCount: useCallback(
            (increment = 1) =>
                dispatch({
                    type: 'UPDATE_LOAD_COUNT',
                    payload: increment,
                }),
            []
        ),
    };
}
