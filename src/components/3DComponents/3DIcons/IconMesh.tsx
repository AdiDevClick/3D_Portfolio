import { Object3D } from 'three';
import { JSX } from 'react';

/**
 * Creates a 3D icon mesh component
 *
 * @param iconColor - Color of the icon
 * @param data - Mesh data to be used
 */
export function IconMesh({
    data,
    iconColor,
    hovered,
    curveSegments,
    ...props
}: {
    data: Object3D;
    iconColor: string;
    hovered?: boolean;
    curveSegments?: number;
} & JSX.IntrinsicElements['mesh']) {
    return (
        <mesh {...data} {...props}>
            <meshStandardMaterial
                // color={hovered ? '#4285F4' : iconColor}
                emissive={hovered ? '#4285F4' : '#000000'}
                emissiveIntensity={hovered ? 0.3 : 0}
            />
        </mesh>
    );
}
