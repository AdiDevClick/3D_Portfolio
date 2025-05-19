import { JSX, ReactNode } from 'react';

export type GridLayoutProps = {
    children: ReactNode;
    /** Width of the grid container/device window size */
    width: number;
    /** Index of the current item in the grid */
    index: number;
    /** Total number of items in the grid */
    length: number;
    /** Scalar value to adjust the size of the grid items and text - @defaultValue 1 */
    scalar?: number;
    /** Grid layout options */
    options?: {
        /** Number of columns in the grid - @defaultValue 3 */
        columnsNumber: number;
        /** Offset for odd rows - @defaultValue 0.5 */
        rowOffset: number;
        /** Horizontal margin between items - @defaultValue 2.5 */
        marginX: number;
        /** Horizontal margin between items - @defaultValue 1.3 */
        marginY: number;
        /** Margin for the window - @defaultValue 1 */
        windowMargin: number;
    };
} & JSX.IntrinsicElements['group'];
