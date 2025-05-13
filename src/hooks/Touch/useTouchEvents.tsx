import { TouchEventProps } from '@/hooks/Touch/useTouchEventsTypes.ts';
import {
    MouseEvent,
    RefObject,
    TouchEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

/**
 * Events list with their handlers -
 */
const events = [
    { name: 'dragstart', eventHandler: handleDragStart },
    { name: 'touchcancel', eventHandler: endDrag },
    { name: 'mousedown', eventHandler: startDrag, options: { passive: false } },
    { name: 'touchstart', eventHandler: startDrag },
    { name: 'mousemove', eventHandler: drag },
    { name: 'touchmove', eventHandler: drag, options: { passive: false } },
    { name: 'mouseup', eventHandler: endDrag },
    { name: 'touchend', eventHandler: endDrag },
];

export function useTouchEvents(
    node: RefObject<HTMLButtonElement>,
    transitionElement: RefObject<HTMLElement>,
    setIsOpen: (isOpen: boolean) => void
) {
    const [isClickInProgress, setIsClickInProgress] = useState(false);
    const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [lastTranslate, setLastTranslate] = useState(null);
    const [elementSize, setElementSize] = useState(null);

    const activeElementRef = useRef<HTMLElement>(null!);
    const abortControllerRef = useRef<AbortController | null>(null);

    const props = {
        transitionElement,
        isClickInProgress,
        setIsClickInProgress,
        setOrigin,
        origin,
        setIsMoving,
        isMoving,
        lastTranslate,
        setLastTranslate,
        elementSize,
        setElementSize,
        activeElementRef,
        abortControllerRef,
        setIsOpen,
    };

    useEffect(() => {
        const element = node.current;
        if (!element) return;
        abortControllerRef.current = new AbortController();

        events.forEach((event) => {
            element.addEventListener(
                event.name as keyof HTMLElementEventMap,
                (e: MouseEvent | TouchEventProps | Event) =>
                    event.eventHandler(e, element, props),
                {
                    ...event.options,
                    signal: abortControllerRef.current?.signal,
                }
            );
        });
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [
        origin,
        lastTranslate,
        elementSize,
        isMoving,
        node,
        transitionElement,
        setIsOpen,
    ]);

    return { isMoving, isClickInProgress, setIsClickInProgress };
}

/**
 * Disable default drag behavior to
 * avoid conflicts -
 */
function handleDragStart(e) {
    e.preventDefault();
}

/**
 * Début du clic -
 *
 * @param e Event -
 * @param _element  - Not used -
 * @param param2 - All the props -
 */
function startDrag(
    e: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>,
    _element: HTMLElement,
    { ...props }: TouchEventProps
) {
    if (props.isMoving) return;
    console.log('Je vais comencer à bouger :', e.type);
    // props.setIsClickInProgress(true);
    const element = props.transitionElement.current;
    if (e.targetTouches) {
        if (e.targetTouches.length > 1) e.preventDefault();
        e = e.targetTouches[0];

        // const target = e.target as HTMLElement;

        // handleActiveElement(
        //     target,
        //     _element,
        //     props.setIsClickInProgress
        //     // props.setClicked(true)
        // );
    }

    props.setOrigin({ x: e.screenX, y: e.screenY });

    disableTransition(element);

    props.setElementSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
    });
}

function handleActiveElement(
    target: HTMLElement,
    activeElement: HTMLElement
    // setIsClickInProgress: (value: boolean) => void
) {
    if (activeElement) {
        // If we touch another item
        if (target !== activeElement) {
            activeElement.classList.remove('hover');
            // }
        } else {
            // If we touch the same item, it's a click
            console.log('je click');
            // setIsClickInProgress(true);
        }
    }
}

/**
 * Dragging -
 *
 * @param e Event -
 * @param _element  - Not used -
 * @param param2 - All the props -
 */
function drag(e, _element: HTMLElement, { ...props }: TouchEventProps) {
    if (!props.origin) return;
    console.log('Je drag');
    const element = props.transitionElement.current;

    const pressionPoint = e.targetTouches ? e.targetTouches[0] : e;

    const translate = {
        x: pressionPoint.screenX - props.origin.x,
        y: pressionPoint.screenY - props.origin.y,
    };
    // if (!props.isMoving) {
    //     if (Math.abs(translate.x) < 5) {
    //         return;
    //     }
    //     // disableTransition(props.transitionElement.current);
    //     // props.setIsMoving(true);
    //     props.setClicked(false);
    // }
    if (e.targetTouches && Math.abs(translate.x) > Math.abs(translate.y)) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        // props.setClicked(false);
        // props.setIsMoving(false);
    }

    const offsets = element.getBoundingClientRect();

    element.classList.add('opening');

    const buttonWidthInPercent =
        (100 * (props.elementSize.width - _element.offsetWidth)) /
        props.elementSize.width;

    const removedButtonWidth = element.classList.contains('closed')
        ? buttonWidthInPercent
        : 0;

    props.setLastTranslate(translate);

    if (translate.x >= 0) {
        if (offsets.left >= 0 || translate.x >= props.elementSize.width) {
            return;
        }
    }

    translateElement(
        element,
        0,
        (100 * translate.x) / props.elementSize.width - removedButtonWidth
    );
    props.setIsMoving(true);
}

/**
 * End of the drag -
 *
 * @param e  Event -
 * @param _element - Not used -
 * @param param2 - All the props -
 */
function endDrag(
    e: TouchEvent<HTMLButtonElement>,
    _element: HTMLElement,
    { ...props }: any
) {
    if (!props.isMoving) {
        props.setIsClickInProgress(true);
        return props.setOrigin(null);
    }

    if (props.lastTranslate && props.origin) {
        const element = props.transitionElement.current;
        enableTransition(element);

        if (Math.abs(props.lastTranslate.x / props.elementSize.width) > 0.2) {
            console.log('Je bouge au delà de 20%');
            if (element.classList.contains('closed')) {
                props.setIsOpen(true);
            } else {
                props.setIsOpen(false);
            }
        } else {
            const buttonWidthInPercent =
                (100 * (props.elementSize.width - _element.offsetWidth)) /
                props.elementSize.width;

            const removedButtonWidth = element.classList.contains('closed')
                ? buttonWidthInPercent
                : 0;

            console.log('else ?');
            translateElement(
                element,
                0,
                props.lastTranslate.x / props.elementSize.width -
                    removedButtonWidth
            );
        }

        element.addEventListener(
            'transitionend',
            () => {
                element.classList.remove('opening');
                element.removeAttribute('style');
                props.setIsMoving(false);
            },
            { once: true }
        );
    }

    props.setOrigin(null);
    props.setLastTranslate(null);
    // props.setIsClickInProgress(false);
    // props.setIsMoving(false);
    // // props.setClicked(false);
}

/**
 * Disables the transition of an element -
 *
 * @param element The element -
 */
function disableTransition(element: HTMLElement) {
    if (!element) return;
    element.style.transition = 'none';
}

/**
 * Modifies the width of an element -
 *
 * @param element The element to modify -
 * @param width The new width -
 */
function modifyWidth(element: HTMLElement, width: number) {
    element.style.width = `${width}px`;
}

/**
 * Delete the style Attribute of an element
 * to enable the transition -
 *
 * @param element The element to modify -
 */
function enableTransition(element: HTMLElement) {
    if (!element) return;
    element.style.transition = '';
}

/**
 * Translate an element using percentages -
 *
 * @param element Element HTML to translate
 * @param percentY Pourcentage number for Y axis
 * @param percentX Pourcentage number for X axis
 * @returns
 */
function translateElement(element: HTMLElement, percentY = 0, percentX = 0) {
    if (!element) return;
    if (percentX > 0 && percentX < 0.2) percentX = 0;

    element.style.transform =
        'translate3d(' + percentX + '%,' + percentY + '%, 0)';
}
