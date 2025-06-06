import { ScrollResetProps } from '@/components/3DComponents/Scrolling/scrollTypes';
import { useScroll } from '@react-three/drei';
import { useEffect } from 'react';

/**
 * Reset scroll position
 *
 * @description Triggers a scroll reset whenever the `visible` prop changes.
 *
 * @param visible - Actual page route
 */
export function ScrollReset({ visible }: ScrollResetProps) {
    const scroll = useScroll();

    /**
     * Type error inevitable
     * @description : This is a workaround to reset the scroll position
     */
    useEffect(() => {
        scroll.scroll.current = 0;
    }, [visible]);

    return null;
}
