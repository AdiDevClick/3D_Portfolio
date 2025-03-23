import { useEffect, useState } from 'react';

type useDebounce = (func: () => void, delay: number) => () => void;

/**
 * Debounce une fonction de manière Asynchrone
 * Il faut spécifier la duration -
 * Cette fonction permet aussi de prendre en compte
 * les paramètres de la fonction debounced
 * @fires {debounce}
 */
export default function useDebounce(func: () => void, delay: number) {
    const [debouncedFunc, setDebouncedFunc] = useState(func);
    let context = this;
    const args = { ...this };
    let timer;
    useEffect(() => {
        new Promise((resolve) => {
            timer = setTimeout(() => {
                func.apply(context, args);
                resolve(delay);
            }, delay);
        });
        // const timeoutId = setTimeout(() => {
        //     setDebouncedFunc(func);
        // }, delay);

        return () => clearTimeout(timer);
    }, [func, delay]);

    return debouncedFunc;
}
