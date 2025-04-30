type SpherePresenceTypes = {
    position: [number, number, number];
    radius: [number, number];
    color: string;
    /** @defaultValue true */
    visible?: boolean;
};

/**
 * Wireframe sphere presence Helper -
 */
export function SpherePresenceHelper({
    position,
    radius,
    color,
    visible = false,
    ...props
}: SpherePresenceTypes) {
    return (
        <mesh position={position} visible={visible} {...props}>
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
