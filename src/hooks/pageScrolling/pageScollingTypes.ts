import { RefObject } from 'react';
import { Group } from 'three';

export type CalculateVirtualPageCountProps = {
    groupRef: RefObject<Group>;
    contentHeight: number;
    isActive: boolean;
};
