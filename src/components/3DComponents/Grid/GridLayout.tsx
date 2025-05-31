import {
    GridLayoutProps,
    GridLayoutTypes,
} from '@/components/3DComponents/Grid/GridLayoutTypes';
import { sharedMatrices } from '@/utils/matrices';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Vector3, Group } from 'three';

const gridStores = new Map<string, Map<number, GridLayoutTypes>>();
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
 * @param options.dynamicHeightContent - **(default=false)** - If true, the height of the content is dynamic
 * @param options.forceColumnsNumber - **(default=false)** - If true, forces the number of columns
 */
export function GridLayout({
    children,
    width,
    index,
    length,
    scalar = 1,
    type,
    options = {
        columnsNumber: 3,
        rowOffset: 0.5,
        marginX: 2.5,
        marginY: 1.3,
        windowMargin: 1,
        dynamicHeightContent: false,
        forceColumnsNumber: false,
    },
    ...props
}: GridLayoutProps) {
    const { rowOffset, marginX, marginY, windowMargin } = options;
    const [position, setPosition] = useState<[number, number, number]>([
        0, 0, 0,
    ]);
    const [storeUpdated, setStoreUpdated] = useState(0);
    const initialized = useRef(false);
    // Exemple "about-1"
    const groupId = props.name?.split('-')[0] || 'default';

    const spacingX = scalar * marginX;
    let spacingY = scalar * marginY;

    useEffect(() => {
        if (!gridStores.has(groupId)) {
            gridStores.set(groupId, new Map());
        }

        // Cleanup
        return () => {
            const store = gridStores.get(groupId);
            if (store) {
                store.delete(index);

                if (store.size === 0) {
                    gridStores.delete(groupId);
                }
            }
        };
    }, [groupId, index]);

    /**
     * - Calculates the position of the grid item based on
     * its index and the grid layout options.
     * - The position is calculated using the number
     * of columns, row offset, and margins.
     */
    useEffect(() => {
        if (!initialized.current) return;
        const columns = Math.min(
            options.columnsNumber,
            options.forceColumnsNumber
                ? options.columnsNumber
                : Math.ceil((width - windowMargin) / 2)
        );
        const col = index % columns;
        const row = Math.floor(index / columns);

        // Offset for odd rows
        const offset = row % 2 === 0 ? 0 : rowOffset;

        // Calculate X
        const x = (col + offset) * spacingX;
        const centerOffsetX =
            ((columns - 1) * spacingX + rowOffset * spacingX) / 2;

        // Calculate Y
        let calculatedY = 0;
        if (options.dynamicHeightContent) {
            const store = gridStores.get(groupId);
            if (store) {
                const element = store.get(index);
                calculatedY = element?.positionY ?? 0;
            }
        } else {
            // Use fixed spacing
            calculatedY = row * spacingY;
        }
        setPosition([x - centerOffsetX, -calculatedY, 0]);
    }, [
        index,
        width,
        scalar,
        options.columnsNumber,
        windowMargin,
        rowOffset,
        marginX,
        marginY,
        storeUpdated,
        initialized.current,
    ]);

    /**
     * Can be used to fix the badly calculated height of the text
     * @param textComponent - The text component to estimate the height for
     */
    const estimateTextHeight = (textComponent: any) => {
        if (!textComponent || !textComponent.text) return 0;

        const fontSize = textComponent.fontSize || 0.2;
        const maxWidth = textComponent.maxWidth || 2;
        const text = textComponent.text;
        const lineHeight =
            textComponent.lineHeight === 'normal'
                ? 1.0
                : textComponent.lineHeight || 1;
        const avgCharWidth = fontSize * 0.5;

        // Char number
        const charsPerLine = Math.floor(maxWidth / avgCharWidth);

        // Ligne number
        const lines = Math.ceil(text.length / charsPerLine);
        // Height total
        return lines * fontSize * lineHeight;
    };

    const itemRef = useCallback((item: Group) => {
        if (!item) return;
        const measureSize = () => {
            const box = sharedMatrices.box.setFromObject(item);
            const contentSize = new Vector3();
            box.getSize(contentSize);

            if (contentSize.y === 0) {
                const timer = setTimeout(() => {
                    measureSize();
                }, 500);

                return () => {
                    clearTimeout(timer);
                };
            }

            // Calculate the height of the text
            // and assign into the store the position of the item
            const store = gridStores.get(groupId);
            if (options.dynamicHeightContent && store) {
                item.traverse((child: any) => {
                    if (
                        (child.isText && child.maxWidth) ||
                        child.userData?.isWrappedText
                    ) {
                        const estimatedHeight = estimateTextHeight(child);

                        contentSize.y = Math.max(
                            contentSize.y,
                            estimatedHeight
                        );
                    }
                });
                const previewsItem = store.get(index - 1);

                const existingItem = store.get(index);
                store.set(index, {
                    ...existingItem,
                    contentSize,
                    item,
                    type: type,
                    index: index,
                    calculatedHeight: contentSize.y + spacingY,
                    positionY: previewsItem
                        ? previewsItem.positionY + previewsItem.calculatedHeight
                        : 0,
                });
                // !! IMPORTANT !! mandatory for update to kick in and set positions
                setStoreUpdated((prev) => prev + 1);
            }
            initialized.current = true;
            item.userData.size = contentSize;
        };
        measureSize();
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
