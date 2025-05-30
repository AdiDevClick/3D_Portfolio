import { FallbackTextTypes } from '@/components/3DComponents/Title/TitlesTypes';
import { importedNormalFont } from '@/configs/3DFonts.config';
import { Text } from '@react-three/drei';

/**
 * FallbackText component that displays a non-3D text for mobile.
 *
 * @returns
 */
export function FallbackText({ children, ref, ...props }: FallbackTextTypes) {
    return (
        <group>
            <Text
                ref={ref}
                castShadow
                font={importedNormalFont}
                fontSize={0.1}
                color="black"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.004}
                {...props}
            >
                {children}
            </Text>
        </group>
    );
}
