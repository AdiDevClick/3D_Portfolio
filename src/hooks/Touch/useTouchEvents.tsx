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

    useEffect(() => {
        const element = node.current;
        if (!element) return;
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
            abortControllerRef.current?.abort();
        };
    }, [origin, props]);
    return { isMoving };
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
            props.setClicked(true)
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
    console.log('last translate', props.lastTranslate);
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

    // console.log(props.elementSize);
    // console.log(translate.x, offsets);
    // let positiveWidth = false;
    // let translateX;

    // translate.x > 0 ? (positiveWidth = true) : false;
    console.log('mon offset Left', offsets.left);
    console.log('mon translate X', translate.x);
    props.transitionElement.current.classList.add('opening');

    // if (translate.x >= 0 && offsets.left >= 0) {
    //     console.log(
    //         offsets,
    //         'offset left > 0',
    //         'last translate',
    //         props.lastTranslate
    //     );
    //     // if (element.classList.contains('opening')) {
    //     //     e.preventDefault();
    //     //     return;
    //     // }
    //     // e.preventDefault();
    //     // element.classList.remove('closed');
    //     // element.classList.add('opened');
    //     props.transitionElement.current.style.transform = 'none';
    //     return;
    // }
    props.setLastTranslate(translate);

    if (translate.x >= 0) {
        if (offsets.left >= 0 || translate.x >= props.elementSize.width) {
            // console.log('translate x > 0', translate.x, offsets.left);
            // props.transitionElement.current.classList.add('stopped');

            // props.transitionElement.current.style.transform =
            //     '';
            // props.transitionElement.current.style.animation = null;
            // props.transitionElement.current.style.animation =
            //     'slideToRight 0.5s forwards';
            console.log('(je return)');

            return;
        }
    }
    // props.transitionElement.current.classList.remove('closed');
    if (props.transitionElement.current.classList.contains('active')) {
        props.transitionElement.current.classList.remove('active');
    }

    // modifyWidth(
    //     props.transitionElement.current,
    //     props.elementWidth + translate.x
    // );

    translateElement(
        props.transitionElement.current,
        0,
        (100 * translate.x) / props.elementSize.width,
        translate.x
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
    if (!props.isMoving) return;
    const element = props.transitionElement.current;
    enableTransition(element);

    if (
        props.isMoving &&
        Math.abs(props.lastTranslate.x / props.elementSize.width) > 0.2
    ) {
        const options = {};

        if (element.classList.contains('closed')) {
            element.style.left = '0';
            element.classList.remove('closed');
            options.animation = 'slideToRight 0.5s forwards';
            options.class = 'opened';
        } else {
            options.animation = 'slideToLeft 0.5s forwards';
            options.class = 'closed';
        }

        element.style.animation = options.animation;
        element.addEventListener(
            'animationend',
            () => {
                element.classList.add(options.class);
                if (element.classList.contains('opening')) {
                    element.classList.remove('opening');
                }
                element.removeAttribute('style');
            },
            { once: true }
        );
    } else {
        translateElement(
            element,
            0,
            props.lastTranslate.x / props.elementSize.width
        );
    }
    // if (
    //     props.isMoving &&
    //     Math.abs(props.lastTranslate.x / props.elementWidth) > 0.1
    // ) {
    //     enableTransition(element);
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
    position = null
) {
    if (!element) return;
    // if (this.#clickedElement === 'card') element = this.#card;
    // if (this.#clickedElement === 'steps') element = this.#steps;
    console.log('je transofrm', percentX);
    if (percentX > 0 && percentX < 0.2) percentX = 0;

    element.style.transform =
        'translate3d(' + percentX + '%,' + percentY + '%, 0)';
}
