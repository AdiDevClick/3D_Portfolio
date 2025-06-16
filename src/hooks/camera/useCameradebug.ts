import { ElementType } from '@/hooks/reducers/carouselTypes';
import { Camera } from '@react-three/fiber';
import { RefObject, useEffect, useRef } from 'react';
import { Vector3 } from 'three';

export function useCameraDebug(
    cameraRef: RefObject<Camera>,
    camera: Camera,
    activeCard: ElementType | null,
    isClicked: boolean,
    isMobile: boolean
) {
    const lastLogTime = useRef<number>(0);

    useEffect(() => {
        if (!activeCard?.ref?.current || !isClicked) return;

        const now = Date.now();
        if (now - lastLogTime.current < 1000) return; // Throttle logs

        const cardPosition = activeCard.ref.current.position;
        const cameraPosition = camera.position;
        const distance = cameraPosition.distanceTo(cardPosition);
        const minRequired = isMobile ? 6.0 : 12.0;

        if (distance < minRequired * 1.1) {
            // Log si proche de la limite
            console.debug('📸 Camera Distance Check:', {
                cardId: activeCard.id,
                distance: distance,
                minRequired,
                status:
                    distance < minRequired ? '🚨 TOO CLOSE' : '⚠️ NEAR LIMIT',
                cameraPos: cameraPosition,
                cardPos: cardPosition,
                cameraTarget: cameraRef.current.getTarget(new Vector3()),
            });
            lastLogTime.current = now;
        }
    }, [camera?.position, activeCard, isClicked, isMobile]);
}
