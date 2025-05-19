import { SpherePresenceTypes } from '@/components/3DComponents/SpherePresence/SpherePresenceTypes';

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
