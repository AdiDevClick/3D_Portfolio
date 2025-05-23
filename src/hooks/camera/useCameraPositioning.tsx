import { RefObject, useCallback } from 'react';
import { Box3, Vector3 } from 'three';
import { ElementType } from '@/hooks/reducers/carouselTypes';
import { CameraControls } from '@react-three/drei';
import { shortestAnglePath } from '@/components/3DComponents/Carousel/Functions';
import {
    CAMERA_ACTIVE_FORWARD_OFFSET,
    CAMERA_ANGLE_OFFSET,
    CAMERA_ANGLELIMITS,
    CAMERA_CLICKED_DESKTOP_OFFSET,
    CAMERA_CLICKED_LERP_MULTIPLIER,
    CAMERA_CLICKED_MAX_LERP_FACTOR,
    CAMERA_CLICKED_MOBILE_OFFSET,
    CAMERA_EDGE_COMPENSATION_FACTOR,
    CAMERA_EDGE_LERP_FACTOR,
    CAMERA_EXTRA_PULLBACK_DESKTOP,
    CAMERA_EXTRA_PULLBACK_MOBILE,
    CAMERA_FOV_DESKTOP,
    CAMERA_FOV_MOBILE,
    CAMERA_HOVER_DESKTOP_OFFSET,
    CAMERA_HOVER_PULLBACK_DESKTOP,
    CAMERA_MAX_EDGE_COMPENSATION,
    CAMERA_MOBILE_Y_POSITION,
    CAMERA_MOBILE_Z_POSITION,
    CAMERA_OFFSET_EDGE_ADJUSTMENT,
    CAMERA_SAFETY_MARGIN,
    CAMERA_VERTICAL_CENTER_DIVISOR,
} from '@/configs/Camera.config';

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

            const desiredAngle = cardAngles.active + CAMERA_ANGLE_OFFSET;

            const angleDelta = shortestAnglePath(
                currentCameraAngle,
                desiredAngle
            );

            const absDelta = Math.abs(angleDelta);
            const angleFactor = Math.min(1, absDelta / Math.PI);
            const initialImpulse = 0.2;
            // !! IMPORTANT !! Modify the lerp factor to rotate
            // a bit faster to the cards on the edges
            const adaptiveLerpFactor =
                lerpFactor * (1 + angleFactor * CAMERA_EDGE_LERP_FACTOR);
            const edgeCompensation = Math.min(
                CAMERA_MAX_EDGE_COMPENSATION,
                angleFactor * CAMERA_EDGE_COMPENSATION_FACTOR
            );

            const effectiveLerpFactor = isClicked
                ? Math.min(
                      CAMERA_CLICKED_MAX_LERP_FACTOR,
                      adaptiveLerpFactor * CAMERA_CLICKED_LERP_MULTIPLIER
                  )
                : Math.max(initialImpulse, adaptiveLerpFactor);
            // const effectiveLerpFactor = isClicked
            //     ? Math.min(
            //           CAMERA_CLICKED_MAX_LERP_FACTOR,
            //           adaptiveLerpFactor * CAMERA_CLICKED_LERP_MULTIPLIER
            //       )
            //     : adaptiveLerpFactor;

            let newAngle = isClicked
                ? desiredAngle
                : currentCameraAngle + angleDelta * effectiveLerpFactor;
            if (!isClicked && Math.abs(angleDelta) > 0.01) {
                const initialDirection = angleDelta > 0 ? 1 : -1;
                const initialPush =
                    initialDirection *
                    Math.min(0.05, Math.abs(angleDelta) * 0.1);
                newAngle += initialPush;
            }
            // Camera position from the center of the circle
            // const finalDesiredRadius =
            //     containerScale +
            //     CAMERA_ACTIVE_FORWARD_OFFSET * (1 - edgeCompensation) +
            //     (isMobile
            //         ? CAMERA_EXTRA_PULLBACK_MOBILE
            //         : CAMERA_EXTRA_PULLBACK_DESKTOP);

            const finalDesiredRadius =
                containerScale +
                CAMERA_ACTIVE_FORWARD_OFFSET * (1 - edgeCompensation) +
                (isMobile
                    ? CAMERA_EXTRA_PULLBACK_MOBILE
                    : isClicked
                    ? CAMERA_EXTRA_PULLBACK_DESKTOP
                    : CAMERA_HOVER_PULLBACK_DESKTOP);

            const camTargetPos = ref.current.position.clone();

            // Calculate offset from object size for vertical centering
            const bbox = new Box3().setFromObject(ref.current);
            const sizeObj = new Vector3();
            bbox.getSize(sizeObj);
            const verticalCenterOffset =
                sizeObj.y / CAMERA_VERTICAL_CENTER_DIVISOR;

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

            // const offsetDistance =
            //     (!isMobile && isClicked
            //         ? CAMERA_CLICKED_DESKTOP_OFFSET
            //         : CAMERA_CLICKED_MOBILE_OFFSET) *
            //     (1 - angleFactor * CAMERA_OFFSET_EDGE_ADJUSTMENT);
            const offsetDistance =
                (!isMobile
                    ? isClicked
                        ? CAMERA_CLICKED_DESKTOP_OFFSET
                        : CAMERA_HOVER_DESKTOP_OFFSET
                    : CAMERA_CLICKED_MOBILE_OFFSET) *
                (1 - angleFactor * CAMERA_OFFSET_EDGE_ADJUSTMENT);

            const rightOffset = rightVector.multiplyScalar(offsetDistance);

            // Final position
            const shiftedTarget = newTarget.clone().add(rightOffset);

            // !! IMPORTANT !! Modify FOV if mobile
            camera.fov = isMobile ? CAMERA_FOV_MOBILE : CAMERA_FOV_DESKTOP;

            const distanceToCenter = Math.sqrt(
                newCamPos.x * newCamPos.x + newCamPos.z * newCamPos.z
            );

            if (isMobile && isClicked) {
                newCamPos.z *= CAMERA_MOBILE_Z_POSITION;
                shiftedTarget.y += CAMERA_MOBILE_Y_POSITION;
            }

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
                          min: desiredAngle - CAMERA_ANGLELIMITS,
                          max: desiredAngle + CAMERA_ANGLELIMITS,
                          default: desiredAngle,
                      }
                    : { min: -Infinity, max: Infinity },
            };
        },
        []
    );

    return { positionCameraToCard };
}
