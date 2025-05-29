import { redSphereMaterial } from '@/components/3DComponents/SpherePresence/SpherePresenceMaterials';
import { SpherePresenceTypes } from '@/components/3DComponents/SpherePresence/SpherePresenceTypes';

/**
 * Wireframe sphere presence Helper -
 */
export function SpherePresenceHelper({
    radius,
    visible = false,
    ...props
}: SpherePresenceTypes) {
    return (
        <mesh visible={visible} material={redSphereMaterial} {...props}>
            <sphereGeometry args={radius} />
        </mesh>
    );
}
