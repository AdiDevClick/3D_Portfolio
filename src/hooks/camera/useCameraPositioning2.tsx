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
    CAMERA_OFFSET_EDGE_ADJUSTMENT,
    CAMERA_SAFETY_MARGIN,
    CAMERA_VERTICAL_CENTER_DIVISOR,
    FOCUS_DELAY_MOBILE,
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

            // if (isMobile && isClicked) {
            //     // newCamPos.z *= CAMERA_MOBILE_Z_POSITION;
            //     // shiftedTarget.y += CAMERA_MOBILE_Y_POSITION;
            //     if (cardProps.presenceSphere) {
            //         // controlsRef.current.smoothTime = 0.5; // Smooth transition time
            //         // fitToSphere(
            //         //     controlsRef,
            //         //     cardProps.presenceSphere,
            //         //     isMobile
            //         // );
            //         setTimeout(() => {
            //             controlsRef.current.fitToSphere(
            //                 cardProps.presenceSphere,
            //                 true
            //             );
            //             console.log('jai fit to sphere');
            //             // return () => {
            //             //     clearTimeout(timer);
            //             // };
            //             setTimeout(() => {
            //                 const contentHeight =
            //                     cardProps.viewportHeight || 10;
            //                 const cardBounds = new Box3().setFromObject(
            //                     cardProps.ref.current
            //                 );
            //                 const cardHeight =
            //                     cardBounds.max.y - cardBounds.min.y;
            //                 const cardTop = cardBounds.max.y;
            //                 // const distanceToTop = contentHeight / 2 - 1;
            //                 const currentPos =
            //                     controlsRef.current.camera.position.clone();
            //                 const topViewportPosition =
            //                     DESKTOP_HTML_TITLE_POSITION_SETTINGS(
            //                         contentHeight,
            //                         0.5
            //                     );
            //                 const topViewportPositionY = topViewportPosition.y;
            //                 const targetYOffset = contentHeight / 2 - cardTop;
            //                 // const targetYOffset =
            //                 //     topViewportPositionY - cardTop;

            //                 // const distanceToTop = topViewportPosition.y - 1; // ✅ Ajustement pour descendre la caméra
            //                 const currentTarget = controlsRef.current.getTarget(
            //                     new Vector3()
            //                 );

            //                 controlsRef.current.setLookAt(
            //                     currentPos.x,
            //                     currentPos.y - 1.5, // ✅ Descendre caméra verticalement
            //                     currentPos.z,
            //                     currentTarget.x,
            //                     currentTarget.y - targetYOffset, // ✅ Target reste centré
            //                     currentTarget.z,
            //                     true
            //                 );
            //             }, FOCUS_DELAY_MOBILE + 300);
            //         }, FOCUS_DELAY_MOBILE);
            //     }
            // }

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
                shiftedTarget.y,
                // isClicked && isMobile ? shiftedTarget.y - 1.5 : shiftedTarget.y,
                shiftedTarget.z,
                // Animation ?
                // true
                !(isClicked && isMobile)
            );
            let mobilePos;
            if (isMobile && isClicked) {
                if (cardProps.presenceSphere) {
                    // controlsRef.current.smoothTime = 0.5;
                    mobilePos = fitToSphere(
                        controlsRef,
                        cardProps.presenceSphere,
                        cardProps,
                        isMobile
                    );
                    // setTimeout(() => {
                    // controlsRef.current.fitToSphere(
                    //     cardProps.presenceSphere,
                    //     true
                    // );
                    // setTimeout(() => {
                    //     const contentHeight = cardProps.viewportHeight || 10;
                    //     const cardBounds = new Box3().setFromObject(
                    //         cardProps.ref.current
                    //     );
                    //     // const cardHeight =
                    //     //     cardBounds.max.y - cardBounds.min.y;
                    //     const cardTop = cardBounds.max.y;
                    //     // const distanceToTop = contentHeight / 2 - 1;
                    //     const currentPos =
                    //         controlsRef.current.camera.position.clone();
                    //     // const topViewportPosition =
                    //     //     DESKTOP_HTML_TITLE_POSITION_SETTINGS(
                    //     //         contentHeight,
                    //     //         0.5
                    //     //     );
                    //     // const topViewportPositionY = topViewportPosition.y;
                    //     const targetYOffset = contentHeight / 2 - cardTop;
                    //     // const targetYOffset =
                    //     //     topViewportPositionY - cardTop;

                    //     // const distanceToTop = topViewportPosition.y - 1; // ✅ Ajustement pour descendre la caméra
                    //     const currentTarget = controlsRef.current.getTarget(
                    //         new Vector3()
                    //     );

                    //     controlsRef.current.setLookAt(
                    //         currentPos.x,
                    //         currentPos.y - 1.5,
                    //         currentPos.z,
                    //         currentTarget.x,
                    //         currentTarget.y - targetYOffset,
                    //         currentTarget.z,
                    //         true
                    //     );

                    //     // ✅ POSITION DROITE comme une page web
                    //     // const cardWorldPos = new Vector3();
                    //     // const cardWorldQuaternion = new Quaternion();
                    //     // cardProps.ref.current.getWorldPosition(
                    //     //     cardWorldPos
                    //     // );
                    //     // cardProps.ref.current.getWorldQuaternion(
                    //     //     cardWorldQuaternion
                    //     // );

                    //     // // ✅ Calculer la direction "devant" de la carte
                    //     // const cardForward = new Vector3(0, 0, 1); // Direction avant par défaut
                    //     // cardForward.applyQuaternion(cardWorldQuaternion); // Appliquer rotation carte

                    //     // // ✅ Position caméra = carte + direction avant * distance
                    //     // const frontDistance = 4;
                    //     // const cameraPos = cardWorldPos
                    //     //     .clone()
                    //     //     .add(cardForward.multiplyScalar(frontDistance));
                    //     // cameraPos.y += 1; // Légèrement au-dessus

                    //     // controlsRef.current.setLookAt(
                    //     //     cameraPos.x,
                    //     //     cameraPos.y,
                    //     //     cameraPos.z,
                    //     //     cardWorldPos.x, // ✅ Target = centre de la carte
                    //     //     cardWorldPos.y,
                    //     //     cardWorldPos.z,
                    //     //     true
                    //     // );
                    // }, FOCUS_DELAY_MOBILE + 300);
                    // }, FOCUS_DELAY_MOBILE + 50);
                }
            }

            camera.updateProjectionMatrix();
            const finalTarget = controlsRef.current.getTarget(new Vector3());
            return {
                cameraPosition: mobilePos ?? newCamPos,
                cameraTarget: finalTarget,
                targetPosition: shiftedTarget,
                angleLimits: isClicked
                    ? {
                          min: desiredAngle - CAMERA_ANGLELIMITS,
                          max: desiredAngle + CAMERA_ANGLELIMITS,
                          default: desiredAngle,
                      }
                    : { min: -Infinity, max: Infinity },
                truckLimits: {
                    minX: cardProps.ref.current.position.x,
                    maxX: cardProps.ref.current.position.x,
                    minY: cardProps.ref.current.position.y - 20,
                    maxY: cardProps.ref.current.position.y + 0.1,
                    minZ: cardProps.ref.current.position.z - 0.1,
                    maxZ: cardProps.ref.current.position.z + 0.1,
                },
            };
        },
        []
    );

    return { positionCameraToCard };
}

function fitToSphere(
    controlsRef: RefObject<CameraControls>,
    sphere: ElementType['presenceSphere'],
    cardProps: ElementType,
    isMobile: boolean
) {
    // if (!controlsRef.current || !sphere) return;

    // Fit the camera to the sphere
    // controlsRef.current.smoothTime = 0.8;
    setTimeout(() => {
        controlsRef.current.fitToSphere(sphere, true);
        setTimeout(() => {
            const contentHeight = cardProps.viewportHeight || 10;
            const cardBounds = new Box3().setFromObject(cardProps.ref.current);
            // const cardHeight =
            //     cardBounds.max.y - cardBounds.min.y;
            const cardTop = cardBounds.max.y;
            // const distanceToTop = contentHeight / 2 - 1;
            const currentPos = controlsRef.current.camera.position.clone();
            // const topViewportPosition =
            //     DESKTOP_HTML_TITLE_POSITION_SETTINGS(
            //         contentHeight,
            //         0.5
            //     );
            // const topViewportPositionY = topViewportPosition.y;
            const targetYOffset = contentHeight / 2 - cardTop;
            // const targetYOffset =
            //     topViewportPositionY - cardTop;

            // const distanceToTop = topViewportPosition.y - 1; // ✅ Ajustement pour descendre la caméra
            const currentTarget = controlsRef.current.getTarget(new Vector3());

            controlsRef.current.setLookAt(
                currentPos.x,
                currentPos.y - 1.5,
                currentPos.z,
                currentTarget.x,
                currentTarget.y - targetYOffset,
                currentTarget.z,
                true
            );
            return currentPos;
        }, FOCUS_DELAY_MOBILE + 300);
    }, FOCUS_DELAY_MOBILE + 50);
}
