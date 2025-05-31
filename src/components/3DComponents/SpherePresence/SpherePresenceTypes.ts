import { JSX } from 'react';
export type SpherePresenceTypes = {
    // position: [number, number, number];
    radius: [number, number];
    /** Allows the sphere to be apparent */
    debug?: boolean;
    /** @defaultValue true */
    visible?: boolean;
} & JSX.IntrinsicElements['mesh'];
