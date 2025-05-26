import { FloatIcon } from '@/components/3DComponents/3DIcons/FloatIcon';
import { FloatIconsProps } from '@/components/3DComponents/Contact/ContactTypes';

/**
 * FloatIcons component -
 * @description : This component will create a floating effect for the icons
 * you pass to it.
 *
 * @param models - List of models to be used
 * @param floatOptions - Options for the floating effect
 * @param scalar - Scale factor for the icons
 * @param isMobile - Whether the icons should be displayed in mobile mode
 * @param tooltips **@default=true** - Whether to show tooltips on hover
 * @returns
 */
export function FloatIcons({
    models,
    scalar,
    isMobile,
    floatOptions,
    tooltips,
}: FloatIconsProps) {
    return models.map(({ model, ...rest }, index) => (
        <FloatIcon
            key={index}
            model={`${import.meta.env.BASE_URL}assets/models/${
                isMobile ? `mobile/${model}` : `optimized/${model}`
            }`}
            position={
                isMobile
                    ? rest.modelPosition.mobile
                    : rest.modelPosition.default
            }
            scale={scalar}
            tooltips={tooltips}
            {...rest}
            {...floatOptions}
        />
    ));
}
