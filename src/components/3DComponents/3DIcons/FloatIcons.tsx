import { IconsContainerContext } from '@/api/contexts/IconsContainerProvider';
import { FloatIcon } from '@/components/3DComponents/3DIcons/FloatIcon';
import { ContactIconsContainerProviderTypes } from '@/components/3DComponents/Contact/ContactTypes';
import { use } from 'react';

/**
 * @component FloatIcons
 *
 * @description
 * - This component will create a floating effect for the icons
 * you pass to it.
 * - Use the Model to define the icon models and their properties.
 * - The icons can be clicked to open a link if its specified in the Model.
 * - The icons will be hovered and a color will trigger.
 */
export function FloatIcons() {
    const { models, isMobile } = use(
        IconsContainerContext
    ) as ContactIconsContainerProviderTypes;

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
            {...rest}
        />
    ));
}
