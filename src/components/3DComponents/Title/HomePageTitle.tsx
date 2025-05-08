import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle.tsx';
import { RefObject } from 'react';
import { Group } from 'three';

/**
 * Main title of the home page.
 *
 * @param ref - Ref of the group
 */
export function HomePageTitle({ ref }: { ref: RefObject<Group> }) {
    return (
        <group ref={ref}>
            <FloatingTitle scale={1} size={80} yPosition={1}>
                Bienvenue
            </FloatingTitle>
            <FloatingTitle scale={1} size={60} yPosition={0} back>
                sur mon
            </FloatingTitle>
            <FloatingTitle scale={1} size={80} yPosition={-1} back>
                Portfolio !
            </FloatingTitle>
        </group>
    );
}
