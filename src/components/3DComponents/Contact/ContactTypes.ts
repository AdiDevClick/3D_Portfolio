import { FloatProps } from '@react-three/drei';
import { Ref } from 'react';
import { Group } from 'three';

export type ContactIconsContainerProps = {
    ref: Ref<Group>;
};

export interface Model extends FloatProps {
    model: string;
    name: string;
}

export interface FloatIconsProps {
    models: Model[];
    floatOptions: FloatProps;
}

export interface FloatIconProps extends Model {}
