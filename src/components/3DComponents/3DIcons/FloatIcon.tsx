import { Icons } from '@/components/3DComponents/3DIcons/Icons';
import { FloatIconProps } from '@/components/3DComponents/Contact/ContactTypes';
import { useSpring, animated } from '@react-spring/three';
import { Float, Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';

/**
 * Floating Icon component
 *
 * @description Creates a floating icon with a 3D model
 * @param model - Model path to be used
 * @param position - Position of the icon
 * @param rotation - Rotation of the icon
 * @param props - Props to be passed to the component. Accepts all group props
 */
export function FloatIcon({ model, ...props }: FloatIconProps) {
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
                speed={1}
                rotationIntensity={0.5}
                floatIntensity={0.5}
                {...props}
            >
                <Icons model={model} hovered={hovered} />

                <mesh position={[0.2, 0.2, 0]} visible={false}>
                    <boxGeometry />
                </mesh>
                {hovered && (
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
