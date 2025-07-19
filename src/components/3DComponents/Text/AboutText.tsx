import { Text } from '@react-three/drei';
import { importedNormalFont } from '@/configs/3DFonts.config';

export function AboutText({ children, isMobile, ...props }) {
    return (
        <Text
            outlineWidth={isMobile ? 0.005 : 0.004}
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
