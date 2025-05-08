import { Vector3 } from 'three';
import type { CameraControls as CameraControlsImpl } from '@react-three/drei';

/**
 * Camera positioning on carousel -
 *
 * @description : Camera will look at the card's position
 * or center of the carousel
 *
 * @param prevCamPos - Previews camera position
 * @param cameraPositions - Camera positions
 * @param currentCamera - Camera controls ref.current
 */
export function cameraLookAt(
    newCamPosition: Vector3,
    cameraPositions: { position: Vector3; target: Vector3; fov: number },
    currentCamera: CameraControlsImpl
) {
    const { camera } = currentCamera;
    if (!newCamPosition) return;
    if ('fov' in camera) {
        camera.fov = cameraPositions.fov;
    }
    currentCamera.setLookAt(
        newCamPosition.x,
        newCamPosition.y,
        newCamPosition.z,
        cameraPositions.target.x,
        cameraPositions.target.y,
        cameraPositions.target.z,
        true
    );
    camera.updateProjectionMatrix();
}
