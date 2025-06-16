import { RefObject, useCallback } from 'react';
import { Vector3 } from 'three';
import { ElementType } from '@/hooks/reducers/carouselTypes';
import { CameraControls } from '@react-three/drei';
import { shortestAnglePath } from '@/components/3DComponents/Carousel/Functions';
import {
    CAMERA_ACTIVE_FORWARD_OFFSET,
    CAMERA_ANGLE_OFFSET,
    CAMERA_ANGLELIMITS,
    CAMERA_CLICKED_DESKTOP_CARD_SAFETY_MARGIN,
    CAMERA_CLICKED_DESKTOP_OFFSET,
    CAMERA_CLICKED_LERP_MULTIPLIER,
    CAMERA_CLICKED_MAX_LERP_FACTOR,
    CAMERA_CLICKED_MOBILE_OFFSET,
    CAMERA_DISTANCE_DESKTOP_MULTIPLIER,
    CAMERA_DISTANCE_MOBILE_MULTIPLIER,
    CAMERA_EDGE_COMPENSATION_FACTOR,
    CAMERA_EDGE_LERP_FACTOR,
    CAMERA_EXTRA_PULLBACK_DESKTOP,
    CAMERA_EXTRA_PULLBACK_MOBILE,
    CAMERA_FOV_DESKTOP,
    CAMERA_FOV_MOBILE,
    CAMERA_HOVER_DESKTOP_OFFSET,
    CAMERA_HOVER_PULLBACK_DESKTOP,
    CAMERA_MAX_EDGE_COMPENSATION,
    CAMERA_OFFSET_EDGE_ADJUSTMENT,
    CAMERA_SAFETY_MARGIN,
    CAMERA_VERTICAL_CENTER_DIVISOR,
    FOCUS_DELAY_MOBILE,
} from '@/configs/Camera.config';
import { sharedMatrices } from '@/utils/matrices';
import {
    CameraCalculationParams,
    CameraPositionResult,
    TargetCalculationParams,
} from '@/hooks/camera/cameraTypes';

/**
 * Calculates the new camera angle and effective lerp factor
 * based on the current and desired angles.
 *
 * @param params - Parameters for camera angle and lerp calculation
 */
function calculateCameraAngleAndLerp(
    params: CameraCalculationParams
): CameraPositionResult {
    const {
        currentCameraAngle,
        desiredAngle,
        angleDelta,
        isClicked,
        lerpFactor,
        isMobile,
    } = params;

    const absDelta = Math.abs(angleDelta);
    const angleFactor = Math.min(1, absDelta / Math.PI);
    const initialImpulse = 0.2;

    // Adaptive lerp factor and edge compensation
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

    // New angle calculation
    let newAngle = isClicked
        ? desiredAngle
        : currentCameraAngle + angleDelta * effectiveLerpFactor;

    // Not clicked ? Apply initial push based on angle delta
    if (!isClicked && Math.abs(angleDelta) > 0.01) {
        const initialDirection = angleDelta > 0 ? 1 : -1;
        const initialPush =
            initialDirection * Math.min(0.05, Math.abs(angleDelta) * 0.1);
        newAngle += initialPush;
    }

    return { newAngle, effectiveLerpFactor, edgeCompensation };
}
const sizeObj = new Vector3();
/**
 * Calculates the camera position based on the new angle and other parameters.
 *
 * @param newAngle - The new angle for the camera
 * @param edgeCompensation - Compensation for edge effects based on angle
 * @param containerScale - Scale of the container for camera positioning
 * @param camTargetPos - The target position of the camera, typically the center of the card
 * @param ref - Reference to the card element
 * @param isMobile - Boolean indicating if the device is mobile
 * @param isClicked - Boolean indicating if the card is clicked
 */
// function calculateCameraPosition(
//     newAngle: number,
//     edgeCompensation: number,
//     containerScale: number,
//     camTargetPos: Vector3,
//     ref: ElementType['ref'],
//     isMobile: boolean,
//     isClicked: boolean
// ): Vector3 {
//     if (!ref?.current) return new Vector3(0, 0, 0);

//     const basePullback = isMobile
//         ? CAMERA_EXTRA_PULLBACK_MOBILE
//         : isClicked
//         ? CAMERA_EXTRA_PULLBACK_DESKTOP
//         : CAMERA_HOVER_PULLBACK_DESKTOP;

//     const finalDesiredRadius =
//         containerScale +
//         CAMERA_ACTIVE_FORWARD_OFFSET * (1 - edgeCompensation) +
//         basePullback;

//     if (isMobile && isClicked) {
//         const worldPos = new Vector3();
//         ref.current.getWorldPosition(worldPos);

//         return new Vector3(
//             worldPos.x,
//             camTargetPos.y,
//             worldPos.z + finalDesiredRadius
//         );
//     }

//     const calculatedDistance = finalDesiredRadius;

//     const minDistance = containerScale * 3;
//     const safeDistance = Math.max(calculatedDistance, minDistance);

//     return new Vector3(
//         Math.sin(newAngle) * safeDistance,
//         camTargetPos.y,
//         Math.cos(newAngle) * safeDistance
//     );
// }

function calculateCameraPosition(
    newAngle: number,
    edgeCompensation: number,
    containerScale: number,
    camTargetPos: Vector3,
    ref: ElementType['ref'],
    isMobile: boolean,
    isClicked: boolean
): Vector3 {
    if (!ref?.current) return new Vector3(0, 0, 0);
    // const finalDesiredRadius =
    //     containerScale + CAMERA_ACTIVE_FORWARD_OFFSET * (1 - edgeCompensation);
    // const verticalCenterOffset = sizeObj.y / CAMERA_VERTICAL_CENTER_DIVISOR;
    // const basePullback = isMobile
    //     ? CAMERA_EXTRA_PULLBACK_MOBILE
    //     : isClicked
    //     ? CAMERA_EXTRA_PULLBACK_DESKTOP
    //     : CAMERA_HOVER_PULLBACK_DESKTOP;

    // const finalDesiredRadius =
    //     containerScale +
    //     CAMERA_ACTIVE_FORWARD_OFFSET * (1 - edgeCompensation) +
    //     basePullback;
    // // const verticalCenterOffset = sizeObj.y / CAMERA_VERTICAL_CENTER_DIVISOR;
    // // mobile cliquée
    // if (isMobile && isClicked) {
    //     const verticalCenterOffset = containerScale * 0.25;
    //     const finalDesiredRadius =
    //         containerScale * CAMERA_DISTANCE_MOBILE_MULTIPLIER;

    //     ref.current.getWorldPosition(sizeObj);

    //     return sizeObj.set(
    //         sizeObj.x,
    //         camTargetPos.y + verticalCenterOffset,
    //         sizeObj.z + finalDesiredRadius
    //     );
    // }

    // const baseDistance = isMobile
    //     ? containerScale * CAMERA_DISTANCE_MOBILE_MULTIPLIER
    //     : containerScale * CAMERA_DISTANCE_DESKTOP_MULTIPLIER;

    // const totalDistance = baseDistance + edgeCompensation;
    // const x = Math.sin(newAngle) * totalDistance;
    // const z = Math.cos(newAngle) * totalDistance;

    // // pour desktop cliqué
    // if (isClicked && !isMobile) {
    //     const currentDistance = Math.sqrt(x * x + z * z);
    //     const minClickedDistance = containerScale * 6.5;

    //     if (currentDistance < minClickedDistance) {
    //         const scaleFactor = minClickedDistance / currentDistance;
    //         return sizeObj.set(
    //             x * scaleFactor,
    //             camTargetPos.y,
    //             z * scaleFactor
    //         );
    //     }
    // }
    const finalDesiredRadius =
        containerScale +
        CAMERA_ACTIVE_FORWARD_OFFSET * (1 - edgeCompensation) +
        (isMobile
            ? CAMERA_EXTRA_PULLBACK_MOBILE
            : isClicked
            ? CAMERA_EXTRA_PULLBACK_DESKTOP
            : CAMERA_HOVER_PULLBACK_DESKTOP);

    if (isMobile && isClicked) {
        const cardWorldPos = new Vector3();
        ref.current.getWorldPosition(cardWorldPos);

        return new Vector3(
            cardWorldPos.x,
            camTargetPos.y,
            cardWorldPos.z + finalDesiredRadius
        );
    }

    const baseDistance = isMobile
        ? containerScale * CAMERA_DISTANCE_MOBILE_MULTIPLIER
        : containerScale * CAMERA_DISTANCE_DESKTOP_MULTIPLIER;
    const totalDistance = baseDistance + edgeCompensation;
    const x = Math.sin(newAngle) * totalDistance;
    const z = Math.cos(newAngle) * totalDistance;

    if (isClicked && !isMobile) {
        const vec = new Vector3(x, camTargetPos.y, z);
        const safeCameraPos = applySafetyDistance(
            vec,
            containerScale,
            CAMERA_CLICKED_DESKTOP_CARD_SAFETY_MARGIN
        );
        // const currentDistance = Math.sqrt(x * x + z * z);
        // const minClickedDistance = containerScale * 6.5;
        // if (currentDistance < minClickedDistance) {
        //     const scaleFactor = minClickedDistance / currentDistance;
        //     sizeObj.set(x * scaleFactor, camTargetPos.y, z * scaleFactor);
        //     console.log(sizeObj);
        //     return sizeObj;
        // }
        // console.log(safeCameraPos);
        return sizeObj.set(safeCameraPos.x, safeCameraPos.y, safeCameraPos.z);
    }

    return new Vector3(
        Math.sin(newAngle) * finalDesiredRadius,
        camTargetPos.y,
        Math.cos(newAngle) * finalDesiredRadius
    );
}

/**
 * Calculates the target position for the camera with an offset.
 *
 * @description Adjusts the target position based on whether the camera is clicked or hovered
 * @param params - Parameters for target calculation
 */
function calculateTargetWithOffset(params: TargetCalculationParams): Vector3 {
    const { ref, isClicked, isMobile, angleFactor } = params;
    const rightVector = new Vector3(1, 0, 0);

    if (!ref?.current) return rightVector;

    const camTargetPos = ref.current.position.clone();
    // if (isMobile && isClicked) {
    //     return camTargetPos.clone();
    // }
    // Right vector adjustment
    rightVector.applyQuaternion(ref.current.quaternion);

    // Offset distance calculation
    const offsetDistance =
        (!isMobile
            ? isClicked
                ? CAMERA_CLICKED_DESKTOP_OFFSET
                : CAMERA_HOVER_DESKTOP_OFFSET
            : CAMERA_CLICKED_MOBILE_OFFSET) *
        (1 - angleFactor * CAMERA_OFFSET_EDGE_ADJUSTMENT);

    const rightOffset = rightVector.multiplyScalar(offsetDistance);

    return camTargetPos.clone().add(rightOffset);
}

/**
 * Applies a safety distance to the camera position
 *
 * @description Ensures the camera won't get too close to the center of the container
 *
 * @param newCamPos - The new camera position to adjust
 * @param containerScale - The scale of the container to ensure the camera is positioned safely
 * @param cafeCameraMargin **Default=CAMERA_SAFETY_MARGIN** - The safety margin to apply
 */
function applySafetyDistance(
    newCamPos: Vector3,
    containerScale: number,
    cafeCameraMargin = CAMERA_SAFETY_MARGIN
): Vector3 {
    const distanceToCenter = Math.sqrt(
        newCamPos.x * newCamPos.x + newCamPos.z * newCamPos.z
    );
    const minDistanceToCenter = containerScale * cafeCameraMargin;

    if (distanceToCenter < minDistanceToCenter) {
        const scale = minDistanceToCenter / distanceToCenter;
        return newCamPos.set(
            newCamPos.x * scale,
            newCamPos.y,
            newCamPos.z * scale
        );
    }

    return newCamPos;
}

/**
 * Calculates the angle limits for the camera based on whether the card is clicked or not.
 *
 * @description If the card is clicked, the user won't freely move
 * the camera above a certain angle.
 *
 * @param isClicked - Boolean indicating if the card is clicked
 * @param desiredAngle - The desired angle for the camera
 */
function calculateAngleLimits(isClicked: boolean, desiredAngle: number) {
    return isClicked
        ? {
              min: desiredAngle - CAMERA_ANGLELIMITS,
              max: desiredAngle + CAMERA_ANGLELIMITS,
              default: desiredAngle,
          }
        : { min: -Infinity, max: Infinity };
}

/**
 * Calculates the limits for the truck movement based on the card's position.
 *
 * @description Enabled only when the card is clicked
 *
 * @param cardRef - Reference to the card element
 */
function calculateTruckLimits(cardRef: ElementType['ref']) {
    if (!cardRef?.current) return {};
    return {
        minX: cardRef?.current.position.x,
        maxX: cardRef?.current.position.x,
        minY: cardRef.current.position.y - 20,
        maxY: cardRef.current.position.y + 0.1,
        minZ: cardRef.current.position.z - 0.1,
        maxZ: cardRef.current.position.z + 0.1,
    };
}

/**
 * Handles the fitToSphere logic for mobile devices
 *
 * @description Timed execution to ensure the camera fits the sphere
 * then lowers the camera to focus a part of the HTML content.
 *
 * @param controlsRef - Reference to the CameraControls
 * @param cardProps - Properties of the card element
 */
function handleMobileFitToSphere(
    controlsRef: RefObject<CameraControls>,
    cardProps: ElementType
): Vector3 | undefined {
    if (!cardProps.presenceSphere) return undefined;

    setTimeout(() => {
        if (cardProps.presenceSphere && controlsRef.current) {
            controlsRef.current.fitToSphere(cardProps.presenceSphere, true);
        }

        setTimeout(() => {
            if (!cardProps.ref?.current) return;
            // const cardWorldPos = new Vector3();
            // cardProps.ref.current.getWorldPosition(cardWorldPos);
            const contentHeight = cardProps.viewportHeight || 10;
            const cardBounds = sharedMatrices.box.setFromObject(
                cardProps.ref.current
            );
            // console.log(cardProps.ref.current);

            const cardSize = cardBounds.getSize(sizeObj);
            // console.log(cardSize);
            // const cardTop = cardSize.y;
            const cardTop = cardBounds.max.y;
            // console.log(cardTop);
            const camera = controlsRef.current.camera;
            const currentPos = camera.position.clone();
            const targetYOffset = contentHeight / 2 - cardTop;
            const currentTarget = controlsRef.current.getTarget(new Vector3());
            const distanceToTarget = currentPos.distanceTo(currentTarget);
            const fov = camera.fov * (Math.PI / 180);

            // Hauteur visible dans le monde à cette distance
            const visibleHeight = 2 * Math.tan(fov / 2) * distanceToTarget;

            // Pour aligner le haut de la carte avec le haut du viewport
            // Le target doit être décalé vers le bas de la moitié de la différence
            const viewportTopY = currentTarget.y + visibleHeight / 2;
            const offsetNeeded = cardTop - viewportTopY;

            // console.log('📸 Mobile camera focus:', {
            //     currentPos: currentPos,
            //     currentTarget: currentTarget,
            //     targetYOffset: targetYOffset,
            //     cardTop: cardTop,
            //     cardbottom: cardBounds.min.y,
            //     contentHeight: contentHeight,
            //     cardHeight: cardTop - cardBounds.min.y,
            //     cardSize: cardSize,
            //     cardBounds: cardBounds,
            //     cardSpacePos: cardProps.spacePositions,
            // });
            // console.log(
            //     controlsRef.current.getFocalOffset(
            //         cardProps.ref.current.position,
            //         true
            //     )
            // );
            controlsRef.current.setLookAt(
                currentPos.x,
                currentPos.y,
                currentPos.z,
                currentTarget.x,
                currentTarget.y + offsetNeeded,
                currentTarget.z,
                true
            );

            // controlsRef.current.setLookAt(
            //     currentPos.x,
            //     currentPos.y - 1.5,
            //     currentPos.z,
            //     currentTarget.x,
            //     currentTarget.y - targetYOffset,
            //     currentTarget.z,
            //     true
            // );
        }, FOCUS_DELAY_MOBILE + 50);
    }, FOCUS_DELAY_MOBILE + 100);

    return undefined;
}

/**
 * Positionning hook for the camera on the card
 *
 * @returns the hook function
 */
export function useCameraPositioning() {
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

            // Actual angle of the camera
            const currentCameraAngle = Math.atan2(
                camera.position.x,
                camera.position.z
            );
            const desiredAngle = cardAngles.active + CAMERA_ANGLE_OFFSET;
            const angleDelta = shortestAnglePath(
                currentCameraAngle,
                desiredAngle
            );

            // Lerp and angle calculations
            const cameraCalculation = calculateCameraAngleAndLerp({
                currentCameraAngle,
                desiredAngle,
                angleDelta,
                isClicked,
                lerpFactor,
                isMobile,
            });

            const { newAngle, effectiveLerpFactor, edgeCompensation } =
                cameraCalculation;
            const angleFactor = Math.min(1, Math.abs(angleDelta) / Math.PI);

            // Camera positioning
            const camTargetPos = ref.current.position.clone();
            const camPos = calculateCameraPosition(
                newAngle,
                edgeCompensation,
                containerScale,
                camTargetPos,
                ref,
                isMobile,
                isClicked
            );

            // New lerp factor based on click state
            const newCamPos = isClicked
                ? camPos.clone()
                : camera.position.clone().lerp(camPos, effectiveLerpFactor);

            // Adding an offset to the target position when clicked
            const shiftedTarget = calculateTargetWithOffset({
                ref,
                isClicked,
                isMobile,
                angleFactor,
            });

            // Fov adjustment based on device type
            camera.fov = isMobile ? CAMERA_FOV_MOBILE : CAMERA_FOV_DESKTOP;

            // Never too close from the center to avoid clipping
            const safeCameraPos = applySafetyDistance(
                newCamPos,
                containerScale
            );
            // console.log('📸 Camera positioning:', {
            //     cardId: cardProps.id,
            //     safeCameraPos: safeCameraPos.toArray().map((n) => n.toFixed(2)),
            //     shiftedTarget: shiftedTarget.toArray().map((n) => n.toFixed(2)),
            //     isClicked,
            //     isMobile,
            //     containerScale,
            //     newAngle: ((newAngle * 180) / Math.PI).toFixed(1) + '°',
            // });
            // Final camera position and target setting
            controlsRef.current.setLookAt(
                safeCameraPos.x,
                safeCameraPos.y,
                safeCameraPos.z,
                shiftedTarget.x,
                shiftedTarget.y,
                shiftedTarget.z,
                !(isClicked && isMobile) // Animation désactivée pour mobile cliqué
            );

            // Mobile specific handling
            let mobilePos;
            if (isMobile && isClicked) {
                mobilePos = handleMobileFitToSphere(controlsRef, cardProps);
            }

            camera.updateProjectionMatrix();
            const finalTarget = controlsRef.current.getTarget(new Vector3());
            return {
                cameraPosition: mobilePos ?? safeCameraPos,
                cameraTarget: finalTarget,
                targetPosition: shiftedTarget,
                angleLimits: calculateAngleLimits(isClicked, desiredAngle),
                truckLimits: calculateTruckLimits(ref),
            };
        },
        []
    );

    return { positionCameraToCard };
}
