import { Html, useCursor, useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { JSX, useState } from 'react';
import { Object3D } from 'three';

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
        if (model.includes('github')) return 'GitHub';
        if (model.includes('linkedin')) return 'LinkedIn';
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
            {nodes.Scene.children.map((node, index) => {
                return (
                    <IconMesh
                        key={index}
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
    if (icon.includes('github')) {
        window.open('https://www.github.com/AdiDevClick');
    } else if (icon.includes('linkedin')) {
        window.open('https://www.github.com/AdiDevClick');
    }
}

/**
 * Creates a 3D icon mesh component
 * @param iconColor - Color of the icon
 * @param data - Mesh data to be used
 */
function IconMesh({
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
}) {
    return (
        <mesh {...data} {...props}>
            <meshStandardMaterial
                color={hovered ? '#4285F4' : iconColor}
                emissive={hovered ? '#4285F4' : '#000000'}
                emissiveIntensity={hovered ? 0.3 : 0}
            />
        </mesh>
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
