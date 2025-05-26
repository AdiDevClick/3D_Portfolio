import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { FloatProps } from '@react-three/drei';
import { Ref } from 'react';
import { Group } from 'three';

export type ContactIconsContainerProps = {
    ref: Ref<Group>;
    scalar: ReducerType['generalScaleX'];
    isMobile?: ReducerType['isMobile'];
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

export interface FloatIconsProps {
    models: Model[];
    floatOptions: FloatProps;
    scalar: ReducerType['generalScaleX'];
    isMobile?: ReducerType['isMobile'];
}

export interface FloatIconProps extends Model {}
