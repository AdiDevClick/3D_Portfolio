import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { FloatProps } from '@react-three/drei';
import { Ref } from 'react';
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

export interface FloatIconsProps
    extends Omit<ContactIconsContainerProps, 'ref'> {
    models: Model[];
    floatOptions: FloatProps;
}

export interface FloatIconProps extends Model {
    tooltips?: boolean;
}

export interface IconsTypes {
    model: Model['model'];
    hovered?: boolean;
}
