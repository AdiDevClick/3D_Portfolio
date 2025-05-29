import { TitleTypes } from '@/components/3DComponents/Title/TitlesTypes';
import { importedFont } from '@/configs/3DFonts.config';
import { Center } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MeshPhysicalMaterial } from 'three';
import { TextGeometry } from 'three-stdlib';

extend({ TextGeometry });
export const metalBlack = new MeshPhysicalMaterial({
    // export const metalBlack = new MeshStandardMaterial({
    envMapIntensity: 3,
    roughness: 0.3,
    metalness: 8,
    // metalness: 0.9,
    color: 'black',
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
});

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
    options = { priority: 'low', enabled: true },
    ...props
}: TitleTypes) {
    const textRef = useRef<Group>(null);
    const actualRef = ref || textRef;

    return (
        <Center back ref={actualRef} name={name} {...props}>
            <mesh scale={0.008 * scalar} material={metalBlack}>
                <textGeometry
                    args={[
                        text,
                        {
                            font: importedFont,
                            size: size,
                            height: 1,
                            smooth: 1,
                            letterSpacing: 2.5,
                            curveSegments: isMobile ? 4 : 32,
                            bevelEnabled: true,
                            bevelThickness: 1,
                            bevelSize: 1.5,
                            bevelOffset: 0.5,
                            bevelSegments: isMobile ? 2 : 4,
                            ...textProps,
                        },
                    ]}
                />
            </mesh>
        </Center>
    );
}
