import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { FloatProps } from '@react-three/drei';
import { Ref, JSX } from 'react';
import { Group } from 'three';

export type ContactIconsContainerProps = {
    ref: Ref<Group>;
    scalar: ReducerType['generalScaleX'];
    isMobile?: ReducerType['isMobile'];
    /** @defaultValue true */
    tooltips?: boolean;
};

export interface Model extends FloatProps {
    model: string;
    name: string;
    modelPosition: {
        mobile: [number, number, number];
        default: [number, number, number];
    };
    link: string;
}

export interface FloatIconProps
    extends Model,
        Omit<JSX.IntrinsicElements['group'], 'ref' | keyof FloatProps> {}

export interface IconsTypes {
    model: Model['model'];
    hovered?: boolean;
    scale?: number;
}

export interface ContactIconsContainerProviderTypes
    extends Omit<ContactIconsContainerProps, 'ref'> {
    floatOptions: FloatProps;
    models: Model[];
}
