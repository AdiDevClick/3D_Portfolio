import { Text } from '@react-three/drei';
import { importedNormalFont } from '@/configs/3DFonts.config';
import { FallbackTextTypes } from '@/components/3DComponents/Title/TitlesTypes';

/**
 * Component that will create text for the About Page
 */
export function AboutText({ children, ...props }: FallbackTextTypes) {
    return (
        <Text
            outlineWidth={0.002}
            outlineColor="black"
            anchorY="top"
            anchorX="center"
            color={'black'}
            textAlign={'left'}
            font={importedNormalFont}
            fontWeight={700}
            userData={{ isWrappedText: true }}
            {...props}
        >
            {children}
        </Text>
    );
}
