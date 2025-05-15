import { Object3D, Mesh, MeshStandardMaterial } from 'three';
import { JSX, useMemo } from 'react';
import {
    emissiveIntensity,
    hoveredIconColor,
} from '@/configs/3DCarousel.config';

/**
 * Creates a 3D icon mesh component
 *
 * @param iconColor - Color of the icon
 * @param data - Mesh data to be used
 */
export function IconMesh({
    data,
    hovered,
    curveSegments,
    iconColor,
    ...props
}: {
    data: Object3D;
    hovered?: boolean;
    curveSegments?: number;
    iconColor?: string;
} & JSX.IntrinsicElements['mesh']) {
    /**
     * Retrieves the original color of the material.
     *
     * @returns The provided icon color or the original color of the material
     * if not specified.
     */
    const originalColor = useMemo(() => {
        try {
            const { material } = data as Mesh;
            if (iconColor) return iconColor;
            if (material && material instanceof MeshStandardMaterial) {
                return `#${material.color.getHexString()}`;
            }
        } catch (e) {
            console.warn('Error extracting material color:', e);
            return iconColor || '#ffffff';
        }
    }, [data, iconColor]);

    return (
        <mesh {...data} {...props}>
            <meshStandardMaterial
                color={hovered ? hoveredIconColor : originalColor}
                emissive={hovered ? hoveredIconColor : '#000000'}
                emissiveIntensity={hovered ? emissiveIntensity : 0}
                roughness={hovered ? 0.5 : 0.8}
                metalness={hovered ? 0.5 : 0.2}
            />
        </mesh>
    );
}
