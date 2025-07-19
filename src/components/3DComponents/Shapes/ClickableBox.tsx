import { sharedMatrices } from '@/utils/matrices';
import { useCallback } from 'react';
import { Group, Vector3 } from 'three';

/**
 * Calculate size of the content
 * to enable smooth hover & click interactions.
 */
export function ClickableBox({ ...props }) {
    const floatRef = useCallback((node: Group) => {
        if (!node) return;
        let ancestorContent: Vector3 | undefined;

        // Traverse ancestors to find the content size
        // created by the grid component.
        node.traverseAncestors((ancestor) => {
            if (ancestor.name.includes('-grid')) {
                ancestorContent = ancestor.userData.contentSize;
            }
        });

        const floatContainer = node.parent?.parent;

        if (floatContainer) {
            // No ancestor content size found ? Calculate from floatContainer size.
            if (!ancestorContent) {
                const box = sharedMatrices.box.setFromObject(floatContainer);
                const contentSize = new Vector3();
                box.getSize(contentSize);
                node.scale.set(contentSize.x, contentSize.y, contentSize.z);
            } else {
                // Use the ancestor content size to set the scale.
                node.scale.set(
                    ancestorContent.x,
                    ancestorContent.y,
                    ancestorContent.z
                );
            }
        }
    }, []);
    return (
        <mesh
            ref={floatRef}
            name={'clickable-box'}
            visible={false}
            geometry={sharedMatrices.boxGeometry}
            {...props}
        />
    );
}
