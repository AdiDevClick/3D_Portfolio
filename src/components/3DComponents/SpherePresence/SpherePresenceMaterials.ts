import { MeshStandardMaterial } from 'three';

export const redSphereMaterial = new MeshStandardMaterial({
    color: '#ff0000',
    wireframe: true,
    transparent: true,
    opacity: 0.5,
});
