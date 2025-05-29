import { Box3, BoxGeometry, Frustum, Matrix4 } from 'three';

type FrustumType = {
    projMatrix: Matrix4;
    worldMatrix: Matrix4;
    frustum: Frustum;
    box: Box3;
    boxGeometry: BoxGeometry;
};
/**
 * Matrices and Frustum for 3D calculations
 * This is a shared object to avoid creating new instances every frame
 *
 */
export const sharedMatrices = {
    projMatrix: new Matrix4(),
    worldMatrix: new Matrix4(),
    frustum: new Frustum(),
    box: new Box3(),
    boxGeometry: new BoxGeometry(),
} as FrustumType;
