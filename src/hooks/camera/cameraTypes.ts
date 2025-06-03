export interface CameraCalculationParams {
    currentCameraAngle: number;
    desiredAngle: number;
    angleDelta: number;
    isClicked: boolean;
    lerpFactor: number;
    isMobile: boolean;
}

export interface CameraPositionResult {
    newAngle: number;
    effectiveLerpFactor: number;
    edgeCompensation: number;
}

export interface TargetCalculationParams {
    ref: Element['ref'];
    isClicked: boolean;
    isMobile: boolean;
    angleFactor: number;
}
