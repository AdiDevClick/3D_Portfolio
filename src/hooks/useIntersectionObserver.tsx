// Dans hooks/useIntersectionObserver.tsx
import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
    threshold?: number | number[];
    rootMargin?: string;
    triggerOnce?: boolean;
    enabled?: boolean;
}

interface UseIntersectionObserverReturn {
    isIntersecting: boolean;
    wasIntersecting: boolean;
    // entry: IntersectionObserverEntry | null;
}

/**
 * Hook pour observer la visibilité d'un élément avec IntersectionObserver
 * @param targetRef - Référence de l'élément à observer
 * @param options - Options de configuration
 * @returns État de visibilité et informations sur l'intersection
 */
export function useIntersectionObserver<T extends Element>(
    targetRef: RefObject<T>,
    options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = false,
        enabled = true,
    } = options;

    const [isIntersecting, setIsIntersecting] = useState(false);
    const [wasIntersecting, setWasIntersecting] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const element = targetRef.current;

        if (!element || !enabled) {
            return;
        }

        if (triggerOnce && wasIntersecting) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);

            if (entry.isIntersecting && !wasIntersecting) {
                setWasIntersecting(true);
            }
        }, options);

        observer.observe(element);
        observerRef.current = observer;

        return () => {
            const element = targetRef.current;
            if (element) {
                observer.unobserve(element);
                observer.disconnect();
                observerRef.current = null;
            }
        };
    }, [targetRef, options, wasIntersecting]);

    return {
        isIntersecting,
        wasIntersecting,
    };
}
