import { Title } from '@/components/3DComponents/Title/Title.tsx';
import { Float } from '@react-three/drei';
import { JSX, memo, ReactNode } from 'react';

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

/**
 * FloatingTitle component types.
 */
type FloatingTitleProps = {
    children: ReactNode;
    yPosition: number;
    size: number;
    isMobile?: boolean;
    scale: number;
    textProps?: {};
} & JSX.IntrinsicElements['group'] & {
        [key: string]: any;
    };
/**
 * FloatingTitle component.
 */
const FloatingTitle = memo(function FloatingTitle({
    children,
    yPosition,
    position,
    size,
    scale,
    isMobile,
    textProps,
    ...props
}: FloatingTitleProps) {
    return (
        <group position-y={yPosition * scale} position={position}>
            <Float {...floatOptions}>
                <Title
                    rotation={[0, 3.164, 0]}
                    size={size}
                    isMobile={isMobile}
                    textProps={{
                        height: 40,
                        scale: 0.01 * scale,
                        ...textProps,
                    }}
                    {...props}
                >
                    {children}
                </Title>
            </Float>
        </group>
    );
});

export default FloatingTitle;
