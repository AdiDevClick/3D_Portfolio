import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle.tsx';
import { RefObject } from 'react';
import { Group } from 'three';

/**
 * Main title of the home page.
 *
 * @param ref - Ref of the group
 * @param scale - Scale of the title from the reducer generalScaleX
 */
export function HomePageTitle({
    ref,
    scale,
}: {
    ref: RefObject<Group>;
    scale: number;
}) {
    return (
        <group ref={ref}>
            <FloatingTitle
                scale={scale}
                size={80}
                position-y={1}
                textProps={{
                    height: 40,
                }}
            >
                Bienvenue
            </FloatingTitle>
            <FloatingTitle
                scale={scale}
                size={60}
                position-y={0}
                back
                textProps={{
                    height: 40,
                }}
            >
                sur mon
            </FloatingTitle>
            <FloatingTitle
                scale={scale}
                size={80}
                position-y={-1}
                back
                textProps={{
                    height: 40,
                }}
            >
                Portfolio !
            </FloatingTitle>
        </group>
    );
}
