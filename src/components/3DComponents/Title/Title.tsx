import { importedFont } from '@/configs/3DFonts.config';
import { Center, CenterProps, Text3D, Text3DProps } from '@react-three/drei';
import { ReactNode } from 'react';

type TitleTypes = {
    children: string | string[] | ReactNode;
    size?: number;
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
 * @param position - Position of the Center and NOT THE TEXT
 * @param rotation - Rotation of the Center and NOT THE TEXT
 * @param props - Center properties
 */
export function Title({
    children,
    ref,
    name,
    size = 30,
    isMobile = false,
    textProps = {},
    scalar,
    ...props
}: TitleTypes) {
    return (
        <Center front ref={ref} name={name} {...props}>
            <Text3D
                castShadow
                bevelEnabled={true}
                curveSegments={isMobile ? 1 : 32}
                bevelSegments={isMobile ? 1 : 3}
                bevelThickness={1}
                bevelSize={2}
                bevelOffset={0}
                scale={0.01}
                size={size}
                height={1}
                smooth={1}
                letterSpacing={2.5}
                font={importedFont}
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
                {/* <meshMatcapMaterial color={'black'} /> */}
            </Text3D>
        </Center>
    );
}
