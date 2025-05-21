import { Icons } from '@/components/3DComponents/3DIcons/Icons';
import { FloatIconProps } from '@/components/3DComponents/Contact/ContactTypes';
import { useSpring, animated } from '@react-spring/three';
import { Float } from '@react-three/drei';
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
export function FloatIcon({
    model,
    position,
    rotation,
    ...props
}: FloatIconProps) {
    const [hovered, setHovered] = useState(false);

    const hoveredStyle = useSpring({
        scale: hovered ? 1.2 : 1,
        config: { mass: 1, tension: 170, friction: 26 },
    });
    return (
        <animated.group scale={hoveredStyle.scale.to((s) => [s, s, s])}>
            <Float
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                speed={1}
                rotationIntensity={0.5}
                floatIntensity={0.5}
                position={position}
                rotation={rotation}
                {...props}
            >
                <Icons model={model} />
            </Float>
        </animated.group>
    );
}
