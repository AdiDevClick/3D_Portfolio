import { CarouselState } from './carouselTypes.ts';

/* eslint-disable indent */
export function carouselReducer(
    state: CarouselState,
    action: object
): CarouselState {
    switch (action.type) {
        case 'UPDATE_ELEMENTS':
            // Update the state with the new dropdown data
            console.log('Action Payload:', action.payload);
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
                    ? state.elements // Ne rien ajouter si l'objet existe déjà
                    : [...state.elements, action.payload], // Ajouter l'objet s'il est unique
            };
        case 'ACTIVATE_ELEMENT':
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.id
                        ? { ...el, isActive: !el.isActive }
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
            // console.log(action.payload);
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.payload.element.id
                        ? { ...el, animate: action.payload.property }
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
                elements: [...action.payload],
            };

        default:
            throw Error('Action non reconnue: ' + action.type);
    }
}
