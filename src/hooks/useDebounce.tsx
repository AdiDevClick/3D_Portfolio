import { useCallback, useRef } from 'react';

type useDebounce = (func: () => void, delay: number) => () => void;

/**
 * Debounce une fonction de manière Asynchrone
 * Il faut spécifier la duration -
 * Cette fonction permet aussi de prendre en compte
 * les paramètres de la fonction debounced
 * @fires {debounce}
 */
// export default function useDebounce(func: () => void, delay: number) {
//     const [debouncedFunc, setDebouncedFunc] = useState(func);
//     let context = this;
//     const args = { ...this };
//     let timer;
//     useEffect(() => {
//         new Promise((resolve) => {
//             timer = setTimeout(() => {
//                 func.apply(context, args);
//                 resolve(delay);
//             }, delay);
//         });
//         // const timeoutId = setTimeout(() => {
//         //     setDebouncedFunc(func);
//         // }, delay);

//         return () => clearTimeout(timer);
//     }, [func, delay]);

//     return debouncedFunc;
// }

/**
 * Hook qui retourne une version debounced d'une fonction
 * @param callback Fonction à debouncer
 * @param delay Délai en millisecondes
 * @returns Fonction debounced
 */
export default function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    // Utiliser useRef pour stocker le timer
    const timerRef = useRef<number | null>(null);

    // Utiliser useCallback pour mémoriser la fonction debounced
    return useCallback(
        (...args: Parameters<T>) => {
            // Annuler le timer précédent s'il existe
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Créer un nouveau timer
            timerRef.current = setTimeout(() => {
                callback(...args);
                timerRef.current = null;
            }, delay);
        },
        [callback, delay]
    );
}
