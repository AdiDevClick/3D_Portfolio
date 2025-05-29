import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { CenterProps, Text3DProps, TextProps } from '@react-three/drei';
import { JSX, ReactNode, RefObject } from 'react';
import { Group, Mesh, Object3D } from 'three';

export type FallbackTextTypes = {
    children: ReactNode;
    ref?: React.RefObject<Mesh | Group | Object3D>;
} & TextProps;

/**
 * FloatingTitle component types.
 */
export type FloatingTitleProps = {
    text: string;
    size: number;
    isMobile?: boolean;
    scalar: number;
    textProps?: {};
    /** @defaultValue false */
    isClickable?: boolean;
} & JSX.IntrinsicElements['group'] & {
        [key: string]: any;
    };

export type TitleTypes = {
    text: string;
    size?: number;
    textProps?: Omit<Text3DProps, 'children' | 'font' | 'size'>;
    [key: string]: any;
} & Omit<CenterProps, 'children'>;

export type HomePageTitleProps = {
    ref: RefObject<Group | null>;
    scalar: ReducerType['generalScaleX'];
};
