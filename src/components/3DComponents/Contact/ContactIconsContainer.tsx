import { FloatIcons } from '@/components/3DComponents/3DIcons/FloatIcons';
import {
    ContactIconsContainerProps,
    Model,
} from '@/components/3DComponents/Contact/ContactTypes';
import { Center } from '@react-three/drei';

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
    floatingRange: [-0.1, 0.1] as [number, number],
};

const LinkedIn = `${
    import.meta.env.BASE_URL
}assets/models/optimized/Linkedin_model.glb`;
const GitHub = `${
    import.meta.env.BASE_URL
}assets/models/optimized/Github_model.glb`;

const iconsList: Model[] = [
    {
        name: 'LinkedIn',
        model: LinkedIn,
        rotation: [0, 3, 0],
        position: [-0.6, 0, 0],
    },
    {
        name: 'GitHub',
        model: GitHub,
        rotation: [0, 3, 0],
        position: [0, 0, 0],
    },
];

/**
 * ContactIcons component
 * @description Contains the 3D icons for contact information
 * Use the list above to add more icons
 *
 * @param ref - Ref to be passed to the component
 */
export function ContactIconsContainer({ ref }: ContactIconsContainerProps) {
    return (
        <Center ref={ref}>
            <FloatIcons models={iconsList} floatOptions={floatOptions} />
        </Center>
    );
}
