import {
    Center,
    CenterProps,
    FontData,
    Text3D,
    Text3DProps,
} from '@react-three/drei';
import montserratFont from '@assets/fonts/Montserrat_Thin_Regular.json';
import { ReactNode } from 'react';
import { Vector3 } from 'three';

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
 * @param textProps - Text3D properties
 * @param props - Center properties
 */
export function Title({
    children,
    size = 30,
    textProps = {},
    ...props
}: TitleTypes) {
    return (
        <Center front {...props}>
            <Text3D
                castShadow
                bevelEnabled
                curveSegments={32}
                bevelSegments={5}
                bevelThickness={1}
                bevelSize={1}
                bevelOffset={0}
                scale={0.01}
                size={size}
                height={1}
                smooth={1}
                font={typedMontserratFont}
                {...textProps}
            >
                {children}
                <meshNormalMaterial />
            </Text3D>
        </Center>
    );
}
