import {
    emissiveIntensity,
    hoveredIconColor,
} from '@/configs/3DCarousel.config';
import { MeshStandardMaterial } from 'three';

export const hoveredIconMateral = new MeshStandardMaterial({
    emissive: hoveredIconColor,
    emissiveIntensity: emissiveIntensity,
    roughness: 0.5,
    metalness: 0.5,
    color: hoveredIconColor,
});
