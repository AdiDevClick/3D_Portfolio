import { AnimateItemProps } from '@/hooks/animation/animationItemsTypes';

/**
 * Custom hook to animate items based on their visibility and page activity.
 *
 * @description : This hook will animate items based on their visibility and the page's active state.
 *
 * @param items - Array of items to animate
 * @param isActive - Boolean indicating if the page is Active
 * @param mainGroupRef - Reference to the main group for visibility check
 * @param delta - Time delta for the animation
 */
export function animateItem({
    item,
    isActive,
    groupRef,
    delta,
}: AnimateItemProps): void {
    if (!item.ref.current) return;
    if (item.ref.current.visible || isActive || groupRef?.current?.visible) {
        item.animationType(
            item.ref.current[item.type] as any,
            item.effectOn as any,
            item.time,
            delta
        );
    }
}
