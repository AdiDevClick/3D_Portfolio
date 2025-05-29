import { IconsContainerContext } from '@/api/contexts/IconsContainerProvider';
import { Icons } from '@/components/3DComponents/3DIcons/Icons';
import {
    ContactIconsContainerProviderTypes,
    FloatIconProps,
} from '@/components/3DComponents/Contact/ContactTypes';
import { sharedMatrices } from '@/utils/matrices';
import { useSpring, animated } from '@react-spring/three';
import { Float, Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { use, useState } from 'react';

/**
 * @component Floating Icon
 *
 * @description
 * Creates a floating icon with a 3D model.
 * - The icon will scale up on hover.
 * - The icon can be clicked to open a link if specified in the props.
 * - If a tooltip is enabled in the parent provider, it will display the name of the icon on hover.
 *
 * @param model - Model path to be used
 * @param props - Props to be passed to the component. Accepts all group props
 */
export function FloatIcon({ model, ...props }: FloatIconProps) {
    const { scalar, tooltips, floatOptions } = use(
        IconsContainerContext
    ) as ContactIconsContainerProviderTypes;

    const [hovered, setHovered] = useState(false);

    const hoveredStyle = useSpring({
        scale: hovered ? 1.2 : 1,
        config: { mass: 1, tension: 170, friction: 26 },
    });

    return (
        <animated.group scale={hoveredStyle.scale.to((s) => [s, s, s])}>
            <Float
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                }}
                onClick={(e) => onClickHandler(e, props.link)}
                {...floatOptions}
                {...props}
            >
                <Icons
                    key={'float-icon' + model}
                    model={model}
                    hovered={hovered}
                    scale={100 * scalar}
                />

                <mesh
                    position={[0.2, 0.2, 0]}
                    geometry={sharedMatrices.boxGeometry}
                    visible={false}
                />
                {hovered && tooltips && (
                    <Html position={[0, 1, 0]}>
                        <div className="about__tooltip">{props.name}</div>
                    </Html>
                )}
            </Float>
        </animated.group>
    );
}

/**
 * Sends the user to the corresponding link on click
 * @param e - Event triggered on click
 * @param icon - Icon name to identify the link
 */
function onClickHandler(e: ThreeEvent<globalThis.MouseEvent>, link: string) {
    e.stopPropagation();
    if (!link) return;
    window.open(link);
}
