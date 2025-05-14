import { IconMesh } from '@/components/3DComponents/3DIcons/IconMesh.tsx';
import { Html, useCursor, useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { JSX, useState } from 'react';

type IconsTypes = {
    model: string;
} & JSX.IntrinsicElements['group'];

/**
 * Creates a 3D icon component.
 * - Hover effect and click event to open a link
 * - A tooltip is displayed on hover
 * @param props - Props to be passed to the component. Accepts all group props
 * @param model - Model path to be used
 */
export function Icons({ model, ...props }: IconsTypes) {
    const [hovered, set] = useState(false);
    const { nodes } = useGLTF(model);

    useCursor(hovered);

    const getServiceName = () => {
        if (model.includes('github') || model.includes('Github'))
            return 'GitHub';
        if (model.includes('linkedin') || model.includes('Linkedin'))
            return 'LinkedIn';
        return 'Lien';
    };

    return (
        <group
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
            onClick={(e) => onClickHandler(e, model)}
            scale={70}
            dispose={null}
            {...props}
        >
            {nodes.Scene.children.map((node) => {
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
            {hovered && (
                <Html>
                    <div className="about__tooltip">{getServiceName()}</div>
                </Html>
            )}
        </group>
    );
}

/**
 * Sends the user to the corresponding link on click
 * @param e - Event triggered on click
 * @param icon - Icon name to identify the link
 */
function onClickHandler(e: ThreeEvent<globalThis.MouseEvent>, icon: string) {
    e.stopPropagation();
    if (
        icon.includes('github') ||
        icon.includes('GitHub') ||
        icon.includes('Github')
    ) {
        window.open('https://www.github.com/AdiDevClick');
    } else if (
        icon.includes('linkedin') ||
        icon.includes('LinkedIn') ||
        icon.includes('Linkedin')
    ) {
        window.open('https://www.linkedin.com/in/adrien-quijo');
    }
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
