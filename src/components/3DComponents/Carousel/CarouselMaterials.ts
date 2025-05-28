import { DoubleSide, MeshStandardMaterial } from 'three';

export const debugOrangeBox = new MeshStandardMaterial({
    color: '#ff8800',
    opacity: 0.5,
    side: DoubleSide,
    transparent: true,
});
