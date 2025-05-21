import { FloatIcon } from '@/components/3DComponents/3DIcons/FloatIcon';
import { FloatIconsProps } from '@/components/3DComponents/Contact/ContactTypes';

/**
 * FloatIcons component -
 * @description : This component will create a floating effect for the icons
 * you pass to it.
 *
 * @param models - List of models to be used
 * @param floatOptions - Options for the floating effect
 * @returns
 */
export function FloatIcons({ models, floatOptions }: FloatIconsProps) {
    return models.map(({ model, ...rest }, index) => (
        <FloatIcon key={index} model={model} {...rest} {...floatOptions} />
    ));
}
