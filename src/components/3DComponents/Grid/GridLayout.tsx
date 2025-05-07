import { JSX, ReactNode, useCallback, useEffect, useState } from 'react';
import { Box3, Vector3, Group } from 'three';

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

/**
 * GridLayout component to arrange items in a grid layout.
 *
 * @param children - Child elements to be arranged in the grid
 * @param width - Width of the grid container/device window size
 * @param scalar - **(default=1)** - Scalar value to adjust the size of the grid items and text
 * @param index - Index of the current item in the grid
 * @param length - Total number of items in the grid
 * @param options - Grid layout options
 * @param options.columnsNumber - **(default=3)** - Number of columns in the grid
 * @param options.rowOffset - **(default=0.5)** - Offset for odd rows
 * @param options.marginX - **(default=2.5)** - Horizontal margin between items
 * @param options.marginY - **(default=1.3)** - Vertical margin between items
 * @param options.windowMargin - **(default=1)** - Margin for the window
 */
export function GridLayout({
    children,
    width,
    index,
    length,
    scalar = 1,
    options = {
        columnsNumber: 3,
        rowOffset: 0.5,
        marginX: 2.5,
        marginY: 1.3,
        windowMargin: 1,
    },
    ...props
}: GridLayoutProps) {
    const { rowOffset, marginX, marginY, windowMargin } = options;
    const [position, setPosition] = useState<[number, number, number]>([
        0, 0, 0,
    ]);

    /**
     * - Calculates the position of the grid item based on
     * its index and the grid layout options.
     * - The position is calculated using the number
     * of columns, row offset, and margins.
     */
    useEffect(() => {
        const columns = Math.min(
            options.columnsNumber,
            Math.ceil((width - windowMargin) / 2)
        );
        const col = index % columns;
        const row = Math.floor(index / columns);

        // Offset for odd rows
        const offset = row % 2 === 0 ? 0 : rowOffset;

        const spacingX = scalar * marginX;
        // const spacingX = scalar * marginX + gridSize.x;
        const spacingY = scalar * marginY;

        const x = (col + offset) * spacingX;
        const y = row * spacingY;

        const centerOffsetX =
            ((columns - 1) * spacingX + rowOffset * spacingX) / 2;
        setPosition([x - centerOffsetX, -y, 0]);
    }, [
        index,
        width,
        scalar,
        options.columnsNumber,
        windowMargin,
        rowOffset,
        marginX,
        marginY,
    ]);

    const itemRef = useCallback((item: Group) => {
        if (!item) return;
        const box = new Box3().setFromObject(item);
        const size = new Vector3();
        box.getSize(size);
        item.userData.size = size;
    }, []);

    return (
        <group
            ref={itemRef}
            position={position}
            rotation={[0, 3.164, 0]}
            {...props}
        >
            {children}
        </group>
    );
}
