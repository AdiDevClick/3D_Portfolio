import { CarouselActions, CarouselState } from './carouselTypes.ts';

/* eslint-disable indent */

export function carouselReducer(
    state: CarouselState,
    action: CarouselActions
): CarouselState {
    switch (action.type) {
        case 'BATCH_UPDATE':
            // Update the reducer state with many properties at once
            return {
                ...state,
                ...action.payload,
            };
        case 'UPDATE_ELEMENTS':
            // Update the state with the new dropdown data
            // for cards in the carousel
            return {
                ...state,
                elements: state.elements.map((element) => {
                    return element.id === action.payload.id
                        ? {
                              ...element,
                              ...action.payload,
                          }
                        : element;
                }),
            };
        case 'ADD_ELEMENTS':
            return {
                ...state,
                elements: state.elements.some(
                    (element) => element.id === action.payload.id
                )
                    ? state.elements
                    : [...state.elements, action.payload],
            };
        case 'ACTIVATE_ELEMENT':
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.element.id
                        ? { ...el, isActive: action.payload.property }
                        : el
                ),
            };

        case 'CLICK_ELEMENT':
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.id
                        ? { ...el, isClicked: !el.isClicked }
                        : el
                ),
            };
        case 'ANIMATE_ELEMENT':
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.id
                        ? { ...el, isActive: !el.isActive }
                        : el
                ),
            };
        case 'UPDATE_ELEMENT_SCALE':
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.element.id
                        ? { ...el, currentScale: action.payload.property }
                        : el
                ),
            };
        case 'UPDATE_ELEMENT_WIDTH':
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.element.id
                        ? { ...el, currentWidth: action.payload.property }
                        : el
                ),
            };
        case 'UPDATE_ELEMENT_BENDING':
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.element.id
                        ? { ...el, bending: action.payload.property }
                        : el
                ),
            };
        // return {
        //     ...state,
        //     elements:
        //         state.elements.id !== action.payload.id
        //             ? [...state.elements, action.payload]
        //             : state.elements,
        // };
        case 'DELETE_ELEMENTS':
            return {
                ...state,
                elements: state.elements.filter((el) =>
                    action.payload.some((card) => card.id === el.id)
                ),
            };
        case 'UPDATE_LOAD_COUNT':
            return {
                ...state,
                loadedCount: state.loadedCount + action.payload,
            };

        case 'SET_MOBILE':
            return { ...state, isMobile: action.payload };
        case 'SET_TABLET':
            return { ...state, isTablet: action.payload };
        case 'SET_CONTENT_SIZES':
            return {
                ...state,
                contentSizes: action.payload,
            };
        case 'SET_CONTENT_WIDTH':
            return {
                ...state,
                contentWidth: action.payload,
            };
        case 'SET_CONTENT_HEIGHT':
            return {
                ...state,
                contentHeight: action.payload,
            };
        case 'SET_GENERAL_SCALEX':
            return {
                ...state,
                generalScaleX: action.payload,
            };
        case 'SET_GENERAL_SCALEY':
            return {
                ...state,
                generalScaleY: action.payload,
            };
        // case 'SET_GENERAL_SCALES':
        //     return {
        //         ...state,
        //         generalScales: { ...generalScales, ...action.payload },
        //     };
        case 'SET_VIEW_MODE':
            return {
                ...state,
                visible: action.payload,
            };

        default:
            throw Error(
                'Action non reconnue: ' + (action as { type: string }).type
            );
    }
}
