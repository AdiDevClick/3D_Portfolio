import { TouchEventProps } from '@/hooks/Touch/useTouchEventsTypes.ts';
import {
    MouseEvent,
    RefObject,
    TouchEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

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
    transitionElement: RefObject<HTMLElement>
) {
    const [isClick, setClicked] = useState(false);
    const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [lastTranslate, setLastTranslate] = useState(null);
    const [elementSize, setElementSize] = useState(null);
    const activeElementRef = useRef<HTMLElement>(null!);
    const abortControllerRef = useRef<AbortController | null>(null);

    const props = {
        transitionElement,
        setClicked,
        isClick,
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
    };

    useEffect(
        // const initEvents = useCallback(
        () => {
            // (node) => {
            const element = node.current;
            if (!element) return;
            console.log('je crer mon hook');
            abortControllerRef.current = new AbortController();

            events.forEach((event) => {
                element.addEventListener(
                    event.name as keyof HTMLElementEventMap,
                    (e) => event.eventHandler(e, element, props),
                    {
                        ...event.options,
                        signal: abortControllerRef.current?.signal,
                    }
                );
            });
            return () => {
                console.log('je remove');
                abortControllerRef.current?.abort();
            };
        },
        [props]
        // [origin, lastTranslate]
    );
    // return {};
}

/**
 * Disable default drag behavior to
 * avoid conflicts -
 */
function handleDragStart(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
}

/**
 * Début du clic
 */
function startDrag(
    e: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>,
    _element: HTMLElement,
    { ...props }: TouchEventProps
) {
    if (props.isMoving) return;
    if (e.targetTouches) {
        console.log('startDrag');
        if (e.targetTouches.length > 1) e.preventDefault();

        e = e.targetTouches[0];
        const target = e.target as HTMLElement;

        handleActiveElement(
            target,
            props.activeElementRef.current,
            props.setClicked
        );

        if (
            props.transitionElement.current.classList.contains('closed') &&
            !props.isMoving
        ) {
            // props.transitionElement.current.style.maxWidth = 'none';
            // props.transitionElement.current.style.width = '50px';
            console.log('je suis closed');
            // props.transitionElement.current.classList.remove('closed');
            // props.transitionElement.current.classList.add('opened');
        }
    }

    props.setOrigin({ x: e.screenX, y: e.screenY });
    disableTransition(props.transitionElement.current);
    props.setElementSize({
        width: props.transitionElement.current.offsetWidth,
        height: props.transitionElement.current.offsetHeight,
    });
    // disableTransition(props.transitionElement.current);
    // props.setOrigin({ x: e.screenX, y: e.screenY });
    // const pressionPoint = e.targetTouches[0];
    // props.setTranslate({
    //     x: pressionPoint.screenX - props.origin.x,
    //     y: pressionPoint.screenY - props.origin.y,
    // });
}

function handleActiveElement(
    target: HTMLElement,
    activeElement: HTMLElement,
    setClicked: (value: boolean) => void
) {
    if (activeElement) {
        // If we touch another item
        if (target !== activeElement) {
            activeElement.classList.remove('hover');
        } else {
            // If we touch the same item, it's a click
            setClicked(true);
        }
    }

    target.classList.add('hover');
    activeElement = target;
}

function drag(e, element: HTMLElement, { ...props }: TouchEventProps) {
    if (!props.origin) return;

    const pressionPoint = e.targetTouches ? e.targetTouches[0] : e;

    const translate = {
        x: pressionPoint.screenX - props.origin.x,
        y: pressionPoint.screenY - props.origin.y,
    };

    if (e.targetTouches && Math.abs(translate.x) > Math.abs(translate.y)) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        props.setClicked(false);
    }

    const offsets = props.transitionElement.current.getBoundingClientRect();
    // offsets.x = translate.x;

    console.log(props.elementSize);
    console.log(translate.x, offsets);
    // let positiveWidth = false;
    // let translateX;
    // translate.x > 0 ? (positiveWidth = true) : false;
    console.log('mon offset Left', offsets.left);
    console.log('mon translate X', translate.x);
    if (translate.x > 0 && offsets.left >= 0) {
        console.log('je ne peux pas bouger');
        return;
    }
    if (translate.x < 0 && offsets.left < 0) {
        console.log(props.elementSize.width);
        // return;
    }
    // props.transitionElement.current.classList.remove('closed');

    props.setLastTranslate(translate);

    // modifyWidth(
    //     props.transitionElement.current,
    //     props.elementWidth + translate.x
    // );
    translateElement(
        props.transitionElement.current,
        0,
        (100 * translate.x) / props.elementSize.width
    );
    // translateWidth(props.transitionElement.current, baseWidth + translate.x);
    // props.transitionElement.current.style.width = `${translateX}px`;
    // props.transitionElement.current.style.width = `${
    //     props.transitionElement.current.clientWidth + translate.x
    // }px`;
    // props.setTranslate(translateX);
    // props.transitionElement.current.offsetHeight;
    props.setIsMoving(true);
}

function endDrag(
    e: TouchEvent<HTMLButtonElement>,
    _element: HTMLElement,
    { ...props }: any
) {
    if (!props.isClick) e.preventDefault();
    console.log(props.lastTranslate);
    enableTransition(props.transitionElement.current);

    if (
        props.isMoving &&
        Math.abs(props.lastTranslate.x / props.elementSize.width) > 0.2
    ) {
        let options = {};

        if (props.transitionElement.current.classList.contains('closed')) {
            props.transitionElement.current.style.left = '0';
            props.transitionElement.current.classList.remove('closed');
            options.animation = 'slideToRight 0.5s forwards';
            options.class = 'opened';
        } else {
            options.animation = 'slideToLeft 0.5s forwards';
            options.class = 'closed';
        }

        props.transitionElement.current.style.animation = options.animation;
        props.transitionElement.current.addEventListener(
            'animationend',
            () => {
                props.transitionElement.current.classList.add(options.class);
                props.transitionElement.current.removeAttribute('style');
            },
            { once: true }
        );
        // props.transitionElement.current.classList.toggle('active');
    } else {
        translateElement(
            props.transitionElement.current,
            0,
            props.lastTranslate.x / props.elementSize.width
        );
    }
    // if (
    //     props.isMoving &&
    //     Math.abs(props.lastTranslate.x / props.elementWidth) > 0.1
    // ) {
    //     enableTransition(props.transitionElement.current);
    //     props.transitionElement.current.classList.remove('active');
    // }
    props.setOrigin(null);
    props.setLastTranslate(null);
    props.setIsMoving(false);
    props.setClicked(false);
}

/**
 * Disables the transition of an element -
 */
function disableTransition(element: HTMLElement) {
    if (!element) return;
    element.style.transition = 'none';
}

/**
 * Modifies the width of an element -
 * @param element The element to modify -
 * @param width The new width -
 */
function modifyWidth(element: HTMLElement, width: number) {
    element.style.width = `${width}px`;
}

/**
 * Delete the style Attribute of an element
 * to enable the transition -
 * @param element The element to modify -
 */
function enableTransition(element: HTMLElement) {
    if (!element) return;
    // element.removeAttribute('style');
    element.style.transition = '';
    element.style.animation = null;
    // element.addEventListener(
    //     'animationend',
    //     () => {
    //         element.removeAttribute('style');
    //     },
    //     { once: true }
    // );
    // element.addEventListener(
    //     'transitionend',
    //     () => {
    //         element.removeAttribute('style');
    //     },
    //     { once: true }
    // );
}

function translateElement(
    element: HTMLElement,
    percentY = 0,
    percentX = 0,
    width = null
) {
    // let element;
    // if (this.#clickedElement === 'card') element = this.#card;
    // if (this.#clickedElement === 'steps') element = this.#steps;
    console.log(percentX);
    element.style.transform =
        'translate3d(' + percentX + '%,' + percentY + '%, 0)';
    if (width) {
        element.style.width = width;
    }
}
