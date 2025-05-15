import { Text, TextProps } from '@react-three/drei';
import normalMontFont from '@assets/fonts/Montserrat-VariableFont_wght.ttf';
import React, { ReactNode } from 'react';
import { Group, Mesh } from 'three';

type FallbackTextTypes = {
    children: ReactNode;
    ref?: React.RefObject<Mesh | Group>;
} & TextProps;

/**
 * FallbackText component that displays a non-3D text for mobile.
 *
 * @returns
 */
export function FallbackText({ children, ref, ...props }: FallbackTextTypes) {
    return (
        <Text
            ref={ref}
            castShadow
            font={normalMontFont}
            fontSize={0.1}
            color="black"
            outlineWidth={0.004}
            {...props}
        >
            {children}
        </Text>
    );
}
