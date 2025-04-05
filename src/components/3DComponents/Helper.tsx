import { AxesHelper } from 'three';

export function Helper(position = true, rotation = false, ref, size = 2) {
    const helper = new AxesHelper(size);
    if (position) helper.position.copy(ref.current.position);
    if (rotation) helper.rotation.copy(ref.current.rotation);
    return ref.current.add(helper);
}
