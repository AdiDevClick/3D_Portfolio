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

/**
 * Hook to handle touch events -
 *
 * @param node - The button element -
 * @param transitionElement - The element to translate -
 * @param setIsOpen Function to set the open/close state from the Component -
 * @returns
 */
export function useTouchEvents(
    node: RefObject<HTMLButtonElement>,
    isMobile: boolean,
    transitionElement: RefObject<HTMLElement>,
    setIsOpen: (isOpen: boolean) => void
) {
    const [isClickInProgress, setIsClickInProgress] = useState(false);
    const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [lastTranslate, setLastTranslate] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [elementSize, setElementSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const activeElementRef = useRef<HTMLElement>(null!);
    const abortControllerRef = useRef<AbortController | null>(null);

    const props = {
        isMobile,
        transitionElement,
        isClickInProgress,
        setIsClickInProgress,
        setOrigin,
        origin,
        setIsMoving,
        isMoving,
        lastTranslate,
        setLastTranslate: (value: { x: number; y: number } | null) =>
            setLastTranslate(value),
        elementSize,
        setElementSize,
        activeElementRef,
        abortControllerRef,
        setIsOpen,
    };

    /**
     * Events Creation -
     * @description Create the events for the button -
     */
    useEffect(() => {
        const element = node.current;
        if (!element) return;
        abortControllerRef.current = new AbortController();

        events.forEach((event) => {
            element.addEventListener(
                event.name as keyof HTMLElementEventMap,
                (e) =>
                    event.eventHandler(
                        e as Event & MouseEvent & TouchEvent,
                        element,
                        props
                    ),
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
function handleDragStart(e: Event) {
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
    e: Event & MouseEvent & TouchEvent,
    _element: HTMLElement,
    { ...props }: TouchEventProps
) {
    if (props.isMoving) return;
    const element = props.transitionElement.current;

    let eventPoint;
    if ('targetTouches' in e) {
        if (e.targetTouches.length > 1 && e.cancelable) e.preventDefault();
        eventPoint = e.targetTouches[0];
    } else {
        eventPoint = e;
    }

    if (eventPoint) {
        props.setOrigin({ x: eventPoint.screenX, y: eventPoint.screenY });
    }

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
function drag(
    e: Event & MouseEvent & TouchEvent,
    _element: HTMLElement,
    { ...props }: TouchEventProps
) {
    if (!props.origin || !props.elementSize) return;
    const element = props.transitionElement.current;

    const pressionPoint = 'targetTouches' in e ? e.targetTouches[0] : e;
    if (!pressionPoint) return;

    const translate = {
        x: pressionPoint.screenX - props.origin.x,
        y: pressionPoint.screenY - props.origin.y,
    };

    // if ('targetTouches' in e && Math.abs(translate.x) > Math.abs(translate.y)) {
    //     if (e.cancelable) e.preventDefault();
    //     e.stopPropagation();
    // }
    if (
        'targetTouches' in e &&
        Math.abs(translate.x) > Math.abs(translate.y) &&
        !props.isMobile
    ) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
    } else if (
        'targetTouches' in e &&
        Math.abs(translate.y) > Math.abs(translate.x) &&
        props.isMobile
    ) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
    }

    const offsets = element.getBoundingClientRect();

    element.classList.add('opening');
    props.setLastTranslate(translate);

    let percentX = 0;
    let percentY = 0;
    const isClosed = element.classList.contains('closed');

    const options = {
        elementSize: props.isMobile
            ? props.elementSize.height
            : props.elementSize.width,
        buttonSize: props.isMobile
            ? _element.offsetHeight
            : _element.offsetWidth,
        isClosed,
        translate: props.isMobile ? translate.y : translate.x,
        lastTranslate: false,
        isMobile: props.isMobile,
    };

    if (props.isMobile) {
        if (
            translate.y <= 0 &&
            (translate.y <=
                -(props.elementSize.height - _element.offsetHeight) ||
                !isClosed)
        ) {
            return;
        }

        percentY = calculateTranslate(options);
    } else {
        if (
            (translate.x >= 0 && offsets.left >= 0) ||
            translate.x >= props.elementSize.width
        ) {
            return;
        }

        percentX = calculateTranslate(options);
    }
    translateElement(element, percentY, percentX);
    props.setIsMoving(true);
}

/**
 * Calculates the translate value -
 * @description Return the translate value in percentage -
 * If mobile, calculate the Y axis -
 * If not, calculate the X axis -
 *
 * @param elementSize The size of the element to translate -
 * @param buttonSize The size of the button -
 * @param isClosed If the element is closed -
 * @param translate The translate value, be it x or y -
 * @param lastTranslate If the last translate value is used -
 * @param isMobile If the device is mobile -
 * @returns
 */
function calculateTranslate({
    elementSize,
    buttonSize,
    isClosed,
    translate,
    lastTranslate = false,
    isMobile = false,
}: {
    elementSize: number;
    buttonSize: number;
    isClosed: boolean;
    translate: number;
    /** @DefaultValue false */
    lastTranslate?: boolean;
    /** @DefaultValue false */
    isMobile?: boolean;
}) {
    const maxDistance = elementSize - buttonSize;
    const buttonSizeInPercent = (100 * maxDistance) / elementSize;
    const normalized = lastTranslate ? 1 : 100;

    if (isMobile) {
        return (
            (normalized * translate) / elementSize +
            (isClosed ? buttonSizeInPercent : 0)
        );
    } else {
        return (
            (normalized * translate) / elementSize -
            (isClosed ? buttonSizeInPercent : 0)
        );
    }
}

/**
 * End of the drag -
 *
 * @param e  Event -
 * @param _element - Not used -
 * @param param2 - All the props -
 */
function endDrag(
    _: Event & MouseEvent & TouchEvent,
    _element: HTMLElement,
    { ...props }: TouchEventProps
) {
    if (!props.isMoving) {
        props.setIsClickInProgress(true);
        return props.setOrigin(null);
    }

    if (props.elementSize && props.lastTranslate && props.origin) {
        const element = props.transitionElement.current;
        enableTransition(element);
        const isClosed = element.classList.contains('closed');

        if (
            (!props.isMobile &&
                Math.abs(props.lastTranslate.x / props.elementSize.width) >
                    0.2) ||
            (props.isMobile &&
                Math.abs(props.lastTranslate.y / props.elementSize.height) >
                    0.2)
        ) {
            if (isClosed) {
                props.setIsOpen(true);
            } else {
                props.setIsOpen(false);
            }
        } else {
            let percentX = 0;
            let percentY = 0;

            const options = {
                elementSize: props.isMobile
                    ? props.elementSize.height
                    : props.elementSize.width,
                buttonSize: props.isMobile
                    ? _element.offsetHeight
                    : _element.offsetWidth,
                isClosed,
                translate: props.isMobile
                    ? props.lastTranslate.y
                    : props.lastTranslate.x,
                lastTranslate: true,
                isMobile: props.isMobile,
            };

            if (props.isMobile) {
                percentY = calculateTranslate(options);
            } else {
                percentX = calculateTranslate(options);
            }

            translateElement(element, percentY, percentX);
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
    element.style.transform = `translate3d(${percentX}%,${percentY}%, 0)`;
}
