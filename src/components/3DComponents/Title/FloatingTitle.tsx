import { ClickableBox } from '@/components/3DComponents/Forms/ClickableBox';
import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
import { Title } from '@/components/3DComponents/Title/Title';
import { FloatingTitleProps } from '@/components/3DComponents/Title/TitlesTypes';
import { Float } from '@react-three/drei';
import { memo } from 'react';

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
// function FloatingTitle({
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
    console.log('FloatingTitle rendered', props.name);
    return (
        // <Center >
        <group>
            <Float
                name={props.name + '-float-container'}
                rotation={[0, 3.164, 0]}
                // position={isMobile ? [-0.5, 0.5, 0] : [0, 0, 0]}
                {...floatOptions}
            >
                {/* <group> */}
                {/* <Center> */}
                {/* <Center position={props.position}> */}
                {/* <Center position={isMobile ? [0.3, 0.5, 0] : props.position}> */}
                {!isMobile && (
                    <Title
                        size={size}
                        isMobile={isMobile}
                        textProps={textProps}
                        text={text}
                        scalar={scalar}
                        {...props}
                    />
                )}
                {isMobile && <FallbackText>{text}</FallbackText>}
                {/* </Center> */}

                {isClickable && (
                    <ClickableBox
                        onPointerOver={props.onPointerOver}
                        onPointerOut={props.onPointerOut}
                        onClick={props.onClick}
                    />
                )}
                {/* </group> */}
            </Float>
        </group>
        // </Center>
    );
});

export default FloatingTitle;
