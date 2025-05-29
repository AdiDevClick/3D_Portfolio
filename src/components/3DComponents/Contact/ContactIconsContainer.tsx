import { FloatIcons } from '@/components/3DComponents/3DIcons/FloatIcons';
import {
    ContactIconsContainerProps,
    Model,
} from '@/components/3DComponents/Contact/ContactTypes';
import { Center } from '@react-three/drei';
import contactIcons from '@data/contact-icons.json';
import { IconsContainerProvider } from '@/api/contexts/IconsContainerProvider';

const floatOptions = {
    autoInvalidate: true,
    speed: 1,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

/**
 * @component ContactIconsContainer
 * @description
 * - Contains the 3D icons for contact information
 * - Use the list contactIcons list .JSON above the component to add more icons
 *
 * @param ref - Ref to be passed to the component in order to manipulate it
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
    const iconsContainerValue = {
        floatOptions,
        models: contactIcons as Model[],
        scalar,
        isMobile,
        tooltips,
    };

    return (
        <Center ref={ref}>
            <IconsContainerProvider value={iconsContainerValue}>
                <FloatIcons />
            </IconsContainerProvider>
        </Center>
    );
}
