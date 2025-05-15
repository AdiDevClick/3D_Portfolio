import { RefObject } from 'react';
import { Box3, Object3D, Vector3 } from 'three';

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

export function getSidesPositions2(refObject: ObjectType): sidesPositions {
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

/**
 * Returns the sides positions of an object
 *
 * @description It creates a bounding box around the object and returns the sides positions
 *
 * @param refObject - Object3D ref
 */
export function getSidesPositionsUniversal(
    refObject: RefObject<Object3D>
): sidesPositions {
    if (!refObject.current) return null;

    const bbox = new Box3().setFromObject(refObject.current);
    const size = new Vector3();
    const center = new Vector3();

    bbox.getSize(size);
    bbox.getCenter(center);

    return {
        bottom: center.y - size.y / 2,
        top: center.y + size.y / 2,
        left: center.x - size.x / 2,
        right: center.x + size.x / 2,
        front: center.z + size.z / 2,
        back: center.z - size.z / 2,
    };
}
