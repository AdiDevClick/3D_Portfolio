import { JSX } from 'react';
export type SpherePresenceTypes = {
    // position: [number, number, number];
    radius: [number, number];
    /** @defaultValue true */
    visible?: boolean;
} & JSX.IntrinsicElements['mesh'];
