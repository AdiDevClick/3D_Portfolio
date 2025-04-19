import { RefObject, useCallback } from 'react';
import { Box3, Vector3 } from 'three';
import { ElementType } from '@/hooks/reducers/carouselTypes';
import { CameraControls } from '@react-three/drei';

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

            // Position offset
            const activeForwardOffset = 10.5;
            const extraPullback = isMobile ? 5.5 : 3.5;
            const desiredAngle = cardAngles.active + Math.PI / 28;

            // Camera position from the center of the circle
            const finalDesiredRadius =
                containerScale + activeForwardOffset + extraPullback;

            const camTargetPos = ref.current.position.clone();

            // Calculate offset from object size
            const bbox = new Box3().setFromObject(ref.current);
            const sizeObj = new Vector3();
            bbox.getSize(sizeObj);
            const verticalCenterOffset = sizeObj.y / 5;

            const camPos = new Vector3(
                Math.sin(desiredAngle) * finalDesiredRadius,
                camTargetPos.y + verticalCenterOffset,
                Math.cos(desiredAngle) * finalDesiredRadius
            );

            // Adding interpolation to the camera position
            const newCamPos = camera.position.clone().lerp(camPos, lerpFactor);
            const newTarget = camTargetPos.clone();

            // Adding a small offset to the target position (if clicked and not mobile)
            const rightVector = new Vector3(1, 0, 0);
            rightVector.applyQuaternion(ref.current.quaternion);
            const offsetDistance = !isMobile && isClicked ? 2 : 0;
            const rightOffset = rightVector.multiplyScalar(offsetDistance);

            // Final position
            const shiftedTarget = newTarget.clone().add(rightOffset);

            // !! IMPORTANT !! Modify FOV if mobile
            camera.fov = isMobile ? 19 : 20;

            controlsRef.current.setLookAt(
                newCamPos.x,
                newCamPos.y,
                newCamPos.z,
                shiftedTarget.x,
                isClicked && isMobile ? shiftedTarget.y - 1.5 : shiftedTarget.y,
                shiftedTarget.z,
                true // Animation ?
            );

            camera.updateProjectionMatrix();

            return {
                cameraPosition: newCamPos,
                targetPosition: shiftedTarget,
            };
        },
        []
    );

    return { positionCameraToCard };
}
