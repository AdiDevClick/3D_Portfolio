import { Material, Mesh, Object3D } from 'three';
import { JSX } from 'react';
import { hoveredIconMateral } from '@/components/3DComponents/3DIcons/IconsMaterials';
import { Geometry } from 'three-stdlib';
import { Object3DNode } from 'three/webgpu';

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
    data: Object3D | Mesh | Geometry | Material | Object3DNode;
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
    // const originalColor = useMemo(() => {
    //     try {
    //         const { material } = data as Mesh;
    //         if (iconColor) return iconColor;
    //         if (material && material instanceof MeshStandardMaterial) {
    //             return `#${material.color.getHexString()}`;
    //         }
    //     } catch (e) {
    //         console.warn('Error extracting material color:', e);
    //         return iconColor || '#ffffff';
    //     }
    // }, [data, iconColor]);

    return (
        <group>
            <mesh
                {...(data as Object3DNode)}
                {...props}
                material={
                    hovered ? hoveredIconMateral : (data as Mesh).material
                }
            />
        </group>
    );
}
