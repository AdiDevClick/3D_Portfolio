import { useCallback, useReducer } from 'react';
import { CarouselState, ReducerType } from './carouselTypes.ts';
import { carouselReducer } from '@/hooks/reducers/carouselReducer.tsx';

// Initial state
const initialState: CarouselState = {
    elements: [],
    loadedCount: 0,
    isMobile: false,
    isTablet: false,
    contentSizes: null,
    contentWidth: null,
    contentHeight: null,
    generalScaleX: 1,
    // generalScales: {
    //     generalScaleX: 1,
    //     generalScaleY: 1,
    // },
    generalScaleY: 1,
    visible: 'home',
};

/**
 * Reducer pour le Carousel
 */
export function useCarousel(): ReducerType {
    const [state, dispatch] = useReducer(carouselReducer, initialState);

    let activeContent = null;
    let loadedCardCount = 0;
    let allCardsLoaded = false;

    if (state.elements.length > 0) {
        activeContent = state.elements.find(
            (value) => value.isActive || value.isClicked
        );

        loadedCardCount = state.elements.filter(
            (value) => value._loaded === true
        ).length;

        if (loadedCardCount >= state.elements.length) {
            allCardsLoaded = true;
        }
    }

    return {
        allCardsLoaded: allCardsLoaded,
        loadedCount: state.loadedCount,
        visible: state.visible,
        isMobile: state.isMobile,
        isTablet: state.isTablet,
        contentSizes: state.contentSizes,
        contentWidth: state.contentWidth,
        contentHeight: state.contentHeight,
        generalScaleX: state.generalScaleX,
        // generalScales: state.generalScales,
        generalScaleY: state.generalScaleY,
        activeContent: activeContent,
        showElements: state.elements,
        batchUpdate: useCallback((updates) => {
            dispatch({ type: 'BATCH_UPDATE', payload: updates });
        }, []),
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
        // resetLoadCount: useCallback(
        //     () => dispatch({ type: 'RESET_LOAD_COUNT' }),
        //     []
        // ),
        setContentSizes: useCallback(
            (sizes) =>
                dispatch({
                    type: 'SET_CONTENT_SIZES',
                    payload: sizes,
                }),
            []
        ),
        setContentWidth: useCallback(
            (width) =>
                dispatch({
                    type: 'SET_CONTENT_WIDTH',
                    payload: width,
                }),

            []
        ),
        setContentHeight: useCallback(
            (height) =>
                dispatch({
                    type: 'SET_CONTENT_HEIGHT',
                    payload: height,
                }),
            []
        ),
        setGeneralScaleX: useCallback(
            (scale) =>
                dispatch({
                    type: 'SET_GENERAL_SCALEX',
                    payload: scale,
                }),
            []
        ),
        setGeneralScaleY: useCallback(
            (scale) =>
                dispatch({
                    type: 'SET_GENERAL_SCALEY',
                    payload: scale,
                }),
            []
        ),
        // setGeneralScales: useCallback(
        //     (scales) =>
        //         dispatch({
        //             type: 'SET_GENERAL_SCALES',
        //             payload: scales,
        //         }),
        //     []
        // ),
        setViewMode: useCallback(
            (viewMode) =>
                dispatch({
                    type: 'SET_VIEW_MODE',
                    payload: viewMode,
                }),
            []
        ),
        setTablet: useCallback(
            (property) =>
                dispatch({
                    type: 'SET_TABLET',
                    payload: property,
                }),
            []
        ),
        setMobile: useCallback(
            (property) =>
                dispatch({
                    type: 'SET_MOBILE',
                    payload: property,
                }),
            []
        ),
    };
}
