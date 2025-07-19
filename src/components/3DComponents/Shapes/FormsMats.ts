import { CylinderGeometry, MeshStandardMaterial } from 'three';

export const cylinderGeometry = new CylinderGeometry(1, 1, 0.1, 6);
export const hexBlackMetalMaterial = new MeshStandardMaterial({
    color: '#2a2a2a',
    roughness: 0.7,
    metalness: 0.3,
});
