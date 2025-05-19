import { SettingsType } from '@/configs/3DCarouselSettingsTypes';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { ReactNode } from 'react';

export type SceneProps = {
    children: ReactNode;
    SETTINGS: SettingsType;
    boundaries: { x: number; y: number; z: number };
    reducer: ReducerType;
};

export type PagesTypes = {
    contentWidth: ReducerType['contentWidth'];
    contentHeight: ReducerType['contentHeight'];
    generalScaleX: ReducerType['generalScaleX'];
    visible: ReducerType['visible'];
    isMobile: ReducerType['isMobile'];
};
