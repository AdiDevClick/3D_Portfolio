import {
    Ref,
    RefAttributes,
    RefCallback,
    RefObject,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { ColorManagement } from 'three';
import { call } from 'three/tsl';

// const handleObserver = (mutationsList, observer) => {
//     mutationsList.forEach((mutation) => {
//         if (mutation.addedNodes.length > 0) {
//             const addedNodes = mutation.addedNodes[0].children;
//             for (const node of addedNodes) {
//                 if (this.#inputsToListen.includes(node.type)) {
//                     // Setting which input can be empty
//                     setObjectPropertyTo(
//                         this.options.whichInputCanBeEmpty,
//                         node,
//                         node.name,
//                         'canBeEmpty',
//                         true
//                     );
//                     // Setting which input can accept special char
//                     setObjectPropertyTo(
//                         this.options.whichInputAllowSpecialCharacters,
//                         node,
//                         node.name,
//                         'allowSpecialCharacters',
//                         true
//                     );
//                     // Creating valid / invalid icon for each inputs
//                     this.#createIconContainer(node);
//                     // Main dynamic checker
//                     node.addEventListener(
//                         'input',
//                         debounce((e) => {
//                             this.#dynamicCheck(e.target);
//                         }, this.debounceDelay)
//                     );
//                 }
//             }
//         }
//     });
// };
// mutation list, observer
// export function useMutationObserver(
//     cb,
//     options = {
//         attributes: true,
//         characterData: true,
//         childList: true,
//         subtree: false,
//     }
// ) {
//     const observer = useRef(null);
//     return useCallback((node) => {
//         if (!node) {
//             if (observer.current) {
//                 observer.current.disconnect();
//             }
//             return;
//         }
//         observer.current = new MutationObserver(cb);
//         observer.current.observe(node, options);
//         return observer.current;
//     }, []);
// }
/**
 * Options pour l'observation via MutationObserver.
 */
export interface MutationObserverOptions {
    /** **@default=false** - Indique si l'on observe les attributs. */
    attributes: boolean;
    /** **@default=true** - Indique si l'on observe les modifications du contenu textuel. */
    characterData: boolean;
    /** **@default=true** - Indique si l'on observe l'ajout/suppression de nœuds enfants. */
    childList: boolean;
    /** **@default=false** - Indique si l'observation concerne aussi les descendants. */
    subtree: boolean;
}

/**
 * Installe un MutationObserver sur un nœud.
 *
 * @param callback - La fonction handler.
 * @param ref - La ref de l'élément à observer.
 * @param options - Options du handler.
 */
export function useMutationObserver(
    callback: MutationCallback,
    measure,
    options: MutationObserverOptions = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: false,
    }
) {
    const observerRef = useRef(null);
    // const observerRef = useRef(new MutationObserver(callback));
    // const optionsRef = useRef(options);
    const [done, setDone] = useState(false);
    // optionsRef.current = options;
    // const internalCallback = useCallback(
    //     (mutations: MutationRecord[], observer: MutationObserver) => {
    //         // Appel de votre callback initial
    //         const res = callbackRef.current(mutations, observer);
    //         console.log('internalCallback :', mutations, observer);
    //         // Stockage du résultat dans le state
    //         setResult(res);
    //     },
    //     []
    // useEffect(() => {
    //     if (ref.current) {
    //         setRef(ref.current);
    //         obs(ref.current);
    //     }
    // }, [obs]);
    // );

    // return observerRef;

    return useCallback((node: HTMLElement) => {
        if (!node) {
            if (observerRef.current) observerRef.current.disconnect();
            return;
        }
        // if (done) return;
        console.log('Observer attaché sur', node);
        observerRef.current = new MutationObserver(callback);
        observerRef.current.observe(node, options);

        measure(node);
    }, []);

    // useEffect(() => {
    //     if (!htmlRef.current || done || loaded) {
    //         if (observerRef.current) observerRef.current.disconnect();
    //         return;
    //     }
    // setLoaded(true);
    // return obs;
    obs(ref.current);
    // return obs(ref.current);
    // observerRef.current.observe(ref.current, optionsRef.current);

    //     return () => {
    //         observerRef.current.disconnect();
    //     };
    // }, [htmlRef]);

    return observerRef;

    // useEffect(() => {
    //     if (refState) return;
    //     if (ref.current) {
    //         setRef(ref.current);
    //     }
    // }, [ref.current]);

    // useEffect(() => {
    //     obs(refState);
    // }, [refState]);

    // useEffect(() => {
    //     if (!refState) return;

    //     // const observer = new MutationObserver(callback);
    //     observerRef.current.observe(refState, options);

    //     return () => {
    //         observerRef.current.disconnect();
    //     };
    // }, [callback, options]);

    // useEffect(() => {
    //     console.log('object');
    //     obs(ref.current);
    //     return () => {
    //         if (observerRef.current) observerRef.current.disconnect();
    //     };
    // }, [optionsRef.current, observerRef.current, ref]);

    // useEffect(() => {
    //     obs;
    //     return () => {
    //         if (observerRef.current) observerRef.current.disconnect();
    //     };
    // }, [obs]);

    // return { observerRef, obs };
    // return obs;
    // return observerRef;
}

// useEffect(() => {
//     if (!nodeRef.current) return;

//     const observer = new MutationObserver(callback);
//     observer.observe(nodeRef.current, options);

//     return () => {
//         observer.disconnect();
//     };
// }, [callback, options]);
