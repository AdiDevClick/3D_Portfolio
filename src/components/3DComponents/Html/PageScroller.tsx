import { Scroll } from '@react-three/drei';
import '@css/PageScroller.scss';

/**
 * PageScroller component - !! IMPORTANT !!
 *
 * @description This component is used to create a scrollable area in the 3D scene.
 * @returns PageScroller component
 */
export function PageScoller() {
    return (
        <Scroll html>
            <div id="scroll-container" className="scroll-container"></div>
        </Scroll>
    );
}
