import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';

/**
 * @param speed - between 0 to 1, 1 being instant
 */
export function useLookAtSmooth(speed = 0.05) {
    const { camera } = useThree();
    const [isCompleted, setCompleted] = useState(false);
    const lookAtProgress = useRef(0);
    const lookAtTarget = useRef<Vector3>(null);

    /**
     * Ensure position passed is of type THREE.Vector3
     */
    const lookAtSmooth = (position: Vector3) => {
        lookAtProgress.current = 0;
        lookAtTarget.current = position;
    };

    useFrame(() => {
        if (lookAtTarget?.current !== null) {
            // clone camera to get the target quaternion using lookAt()
            const clone = camera.clone();
            clone.lookAt(lookAtTarget.current);
            if (
                Math.abs(clone.quaternion._y - camera.quaternion._y) < 0.01 &&
                Math.abs(clone.quaternion._w - camera.quaternion._w) < 0.01 &&
                Math.abs(clone.quaternion._x - camera.quaternion._x) < 0.01 &&
                Math.abs(clone.quaternion._z - camera.quaternion._z) < 0.01
            ) {
                // the differernce between the clone's quaternion and the camera's
                // are close enough, so we clear the target to complete the animation
                // console.log('progress avant null:', lookAtProgress.current);
                lookAtTarget.current = null;
            } else {
                // take a step towards target quaternion
                lookAtProgress.current = Math.min(
                    lookAtProgress.current + speed,
                    1
                );

                camera.quaternion.slerp(
                    clone.quaternion,
                    lookAtProgress.current
                );

                if (lookAtProgress.current >= 1) {
                    setCompleted(true);
                }
            }
        }
    });

    return { lookAtSmooth, isCompleted };
}
