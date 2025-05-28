// Dans hooks/use3DIntersectionObserver.tsx
import { wait } from '@/functions/promises';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';

interface Use3DIntersectionObserverOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    enabled?: boolean;
    onIntersect?: () => void;
    onLeave?: () => void;
    loadDelay?: number;
}

/**
 * Hook spécialisé pour l'intersection observer avec des objets 3D
 * @param options - Options de configuration
 * @returns Ref à attacher au groupe 3D et état de visibilité
 */
export function use3DIntersectionObserver(
    options: Use3DIntersectionObserverOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = '100px',
        triggerOnce = false,
        enabled = true,
        onIntersect,
        onLeave,
        loadDelay = 0,
    } = options;

    const groupRef = useRef<Group>(null);
    const [isReady, setIsReady] = useState(false);

    const { isIntersecting, wasIntersecting } = useIntersectionObserver(
        groupRef,
        {
            threshold,
            rootMargin,
            triggerOnce,
            enabled,
        }
    );

    // Gestion du délai de chargement
    useEffect(() => {
        const checkIntersect = async () => {
            try {
                if (isIntersecting && !isReady) {
                    if (loadDelay > 0) {
                        await wait(loadDelay);
                    }
                    setIsReady(true);
                    onIntersect?.();
                }
                if (!isIntersecting && wasIntersecting && !triggerOnce) {
                    throw new Error('Element is no longer intersecting');
                }
            } catch (error) {
                console.error('Error in intersection observer:', error);
                onLeave?.();
            }
            checkIntersect();
        };
    }, [
        isIntersecting,
        isReady,
        loadDelay,
        onIntersect,
        onLeave,
        wasIntersecting,
        triggerOnce,
    ]);

    return {
        intersectRef: groupRef,
        isIntersecting,
        wasIntersecting,
        isReady,
    };
}
