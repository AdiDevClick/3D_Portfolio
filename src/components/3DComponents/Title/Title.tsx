import { TitleTypes } from '@/components/3DComponents/Title/TitlesTypes';
import { importedFont } from '@/configs/3DFonts.config';
import { Center } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Group, MeshPhysicalMaterial } from 'three';
import { TextBufferGeometry } from 'three-stdlib';

extend({ TextBufferGeometry });

// const textGeometryCreator = new TextGeometryFactory();
// let textGeometryInstance: TextGeometryFactory | null = null;
export const metalBlack = new MeshPhysicalMaterial({
    // export const metalBlack = new MeshStandardMaterial({
    envMapIntensity: 3,
    roughness: 0.3,
    metalness: 8,
    // metalness: 0.9,
    color: 'black',
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    ior: 1.5,
    thickness: 0,
});

// const geometryDefaultConfig = {
//     font: importedFont,
//     size: 40,
//     letterSpacing: 2,
//     height: 3,
//     depth: 1,
//     curveSegments: 12,
//     bevelEnabled: true,
//     bevelThickness: 0.2,
//     bevelSize: 1,
//     bevelOffset: 0.2,
//     bevelSegments: 4,
// };

// const geometryMobileConfig = {
//     font: importedFont,
//     size: 40,
//     letterSpacing: 2,
//     height: 0.5,
//     depth: 0,
//     curveSegments: 2,
//     bevelEnabled: false,
//     bevelThickness: 0,
//     bevelSize: 0,
//     bevelOffset: 0,
//     bevelSegments: 0,
// };

// let config = ['test', geometryDefaultConfig];

// export const textBufferGeometry = new TextBufferGeometry(config);

/**
 * 3D Title component that displays a 3D text in the center of the screen.
 * It uses the Montserrat font and allows for customization of size and other properties.
 *
 * @param text - Text to display
 * @param size - Text size (default = 30)
 * @param isMobile - If true, will use mobile settings (default = false)
 * @param textProps - Text3D properties
 * @param position - Position of the Center and NOT THE TEXT
 * @param rotation - Rotation of the Center and NOT THE TEXT
 * @param props - Center properties
 */
export function Title({
    text,
    ref,
    name,
    size = 40,
    isMobile = false,
    textProps = {},
    scalar,
    ...props
}: TitleTypes) {
    const textRef = useRef<Group>(null);
    const actualRef = ref || textRef;

    const geometryConfig = useMemo(() => {
        return [
            text,
            {
                font: importedFont,
                size: size,
                letterSpacing: 2,
                height: isMobile ? 0.5 : 3,
                depth: isMobile ? 0 : 1,
                curveSegments: isMobile ? 2 : 12,
                bevelEnabled: !isMobile,
                bevelThickness: isMobile ? 0 : 0.2,
                bevelSize: isMobile ? 0 : 1,
                bevelOffset: isMobile ? 0 : 0.2,
                bevelSegments: isMobile ? 0 : 4,
                ...textProps,
            },
        ];
    }, [isMobile, text]);

    return (
        <Center ref={actualRef} name={name} {...props}>
            <mesh scale={0.008 * scalar} material={metalBlack}>
                <textBufferGeometry args={geometryConfig} />
            </mesh>
        </Center>
    );
}
