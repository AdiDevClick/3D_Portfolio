import { JSX } from 'react';
export type SpherePresenceTypes = {
    // position: [number, number, number];
    radius: [number, number];
    color: string;
    /** @defaultValue true */
    visible?: boolean;
} & JSX.IntrinsicElements['mesh'];
