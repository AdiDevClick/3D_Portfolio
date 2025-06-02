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

// ✅ Types pour plus de clarté
interface CameraCalculationParams {
    currentCameraAngle: number;
    desiredAngle: number;
    angleDelta: number;
    isClicked: boolean;
    lerpFactor: number;
    isMobile: boolean;
}

interface CameraPositionResult {
    newAngle: number;
    effectiveLerpFactor: number;
    edgeCompensation: number;
}

interface TargetCalculationParams {
    ref: ElementType['ref'];
    isClicked: boolean;
    isMobile: boolean;
    angleFactor: number;
}

// ✅ Fonction pour calculer les paramètres d'angle et de lerp
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

    // Calcul du lerp factor adaptatif
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

    // Calcul du nouvel angle
    let newAngle = isClicked
        ? desiredAngle
        : currentCameraAngle + angleDelta * effectiveLerpFactor;

    // Ajustement pour la direction initiale si pas cliqué
    if (!isClicked && Math.abs(angleDelta) > 0.01) {
        const initialDirection = angleDelta > 0 ? 1 : -1;
        const initialPush =
            initialDirection * Math.min(0.05, Math.abs(angleDelta) * 0.1);
        newAngle += initialPush;
    }

    return { newAngle, effectiveLerpFactor, edgeCompensation };
}

// ✅ Fonction pour calculer la position de la caméra
function calculateCameraPosition(
    newAngle: number,
    edgeCompensation: number,
    containerScale: number,
    camTargetPos: Vector3,
    ref: ElementType['ref'],
    isMobile: boolean,
    isClicked: boolean
): Vector3 {
    const finalDesiredRadius =
        containerScale +
        CAMERA_ACTIVE_FORWARD_OFFSET * (1 - edgeCompensation) +
        (isMobile
            ? CAMERA_EXTRA_PULLBACK_MOBILE
            : isClicked
            ? CAMERA_EXTRA_PULLBACK_DESKTOP
            : CAMERA_HOVER_PULLBACK_DESKTOP);

    // Calcul offset pour centrage vertical
    const bbox = new Box3().setFromObject(ref.current);
    const sizeObj = new Vector3();
    bbox.getSize(sizeObj);
    const verticalCenterOffset = sizeObj.y / CAMERA_VERTICAL_CENTER_DIVISOR;

    // ✅ FIX MOBILE : Position perpendiculaire si mobile cliqué
    if (isMobile && isClicked) {
        // ✅ Position carte dans l'espace monde
        const cardWorldPos = new Vector3();
        ref.current.getWorldPosition(cardWorldPos);

        // ✅ Position caméra FACE à la carte (perpendiculaire)
        return new Vector3(
            cardWorldPos.x, // ✅ Centré X sur la carte
            camTargetPos.y + verticalCenterOffset, // ✅ Hauteur normale
            cardWorldPos.z + finalDesiredRadius // ✅ DEVANT la carte
        );
    }

    return new Vector3(
        Math.sin(newAngle) * finalDesiredRadius,
        camTargetPos.y + verticalCenterOffset,
        Math.cos(newAngle) * finalDesiredRadius
    );
}

// ✅ Fonction pour calculer la target avec offset
function calculateTargetWithOffset(params: TargetCalculationParams): Vector3 {
    const { ref, isClicked, isMobile, angleFactor } = params;

    const camTargetPos = ref.current.position.clone();

    // Calcul du vecteur droit
    const rightVector = new Vector3(1, 0, 0);
    rightVector.applyQuaternion(ref.current.quaternion);

    // Calcul de la distance d'offset
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

// ✅ Fonction pour appliquer la sécurité de distance
function applySafetyDistance(
    newCamPos: Vector3,
    containerScale: number
): Vector3 {
    const distanceToCenter = Math.sqrt(
        newCamPos.x * newCamPos.x + newCamPos.z * newCamPos.z
    );
    const minDistanceToCenter = containerScale + CAMERA_SAFETY_MARGIN;

    if (distanceToCenter < minDistanceToCenter) {
        const scale = minDistanceToCenter / distanceToCenter;
        newCamPos.x *= scale;
        newCamPos.z *= scale;
    }

    return newCamPos;
}

// ✅ Fonction pour calculer les limites d'angle
function calculateAngleLimits(isClicked: boolean, desiredAngle: number) {
    return isClicked
        ? {
              min: desiredAngle - CAMERA_ANGLELIMITS,
              max: desiredAngle + CAMERA_ANGLELIMITS,
              default: desiredAngle,
          }
        : { min: -Infinity, max: Infinity };
}

// ✅ Fonction pour calculer les limites de truck
function calculateTruckLimits(cardRef: ElementType['ref']) {
    return {
        minX: cardRef.current.position.x,
        maxX: cardRef.current.position.x,
        minY: cardRef.current.position.y - 20,
        maxY: cardRef.current.position.y + 0.1,
        minZ: cardRef.current.position.z - 0.1,
        maxZ: cardRef.current.position.z + 0.1,
    };
}

// ✅ Fonction fitToSphere séparée et simplifiée
function handleMobileFitToSphere(
    controlsRef: RefObject<CameraControls>,
    cardProps: ElementType
): Vector3 | undefined {
    if (!cardProps.presenceSphere) return undefined;

    setTimeout(() => {
        controlsRef.current.fitToSphere(cardProps.presenceSphere, true);

        setTimeout(() => {
            const contentHeight = cardProps.viewportHeight || 10;
            const cardBounds = new Box3().setFromObject(cardProps.ref.current);
            const cardTop = cardBounds.max.y;
            const currentPos = controlsRef.current.camera.position.clone();
            const targetYOffset = contentHeight / 2 - cardTop;
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
        }, FOCUS_DELAY_MOBILE + 50);
    }, FOCUS_DELAY_MOBILE + 3000);

    return undefined; // Placeholder pour la position mobile
}

// ✅ Hook principal refactorisé
export function useCameraPositioning() {
    const positionCameraToCard = useCallback(
        (
            controlsRef: RefObject<CameraControls>,
            cardProps: ElementType,
            isMobile: boolean,
            isClicked = false,
            lerpFactor = 0.6
        ) => {
            // ✅ Validation des paramètres
            if (!cardProps.ref?.current || !controlsRef?.current) return;

            const { camera } = controlsRef.current;
            const { cardAngles, ref, containerScale } = cardProps;

            // ✅ Calcul de l'angle actuel de la caméra
            const currentCameraAngle = Math.atan2(
                camera.position.x,
                camera.position.z
            );
            const desiredAngle = cardAngles.active + CAMERA_ANGLE_OFFSET;
            const angleDelta = shortestAnglePath(
                currentCameraAngle,
                desiredAngle
            );

            // ✅ Calcul des paramètres d'angle et de lerp
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

            // ✅ Calcul de la position de la caméra
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

            // ✅ Interpolation de la position
            const newCamPos = isClicked
                ? camPos.clone()
                : camera.position.clone().lerp(camPos, effectiveLerpFactor);

            // ✅ Calcul de la target avec offset
            const shiftedTarget = calculateTargetWithOffset({
                ref,
                isClicked,
                isMobile,
                angleFactor,
            });

            // ✅ Modification du FOV selon le device
            camera.fov = isMobile ? CAMERA_FOV_MOBILE : CAMERA_FOV_DESKTOP;

            // ✅ Application de la sécurité de distance
            const safeCameraPos = applySafetyDistance(
                newCamPos,
                containerScale
            );

            // ✅ Application du positionnement principal
            controlsRef.current.setLookAt(
                safeCameraPos.x,
                safeCameraPos.y,
                safeCameraPos.z,
                shiftedTarget.x,
                shiftedTarget.y,
                shiftedTarget.z,
                !(isClicked && isMobile) // Animation désactivée pour mobile cliqué
            );

            // ✅ Gestion du mode mobile avec fitToSphere
            let mobilePos;
            if (isMobile && isClicked) {
                mobilePos = handleMobileFitToSphere(controlsRef, cardProps);
            }

            // ✅ Mise à jour de la projection
            camera.updateProjectionMatrix();
            const finalTarget = controlsRef.current.getTarget(new Vector3());

            // ✅ Retour des résultats
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
