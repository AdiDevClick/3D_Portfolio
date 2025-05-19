import { CenterProps, Text3DProps, TextProps } from '@react-three/drei';
import { JSX, ReactNode, RefObject } from 'react';
import { Mesh } from 'three';
import { Group } from 'three/examples/jsm/libs/tween.module.js';

export type FallbackTextTypes = {
    children: ReactNode;
    ref?: React.RefObject<Mesh | Group>;
} & TextProps;

/**
 * FloatingTitle component types.
 */
export type FloatingTitleProps = {
    children: ReactNode;
    size: number;
    isMobile?: boolean;
    scale: number;
    textProps?: {};
} & JSX.IntrinsicElements['group'] & {
        [key: string]: any;
    };

export type TitleTypes = {
    children: string | string[] | ReactNode;
    size?: number;
    textProps?: Omit<Text3DProps, 'children' | 'font' | 'size'>;
    [key: string]: any;
} & Omit<CenterProps, 'children'>;

export type HomePageTitleProps = {
    ref: RefObject<Group>;
    scale: number;
};
