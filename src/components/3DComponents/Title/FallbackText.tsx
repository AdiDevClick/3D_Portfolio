import { Text, TextProps } from '@react-three/drei';
import normalMontFont from '@assets/fonts/Montserrat-VariableFont_wght.ttf';
import { ReactNode } from 'react';

type FallbackTextTypes = {
    children: ReactNode;
} & TextProps;

/**
 * FallbackText component that displays a non-3D text for mobile.
 *
 * @returns
 */
export function FallbackText({ children, ...props }: FallbackTextTypes) {
    return (
        <Text
            castShadow
            font={normalMontFont}
            fontSize={0.1}
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.004}
            {...props}
        >
            {children}
        </Text>
    );
}
