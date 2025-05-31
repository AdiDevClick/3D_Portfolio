import { redSphereMaterial } from '@/components/3DComponents/SpherePresence/SpherePresenceMaterials';
import { SpherePresenceTypes } from '@/components/3DComponents/SpherePresence/SpherePresenceTypes';
import { useEffect, useRef } from 'react';
import { Mesh } from 'three';

/**
 * Wireframe sphere presence Helper -
 */
export function SpherePresenceHelper({
    radius,
    debug = false,
    visible = false,
    ...props
}: SpherePresenceTypes) {
    const meshRef = useRef<Mesh>(null);

    useEffect(() => {
        if (meshRef.current) {
            const layer = debug ? 0 : 1;
            meshRef.current.layers.set(layer);
            meshRef.current.castShadow = false;
            meshRef.current.receiveShadow = false;
        }
    }, [visible, debug]);

    return (
        <mesh
            ref={meshRef}
            visible={visible}
            material={redSphereMaterial}
            {...props}
        >
            <sphereGeometry args={radius} />
        </mesh>
    );
}
