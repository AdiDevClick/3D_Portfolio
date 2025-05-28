import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
import { Title } from '@/components/3DComponents/Title/Title';
import { FloatingTitleProps } from '@/components/3DComponents/Title/TitlesTypes';
import { sharedMatrices } from '@/utils/matrices';
import { Float } from '@react-three/drei';
import { memo, Suspense, useCallback } from 'react';
import { Group, Vector3 } from 'three';

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

/**
 * FloatingTitle component.
 * This title is already rotated.
 */
const FloatingTitle = memo(function FloatingTitle({
    children,
    size,
    isMobile,
    textProps,
    isClickable = false,
    ...props
}: FloatingTitleProps) {
    /**
     * Calculate size of the title
     * to enable smooth hover & click interactions.
     */
    const floatRef = useCallback((node: Group) => {
        if (!node || !isClickable) return;

        const box = sharedMatrices.box.setFromObject(node);
        const contentSize = new Vector3();
        box.getSize(contentSize);
        const clickageBox = node.getObjectByName('clickable-box');
        if (clickageBox) {
            clickageBox.scale.set(contentSize.x, contentSize.y, contentSize.z);
        }
    }, []);
    return (
        <Float ref={floatRef} {...floatOptions}>
            {/* <Suspense
                fallback={
                    <FallbackText rotation={[0, 3.164, 0]}>
                        {children}
                    </FallbackText>
                }
            > */}
            <Tigtle
                rotation={[0, 3.164, 0]}
                size={size}
                isMobile={isMobile}
                textProps={textProps}
                {...props}
            >
                {children}
            </Tigtle>
            {/* </Suspense> */}

            {isClickable && (
                <mesh
                    onPointerOver={props.onPointerOver}
                    onPointerOut={props.onPointerOut}
                    onClick={props.onClick}
                    name={'clickable-box'}
                    visible={false}
                >
                    <boxGeometry />
                </mesh>
            )}
        </Float>
    );
});

export default FloatingTitle;
