import { sharedMatrices } from '@/utils/matrices';
import { Object3D, Camera, Box3 } from 'three';

// Extend the Object3D type to include boundingbox property
declare global {
    namespace THREE {
        interface Object3D {
            boundingbox?: Box3;
        }
    }
}

interface FrustumState {
    camera: Camera;
}

let isVisible = false;

/**
 * Frustum checker function to determine if an object
 * is within the camera's frustum.
 *
 * @param refs - Object3D or array of Object3D to check visibility
 * @param state - useFrame state containing the camera
 * @param frameCount - Current frame count
 * @param isMobile - Boolean indicating if the device is mobile
 * @param options - Options for mobile and desktop time intervals and deepSearching name
 * @param deepSearching - Boolean indicating if deep searching is enabled
 */
export function frustumChecker(
    refs: Object3D | Object3D[],
    state: FrustumState,
    frameCount: number,
    isMobile: boolean,
    options = {
        mobileTime: 20,
        desktopTime: 5,
        name: 'icon',
    },
    deepSearching = false
) {
    if (!refs || !state) return false;

    const objectsArray = Array.isArray(refs) ? refs : [refs];

    if (
        frameCount % (isMobile ? options.mobileTime : options.desktopTime) ===
        0
    ) {
        sharedMatrices.frustum.setFromProjectionMatrix(
            sharedMatrices.projMatrix.multiplyMatrices(
                state.camera.projectionMatrix,
                state.camera.matrixWorldInverse
            )
        );

        if (deepSearching) {
            isVisible = deepSearch(refs as Object3D, options.name);
        } else {
            objectsArray.forEach((ref) => {
                isVisible = checkVisibility(ref);
            });
        }

        return isVisible;
    }
    return false;
}

function deepSearch(object: Object3D, name: string) {
    let visible = false;
    object.traverse((child) => {
        if (child.name && child.name.includes(name)) {
            visible = checkVisibility(child);
        }
    });
    return visible;
}

function checkVisibility(object: Object3D) {
    if (!object.boundingbox) {
        object.boundingbox = sharedMatrices.box;
    }
    object.boundingbox.setFromObject(object);
    object.visible = sharedMatrices.frustum.intersectsBox(object.boundingbox);

    return object.visible;
}
