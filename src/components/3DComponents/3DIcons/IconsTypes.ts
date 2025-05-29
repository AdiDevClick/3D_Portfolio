import { UseSpringProps } from '@react-spring/three';
import { CenterProps, Text3DProps } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { ReactNode, JSX } from 'react';
import { Group } from 'three';

export type IconsContainerTypes = {
    width: number;
    icons: { name: string; optimized: string; mobile: string }[];
    scalar: number;
    /** @DefaultValue 5 */
    margin?: number;
    isMobile: boolean;
    /** @defaultValue 100 */
    iconScale: number;
    floatOptions?: {
        speed?: number;
        floatIntensity?: number;
        rotationIntensity?: number;
        floatRange?: [number, number];
    };
    gridOptions?: {
        columnsNumber: number;
        rowOffset: number;
        marginX: number;
        marginY: number;
        windowMargin: number;
    };
    eventsList?: {
        onClick?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerDown?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerUp?: (event: ThreeEvent<MouseEvent>) => void;
        [key: string]:
            | ((event: ThreeEvent<MouseEvent | PointerEvent>) => void)
            | undefined;
    };
    mobileTextProps?: CenterProps;
    textProps?: Text3DProps;
    animations:
        | {
              propertiesToCheck?: string[];
              hovered?: boolean;
              [key: string]: any;
          } & UseSpringProps;
    children?: ReactNode;
    // hovered?: boolean;
} & JSX.IntrinsicElements['group'];

export interface IconsContainerContextTypes
    extends Omit<IconsContainerTypes, 'children' | 'icons'> {}

export interface IconsWithTextProps
    extends Omit<JSX.IntrinsicElements['group'], 'ref'> {
    model: string;
    datas: { name: string; text: string };
}
