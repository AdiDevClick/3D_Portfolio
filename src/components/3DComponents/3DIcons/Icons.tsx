import { dracoConfig } from '@/api/draco/dracoConfig';
import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh';
import { IconsTypes } from '@/components/3DComponents/Contact/ContactTypes';
import { useCursor } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';

/**
 * Creates a 3D icon component.
 * - Hover effect and click event to open a link
 * - A tooltip is displayed on hover
 * @param model - Model path to be used
 * @param hovered - Whether the icon is hovered
 * @param scale - **@default=100** - Scale of the icon
 */
export function Icons({ model, hovered, scale = 100 }: IconsTypes) {
    const { nodes } = useLoader(GLTFLoader, model, (loader) => {
        const dracoLoader = dracoConfig();

        loader.setDRACOLoader(dracoLoader);
    });

    useCursor(hovered || false);

    return (
        <>
            {nodes.Scene?.children.map((node) => {
                return (
                    <IconMesh
                        key={node.uuid}
                        data={node}
                        iconColor={'#000000'}
                        curveSegments={32}
                        hovered={hovered}
                        scale={scale}
                    />
                );
            })}
        </>
    );
}

/**
 * Allow to preload the icon models
 * @param modelPaths - Array of model paths to preload
 */
// export function preloadIcons(modelPaths: string[]) {
//     const paths = Array.isArray(modelPaths) ? modelPaths : [modelPaths];
//     paths.forEach((path) => {
//         useGLTF.preload(path);
//     });
// }
