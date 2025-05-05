import { JSX } from 'react';

type SpherePresenceTypes = {
    // position: [number, number, number];
    radius: [number, number];
    color: string;
    /** @defaultValue true */
    visible?: boolean;
} & JSX.IntrinsicElements['mesh'];

/**
 * Wireframe sphere presence Helper -
 */
export function SpherePresenceHelper({
    radius,
    color,
    visible = false,
    ...props
}: SpherePresenceTypes) {
    return (
        <mesh visible={visible} {...props}>
            <sphereGeometry args={radius} />
            <meshStandardMaterial
                color={color}
                wireframe
                transparent
                opacity={0.5}
            />
        </mesh>
    );
}
