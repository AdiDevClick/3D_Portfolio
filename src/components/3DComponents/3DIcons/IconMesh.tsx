import { Object3D, Mesh, MeshStandardMaterial } from 'three';
import { JSX, useMemo, useRef } from 'react';
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
    const ref = useRef<Mesh>(null!);

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
    //     if (!ref.current || !ref.current.material) return;

    //     const applyToTexture = (texture) => {
    //         if (!texture) return;

    //         if (textureSettings?.minFilter)
    //             texture.minFilter = textureSettings.minFilter;
    //         if (textureSettings?.magFilter)
    //             texture.magFilter = textureSettings.magFilter;
    //         if (textureSettings?.anisotropy)
    //             texture.anisotropy = textureSettings.anisotropy;

    //         if (
    //             textureResolution &&
    //             texture.image &&
    //             texture.image.width > textureResolution
    //         ) {
    //             console.log(
    //                 `Optimizing texture resolution to ${textureResolution}px`
    //             );
    //             const canvas = document.createElement('canvas');
    //             const ctx = canvas.getContext('2d');

    //             if (ctx) {
    //                 canvas.width = textureResolution;
    //                 canvas.height =
    //                     texture.image.height *
    //                     (textureResolution / texture.image.width);

    //                 // Draw the image with limited size
    //                 ctx.drawImage(
    //                     texture.image,
    //                     0,
    //                     0,
    //                     canvas.width,
    //                     canvas.height
    //                 );

    //                 // Force update with new settings
    //                 texture.image = canvas;
    //                 texture.needsUpdate = true;
    //             }
    //         } else {
    //             // Force update
    //             texture.needsUpdate = true;
    //         }
    //     };

    //     // Parcourir toutes les textures possibles du matériau
    //     const material = ref.current.material;
    //     const textures = [
    //         'map',
    //         'normalMap',
    //         'roughnessMap',
    //         'metalnessMap',
    //         'emissiveMap',
    //         'aoMap',
    //     ];
    //     textures.forEach((mapType) => {
    //         if (material[mapType]) applyToTexture(material[mapType]);
    //     });
    // }, [ref, textureSettings, textureResolution]);

    return (
        <mesh ref={ref} {...data} {...props}>
            <primitive
                object={(data as Mesh).material}
                attach="material"
                color={hovered ? hoveredIconColor : originalColor}
                emissive={hovered ? hoveredIconColor : '#000000'}
                emissiveIntensity={hovered ? emissiveIntensity : 0}
            />
        </mesh>
    );
}

/**
 * Applies material changes to the object and its children
 *
 * @param object - Object to apply changes to
 * @param hovered - Whether the object is hovered or not
 * @param iconColor - Color to apply when not hovered
 */
// function applyMaterialChanges(
//     object: Object3D,
//     hovered: boolean | undefined,
//     iconColor?: string
// ) {
//     const mesh = object as Mesh;

//     if (mesh.material) {
//         // // Store original material if not already saved
//         if (!mesh.userData.originalMaterial) {
//             mesh.userData.originalMaterial = Array.isArray(mesh.material)
//                 ? mesh.material.map((m) => m.clone())
//                 : mesh.material.clone();
//         }

//         const materials = Array.isArray(mesh.material)
//             ? mesh.material
//             : [mesh.material];

//         materials.forEach((material) => {
//             // Get original color or use provided icon color
//             const originalMaterial = mesh.userData.originalMaterial;

//             const baseColor = originalMaterial.color
//                 ? iconColor
//                     ? iconColor
//                     : originalMaterial.color.getHex()
//                 : iconColor;

//             if (material instanceof MeshStandardMaterial) {
//                 material.emissive.set(hovered ? hoveredIconColor : '#000000');
//                 material.emissiveIntensity = hovered ? emissiveIntensity : 0;
//                 material.color.set(hovered ? hoveredIconColor : baseColor);
//             }
//         });
//     }

//     // Apply to all children
//     object.children.forEach((child) =>
//         applyMaterialChanges(child, hovered, iconColor)
//     );
// }

// function optimizeTextures(object, textureSettings, textureResolution) {
//     if (!object) return;

//     const applyToMaterial = (material) => {
//         if (!material) return;

//         // Liste des types de textures à traiter
//         const textureTypes = [
//             'map',
//             'normalMap',
//             'roughnessMap',
//             'metalnessMap',
//             'emissiveMap',
//             'aoMap',
//         ];

//         textureTypes.forEach((type) => {
//             const texture = material[type];
//             if (!texture) return;

//             // Appliquer les settings
//             if (textureSettings?.minFilter)
//                 texture.minFilter = textureSettings.minFilter;
//             if (textureSettings?.magFilter)
//                 texture.magFilter = textureSettings.magFilter;
//             if (textureSettings?.anisotropy)
//                 texture.anisotropy = textureSettings.anisotropy;

//             // Redimensionner si textureResolution est défini
//             if (
//                 textureResolution &&
//                 texture.image &&
//                 texture.image.width > textureResolution
//             ) {
//                 // Implémentation du redimensionnement si nécessaire
//                 console.log(
//                     `Optimizing texture resolution to ${textureResolution}px`
//                 );
//             }

//             texture.needsUpdate = true;
//         });
//     };

//     // Appliquer aux matériaux de l'objet
//     if ((object as Mesh).material) {
//         if (Array.isArray((object as Mesh).material)) {
//             (object as Mesh).material.forEach(applyToMaterial);
//         } else {
//             applyToMaterial((object as Mesh).material);
//         }
//     }

//     // Parcourir récursivement les enfants
//     object.children.forEach((child) =>
//         optimizeTextures(child, textureSettings, textureResolution)
//     );
// }
