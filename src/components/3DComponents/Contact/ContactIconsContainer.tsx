import { FloatIcons } from '@/components/3DComponents/3DIcons/FloatIcons';
import {
    ContactIconsContainerProps,
    Model,
} from '@/components/3DComponents/Contact/ContactTypes';
import { Center } from '@react-three/drei';
import contactIcons from '@data/contact-icons.json';

const floatOptions = {
    autoInvalidate: true,
    speed: 1,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

/**
 * ContactIcons component
 * @description Contains the 3D icons for contact information
 * Use the list above to add more icons
 *
 * @param ref - Ref to be passed to the component
 * @param scalar - Scale factor for the icons
 * @param isMobile - Whether the icons should be displayed in mobile mode
 * @param tooltips **@default=true** - Whether to show tooltips on hover
 */
export function ContactIconsContainer({
    ref,
    scalar,
    isMobile = false,
    tooltips = true,
}: ContactIconsContainerProps) {
    return (
        <Center ref={ref}>
            <FloatIcons
                models={contactIcons as Model[]}
                scalar={scalar}
                isMobile={isMobile}
                floatOptions={floatOptions}
                tooltips={tooltips}
            />
        </Center>
    );
}
