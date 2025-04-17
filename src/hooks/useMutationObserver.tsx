import { useCallback, useRef } from 'react';

/**
 * Options pour l'observation via MutationObserver.
 */
export interface MutationObserverOptions {
    /** Indique si l'on observe les attributs. */
    attributes?: boolean;
    /** Indique si l'on observe les modifications du contenu textuel. */
    characterData?: boolean;
    /** Indique si l'on observe l'ajout/suppression de nœuds enfants. */
    childList?: boolean;
    /** Indique si l'observation concerne aussi les descendants. */
    subtree?: boolean;
}

/**
 * Hook qui crée et gère un MutationObserver
 * @param callback - HandleObs fonction appelée lors des mutations
 * @param options - Options du MutationObserver
 * @returns Une fonction ref à assigner à un élément React
 */
export function useMutationObserver(
    callback: MutationCallback,
    options: MutationObserverOptions = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: false,
    }
) {
    const observerRef = useRef<MutationObserver | null>(null);

    const nodeRef = useRef<HTMLElement | null>(null);

    // Insert the setRef into the DOM
    const setRef = useCallback(
        (node: HTMLElement | null) => {
            if (node === nodeRef.current || !node) return;

            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            nodeRef.current = node;

            observerRef.current = new MutationObserver(callback);
            observerRef.current.observe(node, options);

            return { node, observer: observerRef.current };
        },
        [callback, options]
    );

    return {
        setRef,
        node: nodeRef.current,
        observer: observerRef.current,
    };
}
