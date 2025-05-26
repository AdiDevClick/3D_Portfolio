import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh';
import { IconsTypes } from '@/components/3DComponents/Contact/ContactTypes';
import { useCursor, useGLTF } from '@react-three/drei';

/**
 * Creates a 3D icon component.
 * - Hover effect and click event to open a link
 * - A tooltip is displayed on hover
 * @param props - Props to be passed to the component. Accepts all group props
 * @param model - Model path to be used
 */
export function Icons({ model, hovered }: IconsTypes) {
    const { nodes } = useGLTF(model);

    useCursor(hovered || false);

    return (
        <group dispose={null}>
            {nodes.Scene?.children.map((node) => {
                return (
                    <IconMesh
                        key={node.uuid}
                        data={node}
                        iconColor={'#000000'}
                        curveSegments={32}
                        hovered={hovered}
                    />
                );
            })}
        </group>
    );
}

/**
 * Allow to preload the icon models
 * @param modelPaths - Array of model paths to preload
 */
export function preloadIcons(modelPaths: string[]) {
    const paths = Array.isArray(modelPaths) ? modelPaths : [modelPaths];
    paths.forEach((path) => {
        useGLTF.preload(path);
    });
}
