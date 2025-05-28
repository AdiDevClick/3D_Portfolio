import { sharedMatrices } from '@/utils/matrices';
import { Object3D, Camera, Box3, Vector3 } from 'three';

// Extend the Object3D type to include boundingbox property
type Object3DWithBoundingBox = Object3D & {
    boundingbox?: Box3;
};

interface FrustumState {
    camera: Camera;
}

let isVisible = false;

/**
 * Frustum checker function to determine if an object
 * is within the camera's frustum.
 *
 * @param elements - Object3D or array of Object3D to check visibility
 * @param state - useFrame state containing the camera
 * @param frameCount - Current frame count
 * @param isMobile - Boolean indicating if the device is mobile
 * @param options - Options for mobile and desktop time intervals and deepSearching name
 * @param deepSearching - Boolean indicating if deep searching is enabled
 */
export function frustumChecker(
    elements: Object3D | Object3D[],
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
    if (!elements || !state) return false;

    const objectsArray = Array.isArray(elements) ? elements : [elements];

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
            isVisible = deepSearch(elements as Object3D, options.name);
        } else {
            objectsArray.forEach((ref) => {
                isVisible = updateVisibilityAndSize(ref);
            });
        }
        return isVisible;
    }
    return false;
}

/**
 * Recursively searches through the children of an Object3D
 * to find any child with the specified name.
 * If found, it checks it's visibility and updates it's value.
 *
 * @param object - The Object3D to search within
 * @param name - The name to search for within the object's children
 */
function deepSearch(object: Object3D, name: string) {
    let visible = false;
    object.traverse((child) => {
        if (child.name && child.name.includes(name)) {
            visible = updateVisibilityAndSize(child);
        }
    });
    return visible;
}

/**
 * Check visibility of an Object3D within the camera's frustum.
 * @description This will update its bounding box and content size and
 * will update it's visibility status.
 *
 * @param object - The Object3D to check visibility for
 */
function updateVisibilityAndSize(object: Object3D) {
    const obj = object as Object3DWithBoundingBox;
    if (!obj.boundingbox) {
        obj.boundingbox = sharedMatrices.box;
    }
    obj.boundingbox.setFromObject(object);

    // Add content size to userData
    const contentSize = new Vector3();
    obj.boundingbox.getSize(contentSize);
    if (contentSize.x > 0 && contentSize.y > 0 && contentSize.z > 0) {
        obj.userData.contentSize = contentSize.clone();
    }

    // Update visibility on intersection
    obj.visible = sharedMatrices.frustum.intersectsBox(obj.boundingbox);

    return obj.visible;
}
