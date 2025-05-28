import { MeshTransmissionMaterial } from '@react-three/drei';
import { MeshPhysicalMaterial } from 'three';

export const glassMaterial = MeshTransmissionMaterial({
    roughness: 0.01,
    metalness: 0.15,
    clearcoat: 0.2,
    samples: 18,
    thickness: 1,
    chromaticAberration: 0.15,
    anisotropy: 0.6,
    resolution: 512,
    distortion: 0.01,
    ior: 1.3,
});

export const glassMaterialMobile = MeshTransmissionMaterial({
    roughness: 0.01,
    metalness: 0.1,
    clearcoat: 0.2,
    samples: 2,
    thickness: 1,
    chromaticAberration: 0.15,
    anisotropy: 0,
    resolution: 128,
    distortion: 0,
    ior: 1.5,
});

// <MeshTransmissionMaterial
//             roughness={0.01}
//             metalness={isMobile ? 0.1 : 0.15}
//             clearcoat={0.2}
//             samples={isMobile ? 2 : 18}
//             thickness={1}
//             chromaticAberration={0.15}
//             anisotropy={isMobile ? 0 : 0.6}
//             resolution={isMobile ? 128 : 512}
//             distortion={isMobile ? 0 : 0.01}
//             ior={isMobile ? 1.5 : 1.3}
//         />
