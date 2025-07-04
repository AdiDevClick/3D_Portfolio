import { CalculateVirtualPageCountProps } from '@/hooks/pageScrolling/pageScollingTypes';
import { useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { useCallback, useRef, useState } from 'react';
import { Group } from 'three';

/**
 * Calculates the number of virtual pages
 *
 * @description : It uses the frustumChecker() that saved the userData.contentSize.y
 */
export function useVirtualPageCount() {
    const [isPageActive, setIsPageActive] = useState(false);
    const scroll = useScroll();
    const { viewport, camera } = useThree();

    const frameCountRef = useRef(0);

    const ref = useRef<Group>(null!);
    const contentHeightRef = useRef(0);

    /**
     * Saves the current page size and content height
     * @description This will set the state to Active
     */
    const calculateVirtualPageCount = useCallback(
        ({
            groupRef,
            contentHeight,
            isActive,
        }: CalculateVirtualPageCountProps) => {
            if (!groupRef.current || !contentHeight || !isActive) return;
            camera.updateMatrixWorld(true);
            camera.updateProjectionMatrix();
            // Frustum checker saved the contentSize.y ?
            ref.current = groupRef.current;
            contentHeightRef.current = contentHeight;
            setIsPageActive(isActive);
        },
        []
    );

    useFrame((_, delta) => {
        if (!ref.current?.userData?.contentSize || !isPageActive) return;
        frameCountRef.current += 1;
        const checkInterval = ref.current.userData.contentSize.y < 5 ? 10 : 2;

        if (frameCountRef.current % checkInterval === 0) {
            // Drei viewPort is the same as the stable viewport ?
            // Adding halfSizedViewport to the calculation
            // Else, we reduce the viewport height by half of the content height
            // to avoid too many virtual pages.
            const halfSizedViewport =
                contentHeightRef.current / viewport.height < 1
                    ? viewport.height - contentHeightRef.current / 2
                    : viewport.height / 2;
            const margin = 0.1;

            const contentSize = ref.current.userData.contentSize.y;
            // (Full box size + half of the top content height) / the viewport + margin
            let count = (contentSize + halfSizedViewport) / viewport.height;
            count += margin;

            // Accurate enough ? If yes, return
            if (Math.abs(scroll.pages - count) < 0.05) return;

            const smoothness = Math.abs(scroll.pages - count) > 1 ? 1 : 0.5;
            easing.damp(scroll, 'pages', count, smoothness, delta);
        }
    });

    return { calculateVirtualPageCount, setIsPageActive };
}

// function findThisNumber(arr, num = 100) {
//     if (arr.length === 0) return false;
//     arr.sort((a, b) => a - b);
//     let left = 0;
//     let right = arr.length - 1;

//     while (left <= right) {
//         const centeredIndex = Math.floor((left + right) / 2);

//         if (arr[centeredIndex] === num) return centeredIndex;

//         if (arr[centeredIndex] < num) {
//             left = centeredIndex + 1;
//         } else {
//             right = centeredIndex - 1;
//         }
//     }

//     return false;
// }
