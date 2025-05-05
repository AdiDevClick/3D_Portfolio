import { RefObject } from 'react';
import { Mesh, Object3D } from 'three';

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

type ObjectType = Object3D & {
    geometry: any;
    material: any;
};
/**
 * Retourne un objet contenant les différentes
 * positions d'un objet en fonction de son centre -
 */
export function getSidesPositions(
    _: recuderTypes,
    refObject: RefObject<ObjectType>
): sidesPositions {
    if (!refObject.current || !refObject.current.geometry) return null;

    const { height, width, depth = 0 } = refObject.current.geometry.parameters;
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
