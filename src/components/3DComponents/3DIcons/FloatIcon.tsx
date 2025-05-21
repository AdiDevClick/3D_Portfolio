import { Icons } from '@/components/3DComponents/3DIcons/Icons';
import { FloatIconProps } from '@/components/3DComponents/Contact/ContactTypes';
import { Float } from '@react-three/drei';

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
    return (
        <Float
            speed={1}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            position={position}
            rotation={rotation}
            {...props}
        >
            <Icons model={model} />
        </Float>
    );
}
