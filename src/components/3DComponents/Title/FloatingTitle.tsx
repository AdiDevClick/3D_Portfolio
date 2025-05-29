import { Title } from '@/components/3DComponents/Title/Title';
import { FloatingTitleProps } from '@/components/3DComponents/Title/TitlesTypes';
import { sharedMatrices } from '@/utils/matrices';
import { Center, Float } from '@react-three/drei';
import { memo, useCallback } from 'react';
import { Group, Vector3 } from 'three';

/**
 * @component FloatingTitle
 * @description
 * Creates a floating title with a 3D text element.
 * - This title is already rotated.
 * - It can have children elements rendered inside it (e.g., icons).
 * - The title can be clickable, and it will adjust its size based on the content.
 * - It supports Center props for positioning on the component AND on the children.
 *
 * @param children - Children elements to be rendered inside the floating title
 * @param scalar - **(default=100)** - Scalar value to adjust the size of the title
 * @param text - Text to be displayed in the title
 * @param size - **(default=100)** - Size of the title text
 * @param isMobile - **(default=false)** - Indicates if the device is mobile
 * @param textProps - Text3D properties
 * @param isClickable - **(default=false)** - If true, the title will be clickable
 * @param floatOptions - Options for the floating effect
 * @param props - Additional properties for the 3D group element
 */
const FloatingTitle = memo(function FloatingTitle({
    children,
    scalar,
    text,
    size,
    isMobile = false,
    textProps,
    isClickable = false,
    floatOptions = {
        autoInvalidate: true,
        speed: 1.5,
        rotationIntensity: Math.random(),
        floatIntensity: Math.random(),
        floatingRange: [-0.1, 0.1] as [number, number],
    },
    ...props
}: FloatingTitleProps) {
    /**
     * Calculate size of the title
     * to enable smooth hover & click interactions.
     */
    const floatRef = useCallback((node: Group) => {
        if (!node || !isClickable) return;
        let ancestorContent: Vector3 | undefined;
        node.traverseAncestors((ancestor) => {
            if (ancestor.name.includes('-grid')) {
                ancestorContent = ancestor.userData.contentSize;
            }
        });

        // const clickageBox = node.getObjectByName('clickable-box');
        const floatContainer = node.parent?.parent;
        // node.parent.parent.getObjectByName('clickable-box');
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

            {isClickable && (
                <mesh
                    onPointerOver={props.onPointerOver}
                    onPointerOut={props.onPointerOut}
                    onClick={props.onClick}
                    name={'clickable-box'}
                    visible={false}
                    ref={floatRef}
                    geometry={sharedMatrices.boxGeometry}
                />
            )}
        </Float>
    );
});

export default FloatingTitle;
