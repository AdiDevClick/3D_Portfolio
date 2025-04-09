import { RefObject } from 'react';
import { AxesHelper, Mesh } from 'three';

/**
 * Ajoute un "Helper" à l'élément 3D qui montre
 * la direction ainsi que la position de l'élément dans l'espace
 * @param size - La taille du helper.
 * @param position **@default=true** - Montre la position.
 * @param rotation **@default=false** - Montre la rotation.
 * @param ref **@default=2** - La référence de l'objet 3D auquel le helper est attaché.
 */
export function useHelper(
    ref: RefObject<Mesh>,
    position = true,
    rotation = false,
    size = 2
) {
    if (!ref.current) return;

    const helper = new AxesHelper(size);
    if (position) helper.position.copy(ref.current.position);
    if (rotation) helper.rotation.copy(ref.current.rotation);
    return ref.current.add(helper);
}
