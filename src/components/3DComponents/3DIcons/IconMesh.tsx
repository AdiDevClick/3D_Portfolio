import { Object3D, Mesh, MeshStandardMaterial } from 'three';
import { JSX, useEffect, useMemo } from 'react';
import {
    emissiveIntensity,
    hoveredIconColor,
} from '@/configs/3DCarousel.config.ts';

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
    const clonedDataMemo = useMemo(() => data.clone(), [data]);

    /**
     * Applies material changes to the first Mesh
     */
    useEffect(() => {
        if (clonedDataMemo) {
            applyMaterialChanges(clonedDataMemo, hovered, iconColor);
        }
    }, [clonedDataMemo, hovered, iconColor]);

    return <primitive object={clonedDataMemo} {...props} />;
}

/**
 * Applies material changes to the object and its children
 *
 * @param object - Object to apply changes to
 * @param hovered - Whether the object is hovered or not
 * @param iconColor - Color to apply when not hovered
 */
function applyMaterialChanges(
    object: Object3D,
    hovered: boolean | undefined,
    iconColor: string
) {
    const mesh = object as Mesh;

    if (mesh.material) {
        // // Store original material if not already saved
        if (!mesh.userData.originalMaterial) {
            mesh.userData.originalMaterial = Array.isArray(mesh.material)
                ? mesh.material.map((m) => m.clone())
                : mesh.material.clone();
        }

        const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

        materials.forEach((material) => {
            // Get original color or use provided icon color
            const originalMaterial = mesh.userData.originalMaterial;

            const baseColor = originalMaterial.color
                ? iconColor
                    ? iconColor
                    : originalMaterial.color.getHex()
                : iconColor;

            if (material instanceof MeshStandardMaterial) {
                material.emissive.set(hovered ? hoveredIconColor : '#000000');
                material.emissiveIntensity = hovered ? emissiveIntensity : 0;
                material.color.set(hovered ? hoveredIconColor : baseColor);
            }
        });
    }

    // Appliquer récursivement à tous les enfants
    object.children.forEach((child) =>
        applyMaterialChanges(child, hovered, iconColor)
    );
}
