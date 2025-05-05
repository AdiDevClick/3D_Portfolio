import {
    Center,
    CenterProps,
    FontData,
    Text3D,
    Text3DProps,
} from '@react-three/drei';
import montserratFont from '@assets/fonts/Montserrat_Thin_Regular.json';
import { ReactNode, useRef } from 'react';
import { Group, Vector3 } from 'three';

const typedMontserratFont = montserratFont as unknown as FontData;
// const montserratFont = 'src/assets/fonts/Montserrat_Thin_Regular.json';
type TitleTypes = {
    children: string | string[] | ReactNode;
    size?: number;
    position?: [number, number, number] | Vector3;
    textProps?: Omit<Text3DProps, 'children' | 'font' | 'size'>;
    [key: string]: any;
} & Omit<CenterProps, 'children'>;

/**
 * 3D Title component that displays a 3D text in the center of the screen.
 * It uses the Montserrat font and allows for customization of size and other properties.
 *
 * @param children - Text to display
 * @param size - Text size (default = 30)
 * @param isMobile - If true, will use mobile settings (default = false)
 * @param textProps - Text3D properties
 * @param props - Center properties
 */
export function Title({
    children,
    ref,
    position,
    rotation,
    name,
    size = 30,
    isMobile = false,
    textProps = {},
    ...props
}: TitleTypes) {
    const localRef = useRef<Group>(null!);

    return (
        <group
            ref={ref ? ref : (ref = localRef)}
            position={position}
            rotation={rotation}
            name={name}
        >
            {ref.current && (
                <Center front {...props}>
                    <Text3D
                        castShadow
                        bevelEnabled
                        curveSegments={isMobile ? 12 : 32}
                        bevelSegments={3}
                        bevelThickness={1}
                        bevelSize={2}
                        bevelOffset={0}
                        scale={0.01}
                        size={size}
                        height={1}
                        smooth={1}
                        font={typedMontserratFont}
                        {...textProps}
                    >
                        {children}
                        {/* <meshNormalMaterial /> */}
                        {/* <MeshTransmissionMaterial
                        clearcoat={1}
                        samples={isMobile ? 1 : 8}
                        thickness={40}
                        chromaticAberration={isMobile ? 0.05 : 0.25}
                        anisotropy={isMobile ? 0 : 0.4}
                        resolution={isMobile ? 256 : 2048}
                        distortion={0}
                    /> */}
                        <meshLambertMaterial />
                    </Text3D>
                </Center>
            )}
        </group>
    );
}
