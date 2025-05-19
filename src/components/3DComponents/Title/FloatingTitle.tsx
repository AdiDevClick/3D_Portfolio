import { Title } from '@/components/3DComponents/Title/Title';
import { FloatingTitleProps } from '@/components/3DComponents/Title/TitlesTypes';
import { Float } from '@react-three/drei';
import { memo } from 'react';

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

/**
 * FloatingTitle component.
 */
const FloatingTitle = memo(function FloatingTitle({
    children,
    size,
    isMobile,
    textProps,
    ...props
}: FloatingTitleProps) {
    return (
        <Float {...floatOptions}>
            <Title
                rotation={[0, 3.164, 0]}
                size={size}
                isMobile={isMobile}
                textProps={textProps}
                {...props}
            >
                {children}
            </Title>
        </Float>
    );
});

export default FloatingTitle;
