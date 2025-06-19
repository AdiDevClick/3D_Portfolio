import {
    ActivatePageSwitcherProps,
    HandleMoveProps,
    HandleTouchStartProps,
    ScrollCompleteState,
    ScrollResetProps,
    SetCompleteScrollStatusProps,
    WheelingState,
} from '@/components/3DComponents/Scrolling/scrollTypes';
import { wait } from '@/functions/promises';
import useDebounce from '@/hooks/useDebounce';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

let startY = 0;

/**
 * This component listens for scroll events and switches pages based on the scroll position.
 *
 * @param visible - The currently visible section of the application
 */
export function SwitchPagesOnScroll({ visible }: ScrollResetProps) {
    const [isScrollCompleted, setIsScrollCompleted] =
        useState<ScrollCompleteState>({});
    const [isWheeling, setIsWheeling] = useState<WheelingState>({});
    const scroll = useScroll();
    const navigate = useNavigate();

    const frameCountRef = useRef(0);
    const abortControllerRef = useRef<AbortController>(null!);

    const props = {
        setIsWheeling,
        setIsScrollCompleted,
        scroll,
        visible,
    };

    const debouncedHandleWheel = useDebounce(({ e }) => {
        e.stopPropagation();
        const scrollElement = scroll.el;
        const { scrollTop, scrollHeight, clientHeight } =
            scrollElement as HTMLElement;
        let direction = 'none';

        if (scrollTop + e.deltaY < 0 && e.deltaY < 0) {
            direction = 'up';
        }

        if (
            scrollHeight - (scrollTop + e.deltaY) < clientHeight &&
            e.deltaY > 0
        ) {
            direction = 'down';
        }

        activatePageSwitcher({
            setIsWheeling,
            setIsScrollCompleted,
            direction,
            resetDelay: 50,
        });
    }, 100);

    /**
     * Events list with their handlers and options -
     */
    const events = useMemo(
        () => [
            { name: 'wheel', eventHandler: debouncedHandleWheel },
            { name: 'touchstart', eventHandler: handleTouchStart },
            {
                name: 'touchmove',
                eventHandler: handleTouchMove,
                options: { passive: false },
            },
            // { name: 'touchend', eventHandler: endDrag },
        ],
        []
    );

    /**
     * Handles the scroll completion state and navigates to the appropriate page
     * based on the current visible section and scroll position.
     *
     * This effect will save the current visible section to a ref
     */
    useEffect(() => {
        if (isScrollCompleted.complete) {
            const reachedBottom =
                isScrollCompleted.position === 'bottom' ? true : false;
            const reachedTop =
                isScrollCompleted.position === 'top' ? true : false;

            switch (visible) {
                case 'home':
                    if (reachedBottom) {
                        navigate('/a-propos');
                    } else if (reachedTop) {
                        navigate('/contact');
                    }
                    break;
                case 'about':
                    if (reachedBottom) {
                        navigate('/projets');
                    } else if (reachedTop) {
                        navigate('/');
                    }
                    break;
                case 'carousel':
                    if (reachedBottom) {
                        navigate('/contact');
                    } else if (reachedTop) {
                        navigate('/a-propos');
                    }
                    break;
                case 'contact':
                    if (reachedBottom) {
                        navigate('/');
                    } else if (reachedTop) {
                        navigate('/projets');
                    }
                    break;
                default:
                    break;
            }

            // visibleRef.current = visible;
            setIsScrollCompleted(() => ({
                position: undefined,
                complete: false,
            }));
        }
    }, [visible, isScrollCompleted]);

    /**
     * Creates the different event listeners for the scroll element
     *
     * @description This will create an abort controller to manage the event listeners
     * and clean them up on unmount.
     */
    useEffect(() => {
        abortControllerRef.current = new AbortController();
        const scrollElement = scroll.el;

        if (scrollElement) {
            events.forEach((event) => {
                scrollElement.addEventListener(
                    event.name as keyof HTMLElementEventMap,
                    (e) =>
                        event.eventHandler({
                            e,
                            ...props,
                        } as HandleMoveProps),
                    {
                        ...event.options,
                        signal: abortControllerRef.current?.signal,
                    }
                );
            });
            return () => {
                abortControllerRef.current?.abort();
            };
        }
    }, [visible]);

    /**
     * Checks whether the scroll position is at the top or bottom of the page
     * @description Uses the useScroll hook to monitor the scroll position
     * and updates the isScrollCompleted state accordingly.
     *
     * Modify the frame count modulo to adjust the smoothness of the scroll detection.
     */
    useFrame(() => {
        frameCountRef.current += 1;
        if (frameCountRef.current % 10 === 0 && !isScrollCompleted.complete) {
            setCompleteScrollStatus({
                isWheeling,
                condition: scroll.offset > 0.99,
                scroll,
                direction: 'down',
                setIsScrollCompleted,
                position: 'bottom',
            });

            setCompleteScrollStatus({
                isWheeling,
                condition: scroll.offset < 0.01,
                scroll,
                direction: 'up',
                setIsScrollCompleted,
                position: 'top',
            });
        }
    });

    return null;
}

/**
 * Activates the page switcher based on the scroll direction.
 * @description This function sets the wheeling state to indicate that scrolling is in progress
 *
 * @param setIsWheeling - Function to set the wheeling state
 * @param setIsScrollCompleted - Function to set the scroll completion state
 * @param direction - The direction of the scroll ('up', 'down', or 'none
 */
async function activatePageSwitcher({
    setIsWheeling,
    setIsScrollCompleted,
    direction,
    resetDelay = 50,
}: ActivatePageSwitcherProps) {
    setIsWheeling((prev) => ({
        ...prev,
        direction: direction,
        moving: true,
    }));

    if (direction !== 'none') {
        await wait(resetDelay);
        setIsWheeling(() => ({
            direction: undefined,
            moving: false,
        }));
        setIsScrollCompleted(() => ({
            position: undefined,
            complete: false,
        }));
    }
}

/**
 * Handles the touch start event to capture the initial touch position
 *
 * @description This will set the global variable startY position
 * to determine the scroll direction later
 *
 * @param e - The touch event object
 */
function handleTouchStart({ e }: HandleTouchStartProps) {
    if (e.targetTouches[0]) {
        e.stopPropagation();

        const eventPoint = e.targetTouches[0];
        startY = eventPoint.clientY;
        // setOrigin({ x: eventPoint.screenX, y: eventPoint.screenY });
    }
}

/**
 * Handles the touch move event to determine the scroll direction
 * @description This will use the setters to update the wheeling state
 * After some time, it will reset the wheeling state and scroll completion state
 *
 * @param visible - The currently visible section of the application
 * @param e - The touch event object
 * @param setIsWheeling - Function to set the wheeling state
 * @param setIsScrollCompleted - Function to set the scroll completion state
 */
function handleTouchMove({
    e,
    visible,
    setIsWheeling,
    setIsScrollCompleted,
}: HandleMoveProps): void {
    if (!e.targetTouches[0] || visible === 'carousel' || visible === 'contact')
        return;

    let direction = 'none';
    const { scrollTop, scrollHeight, clientHeight } =
        e.currentTarget as HTMLElement;

    const currentY = e.targetTouches[0].clientY;
    const isMovingUp = currentY > startY;
    const isMovingDown = currentY < startY;

    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop >= scrollHeight - clientHeight;

    if (isMovingUp && isAtTop) {
        direction = 'up';
    } else if (isMovingDown && isAtBottom) {
        direction = 'down';
    }

    activatePageSwitcher({
        setIsWheeling,
        setIsScrollCompleted,
        direction,
        resetDelay: 50,
    });
}

/**
 * Sets the scroll completion status based on the current scroll state
 *
 * @description This uses the isWheeling state and setter of the scroll state
 *
 * @param isWheeling - The current wheeling state
 * @param condition - The condition to check if the scroll is complete
 * @param scroll - The scroll state from the useScroll hook
 * @param direction - The direction of the scroll ('up' or 'down')
 * @param setIsScrollCompleted - Function to set the scroll completion state
 * @param position - The position of the scroll ('top' or 'bottom')
 */
function setCompleteScrollStatus({
    isWheeling,
    condition,
    scroll,
    direction,
    setIsScrollCompleted,
    position,
}: SetCompleteScrollStatusProps) {
    if (
        (condition || scroll.pages === 0) &&
        isWheeling.moving &&
        isWheeling.direction === direction
    )
        setIsScrollCompleted((prev) => ({
            ...prev,
            position: position,
            complete: true,
        }));
}
