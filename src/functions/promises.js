/**
 * Debounce une fonction de manière Asynchrone
 * Il faut spécifier la duration -
 * Cette fonction permet aussi de prendre en compte
 * les paramètres de la fonction debounced
 * @param {Function} funct
 * @param {Number} duration
 * @fires [debounce]
 * @returns {Function}
 */
export const debounce = function (funct, duration) {
    let timer;
    return (...args) => {
        return new Promise((resolve) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                funct.apply(null, ...args);
                resolve(duration);
            }, duration);
        });
    };
};

export const throttle = function (callback, delay) {
    let last = 0;
    let timer = null;
    return (...args) => {
        const now = Date.now();
        if (last && now < last + delay) {
            // le délai n'est pas écoulé on reset le timer
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                callback(...args);
            }, delay);
        } else {
            last = now;
            callback(...args);
        }
    };
};
