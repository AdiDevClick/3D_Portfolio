import { RefObject } from 'react';
import { AxesHelper, Mesh } from 'three';

/**
 * Ajoute un "Helper" à l'élément 3D qui montre
 * la direction ainsi que la position de l'élément dans l'espace
 * @param size - La taille du helper
 * @param position - Montre la position
 * @param rotation - Montre la rotation
 * @param ref - La référence de l'objet 3D auquel le helper est attaché
 */
export function Helper(
    ref: RefObject<Mesh>,
    position: true = true,
    rotation: false = false,
    size: 2 = 2
) {
    if (!ref.current) return;

    const helper = new AxesHelper(size);
    if (position) helper.position.copy(ref.current.position);
    if (rotation) helper.rotation.copy(ref.current.rotation);
    return ref.current.add(helper);
}
