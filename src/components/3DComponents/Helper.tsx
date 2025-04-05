import { RefObject } from 'react';
import { AxesHelper, Mesh } from 'three';

/**
 * Ajoute un "Helper" à l'élément 3D qui montre
 * la direction ainsi que la position de l'élément dans l'espace
 * @param [size=2] - La taille du helper
 * @param [position=true] - Montre la position
 * @param [rotation=false]  - Montre la rotation
 * @param ref - La référence de l'élément où l'on attachera le helper
 */
export function Helper(
    position = true,
    rotation = false,
    ref: RefObject<Mesh>,
    size = 2
) {
    const helper = new AxesHelper(size);
    if (position) helper.position.copy(ref.current.position);
    if (rotation) helper.rotation.copy(ref.current.rotation);
    return ref.current.add(helper);
}
