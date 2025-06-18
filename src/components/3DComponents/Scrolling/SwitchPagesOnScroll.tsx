import { ScrollResetProps } from '@/components/3DComponents/Scrolling/scrollTypes';
import { wait } from '@/functions/promises';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * This component listens for scroll events and switches pages based on the scroll position.
 *
 * @param visible - The currently visible section of the application
 */
export function SwitchPagesOnScroll({ visible }: ScrollResetProps) {
    const [isScrollCompleted, setIsScrollCompleted] = useState<{
        position?: string;
        complete?: boolean;
    }>({});
    const [isWheeling, setIsWheeling] = useState<{
        direction?: string;
        moving?: boolean;
    }>({});
    const scroll = useScroll();
    const navigate = useNavigate();

    const frameCountRef = useRef(0);

    /**
     * Handles the scroll completion state and navigates to the appropriate page
     * based on the current visible section and scroll position.
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

            setIsScrollCompleted(() => ({
                position: undefined,
                complete: false,
            }));
        }
    }, [visible, isScrollCompleted]);

    /**
     * Handles the wheel event to detect scroll direction
     */
    useEffect(() => {
        const handleWheel = async (e: WheelEvent) => {
            e.stopPropagation();
            const { scrollTop, scrollHeight, clientHeight } =
                e.currentTarget as HTMLElement;

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

            setIsWheeling((prev) => ({
                ...prev,
                direction: direction,
                moving: true,
            }));

            if (direction !== 'none') {
                await wait(100);

                setIsWheeling(() => ({
                    direction: undefined,
                    moving: false,
                }));
                setIsScrollCompleted(() => ({
                    position: undefined,
                    complete: false,
                }));
            }
        };

        const scrollElement = scroll.el;
        if (scrollElement) {
            scrollElement.addEventListener('wheel', handleWheel, {
                passive: true,
            });
            return () => {
                scrollElement.removeEventListener('wheel', handleWheel);
            };
        }
    }, [scroll.el]);

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
            if (
                (scroll.offset > 0.99 || scroll.pages === 0) &&
                isWheeling.moving &&
                isWheeling.direction === 'down'
            ) {
                setIsScrollCompleted((prev) => ({
                    ...prev,
                    position: 'bottom',
                    complete: true,
                }));
            }
            if (
                (scroll.offset < 0.01 || scroll.pages === 0) &&
                isWheeling.moving &&
                isWheeling.direction === 'up'
            ) {
                setIsScrollCompleted((prev) => ({
                    ...prev,
                    position: 'top',
                    complete: true,
                }));
            }
        }
    });

    return null;
}
