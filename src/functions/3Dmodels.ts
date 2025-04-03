import { Mesh } from 'three';

type sidesPositions = {
    bottom: number;
    top: number;
    left: number;
    right: number;
    front: number | null;
    back: number | null;
} | null;

type recuderTypes = {
    position: { x: number; y: number; z: number };
};
/**
 * Retourne un objet contenant les différentes
 * positions d'un objet en fonction de son centre -
 */
export function getSidesPositions(
    reducerObject: recuderTypes,
    refObject: Mesh
): sidesPositions {
    if (!refObject.current) return null;

    const { height, width, depth } = refObject.current.geometry.parameters;
    const { x, y, z } = refObject.current.position;

    const bottom = y - height / 2;
    const top = y + height / 2;
    const left = x - width / 2;
    const right = x + width / 2;

    let front = z;
    let back = z;

    if (z) {
        front = z + depth / 2;
        back = z - depth / 2;
    }

    return { bottom, top, left, right, front, back };
}

export function getSidesPositions2(refObject: Mesh): sidesPositions {
    if (!refObject) return null;

    let { height, width, depth } = refObject.geometry.parameters;
    const { x, y, z } = refObject.position;

    if (depth === undefined) {
        depth = 0;
    }
    const bottom = y - height / 2;
    const top = y + height / 2;

    const left = x - width / 2;
    const right = x + width / 2;

    const front = z + depth / 2;
    const back = z - depth / 2;

    return { bottom, top, left, right, front, back };
}
