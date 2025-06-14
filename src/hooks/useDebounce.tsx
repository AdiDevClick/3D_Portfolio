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
 * Returns a debounced version of the provided callback function.
 *
 * @param callback Function to debounce
 * @template T Type of the callback function
 * @param delay delay in milliseconds before the callback is executed
 * @returns Debounced function
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
