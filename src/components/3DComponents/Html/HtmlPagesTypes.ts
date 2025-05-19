import { PagesTypes } from '@/components/3DComponents/Scene/SceneTypes';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { HtmlProps } from '@react-three/drei/web/Html';
import { ReactNode } from 'react';

export type BillboardPageContainerProps = {
    children: ReactNode;
    pageName: string;
};

export type AboutTypes = {
    /** @defaultValue 0.5 */ margin?: number;
} & PagesTypes;

export type HtmlContainerTypes = {
    reducer?: ReducerType;
    children: ReactNode;
    dynamicContent?: boolean;
    forceMeasure?: boolean;
    distanceFactor?: number;
} & Omit<HtmlProps, 'ref'>;
