import { Text } from '@react-three/drei';
import { importedNormalFont } from '@/configs/3DFonts.config';

export function AboutText({
    children,
    isMobile,
    // generalScaleX,
    // contentWidth,
    // materials,
    // index,
    // position = [0, 0, -0.3],
    // outlineWidth = isMobile ? 0.002 : 0.002,
    // textAlign = 'left',
    // maxWidth = isMobile ? contentWidth - 0.4 : contentWidth / 2,
    ...props
}) {
    return (
        <Text
            // position={position}
            // fontSize={(isMobile ? 0.6 : 0.5) * generalScaleX}
            outlineWidth={isMobile ? 0.005 : 0.004}
            outlineColor="black"
            anchorY="top"
            // textAlign={textAlign}
            anchorX="center"
            color={'black'}
            textAlign={'left'}
            // maxWidth={maxWidth}
            font={importedNormalFont}
            fontWeight={700}
            userData={{ isWrappedText: true }}
            {...props}
        >
            {children}
        </Text>
    );
}
