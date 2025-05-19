import { RefObject, useCallback } from 'react';
import { Box3, Vector3 } from 'three';
import { ElementType } from '@/hooks/reducers/carouselTypes';
import { CameraControls } from '@react-three/drei';
import { shortestAnglePath } from '@/components/3DComponents/Carousel/Functions';

// interface ControlsRef {
//     camera: Camera;
//     setLookAt: (
//         positionX: number,
//         positionY: number,
//         positionZ: number,
//         targetX: number,
//         targetY: number,
//         targetZ: number,
//         enableTransition?: boolean
//     ) => void;
// }
const CAMERA_ANGLE_OFFSET = Math.PI / 28;
const ACTIVE_FORWARD_OFFSET = 10.5;
const CAMERA_SAFETY_MARGIN = 8;
const EXTRA_PULLBACK_MOBILE = 5.5;
const EXTRA_PULLBACK_DESKTOP = 3.5;
const ANGLELIMITS = Math.PI / 9; // ~20 degrés

/**
 * Hook pour gérer le positionnement de la caméra vers une carte
 * @returns Une fonction pour positionner la caméra vers une carte
 */
export function useCameraPositioning() {
    /**
     * Positionne la caméra pour cibler une carte active
     * @param controlsRef - Référence aux contrôles de caméra
     * @param cardProps - Propriétés de la carte à cibler
     * @param isMobile - Indicateur du mode mobile
     * @param isClicked - Si la carte est cliquée (pour un positionnement spécifique)
     * @param lerpFactor - Facteur d'interpolation (optionnel, par défaut 0.6)
     */
    const positionCameraToCard = useCallback(
        (
            controlsRef: RefObject<CameraControls>,
            cardProps: ElementType,
            isMobile: boolean,
            isClicked = false,
            lerpFactor = 0.6
        ) => {
            if (!cardProps.ref?.current || !controlsRef?.current) return;
            const { camera } = controlsRef.current;
            const { cardAngles, ref, containerScale } = cardProps;

            // Retrieve the current camera angle
            const currentCameraAngle = Math.atan2(
                camera.position.x,
                camera.position.z
            );

            const effectiveLerpFactor = isClicked
                ? Math.min(0.85, lerpFactor * 1.5)
                : lerpFactor;

            const desiredAngle = cardAngles.active + CAMERA_ANGLE_OFFSET;

            const angleDelta = shortestAnglePath(
                currentCameraAngle,
                desiredAngle
            );

            const newAngle = isClicked
                ? desiredAngle
                : currentCameraAngle + angleDelta * effectiveLerpFactor;

            // Camera position from the center of the circle
            const finalDesiredRadius =
                containerScale +
                ACTIVE_FORWARD_OFFSET +
                (isMobile ? EXTRA_PULLBACK_MOBILE : EXTRA_PULLBACK_DESKTOP);

            const camTargetPos = ref.current.position.clone();

            // Calculate offset from object size for vertical centering
            const bbox = new Box3().setFromObject(ref.current);
            const sizeObj = new Vector3();
            bbox.getSize(sizeObj);
            const verticalCenterOffset = sizeObj.y / 5;

            const camPos = new Vector3(
                Math.sin(newAngle) * finalDesiredRadius,
                camTargetPos.y + verticalCenterOffset,
                Math.cos(newAngle) * finalDesiredRadius
            );

            // Adding interpolation to the camera position
            // const newCamPos = camera.position.clone().lerp(camPos, lerpFactor);
            // Exactly the same position as the card
            const newCamPos = isClicked
                ? camPos.clone()
                : camera.position.clone().lerp(camPos, effectiveLerpFactor);
            const newTarget = camTargetPos.clone();

            // Adding a small offset to the target position (if clicked and not mobile)
            const rightVector = new Vector3(1, 0, 0);
            rightVector.applyQuaternion(ref.current.quaternion);

            const offsetDistance = !isMobile && isClicked ? 2 : 0;
            const rightOffset = rightVector.multiplyScalar(offsetDistance);

            // Final position
            const shiftedTarget = newTarget.clone().add(rightOffset);

            if (isMobile && isClicked) {
                newCamPos.z *= 1.05;
                shiftedTarget.y += 0.5;
            }
            // !! IMPORTANT !! Modify FOV if mobile
            camera.fov = isMobile ? 19 : 20;

            const distanceToCenter = Math.sqrt(
                newCamPos.x * newCamPos.x + newCamPos.z * newCamPos.z
            );

            // Too close? Scale the camera position
            const minDistanceToCenter = containerScale + CAMERA_SAFETY_MARGIN;
            if (distanceToCenter < minDistanceToCenter) {
                const scale = minDistanceToCenter / distanceToCenter;
                newCamPos.x *= scale;
                newCamPos.z *= scale;
            }
            controlsRef.current.setLookAt(
                newCamPos.x,
                newCamPos.y,
                newCamPos.z,
                shiftedTarget.x,
                isClicked && isMobile ? shiftedTarget.y - 1.5 : shiftedTarget.y,
                shiftedTarget.z,
                // Animation ?
                !(isClicked && isMobile)
            );

            camera.updateProjectionMatrix();

            return {
                cameraPosition: newCamPos,
                targetPosition: shiftedTarget,
                angleLimits: isClicked
                    ? {
                          min: desiredAngle - ANGLELIMITS,
                          max: desiredAngle + ANGLELIMITS,
                          default: desiredAngle,
                      }
                    : { min: -Infinity, max: Infinity },
            };
        },
        []
    );

    return { positionCameraToCard };
}
