import { Title } from '@/components/3DComponents/Title/Title';
import { FloatingTitleProps } from '@/components/3DComponents/Title/TitlesTypes';
import { sharedMatrices } from '@/utils/matrices';
import { Center, Float } from '@react-three/drei';
import { memo, useCallback } from 'react';
import { Group, Vector3 } from 'three';

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: Math.random(),
    floatIntensity: Math.random(),
    floatingRange: [-0.1, 0.1] as [number, number],
};

/**
 * FloatingTitle component.
 * This title is already rotated.
 */
const FloatingTitle = memo(function FloatingTitle({
    children,
    scalar,
    text,
    size,
    isMobile,
    textProps,
    isClickable,
    ...props
}: FloatingTitleProps) {
    /**
     * Calculate size of the title
     * to enable smooth hover & click interactions.
     */
    const floatRef = useCallback((node: Group) => {
        if (!node || !isClickable) return;
        let ancestorContent;
        node.traverseAncestors((ancestor) => {
            if (ancestor.name.includes('-grid')) {
                ancestorContent = ancestor.userData.contentSize;
            }
        });
        // console.log(ancestorContent);
        // console.log(node);
        // const clickageBox = node.getObjectByName('clickable-box');
        const floatContainer = node.parent.parent;
        // node.parent.parent.getObjectByName('clickable-box');
        // console.log(floatContainer);
        if (floatContainer) {
            if (!ancestorContent) {
                const box = sharedMatrices.box.setFromObject(floatContainer);
                const contentSize = new Vector3();
                box.getSize(contentSize);
                node.scale.set(contentSize.x, contentSize.y, contentSize.z);
            } else {
                node.scale.set(
                    ancestorContent.x,
                    ancestorContent.y,
                    ancestorContent.z
                );
            }
        }
    }, []);
    // console.log(scalar, text, size, isMobile, textProps, isClickable, props);
    return (
        <Float
            rotation={[0, 3.164, 0]}
            name={props.name + '-float-container'}
            {...floatOptions}
        >
            <Center position={props.position}>
                {children}
                <Title
                    size={size}
                    isMobile={isMobile}
                    textProps={textProps}
                    text={text}
                    scalar={scalar}
                    {...props}
                />
            </Center>
            {/* <Suspense
                fallback={
                    <FallbackText rotation={[0, 3.164, 0]}>
                        {children}
                    </FallbackText>
                }
                    
            > */}

            {/* <Title
                rotation={[0, 3.164, 0]}
                size={size}
                isMobile={isMobile}
                textProps={textProps}
                text={text}
                {...props}
            >
                {children}
            </Title> */}
            {/* </Suspense> */}
            {isClickable && (
                // <Center>
                <mesh
                    onPointerOver={props.onPointerOver}
                    onPointerOut={props.onPointerOut}
                    onClick={props.onClick}
                    name={'clickable-box'}
                    visible={false}
                    ref={floatRef}
                    // scale={[2, 1, 1]}
                    geometry={sharedMatrices.boxGeometry}
                />
                // </Center>
            )}
        </Float>
    );
});

export default FloatingTitle;
