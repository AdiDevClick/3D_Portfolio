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
export const debounce = function (func, duration) {
    let timer;
    return (...args) => {
        // let context = this;
        // return new Promise((resolve) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
            // func.apply(context, ...args);
            // resolve(duration);
        }, duration);
        // });
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

/**
 * Crer une promesse qui se resoudra
 * après un délai défini en paramètre
 * @param {number} duration - La durée de l'attente
 * @param {string} message - Message à retourner dans la promesse si besoin
 * @returns
 */
export function wait(duration, message = '') {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(message);
        }, duration);
    });
}

/**
 * Rejette une promesse de force
 * @param {number} duration
 * @param {string} message
 */
export function waitAndFail(duration, message) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(message);
        }, duration);
    });
}

/**
 * Permet de RACE un array de promesse en retournant
 * le status et la value/reason associée à la promesse qui arrive en première
 * @param {Promise} promise
 * @returns
 */
export function promiseState(promise) {
    let mapObject = false;
    const allPromises = [];
    const pendingState = { status: 'pending' };

    // if (promise instanceof Map) {
    //     mapObject = true;
    //     for (const [key, promiseItem] of promise.entries()) {
    //         allPromises.push(promiseItem);
    //     }
    // }
    // if (promise instanceof Map) {
    //     for (const [key, promiseItem] of promise.entries()) {
    //         allPromises.push(
    //             promiseItem
    //                 .then((value) => ({ status: 'fulfilled', value, key }))
    //                 .catch((reason) => ({ status: 'rejected', reason, key }))
    //         );
    //     }
    //     return Promise.race([...allPromises, Promise.resolve(pendingState)]);
    // }

    return Promise.race([
        mapObject ? allPromises : promise,
        Promise.resolve(pendingState),
    ]).then(
        (value) =>
            value === pendingState ? value : { status: 'fulfilled', value },
        (reason) => ({ status: 'rejected', reason })
    );
    // return Promise.race([promise, Promise.resolve(pendingState)]).then(
    //     (value) =>
    //         value === pendingState ? value : { status: 'fulfilled', value },
    //     (reason) => ({ status: 'rejected', reason })
    // );

    // Si c'est une Map de promesses
    if (promise instanceof Map) {
        const pendingState = { status: 'pending' };
        const allPromises = [];

        const promiseArray = Array.from(promise.values());

        console.log(promiseArray);
        // Extraire toutes les promesses de la Map en ajoutant leur clé
        for (const [key, promiseItem] of promise.entries()) {
            allPromises.push(
                promiseItem
                    .then((value) => ({ status: 'fulfilled', value, key }))
                    .catch((reason) => ({ status: 'rejected', reason, key }))
            );
        }

        // Race entre toutes les promesses et un état "pending" immédiat
        return Promise.race([...allPromises, Promise.resolve(pendingState)]);
    }

    return Promise.reject(
        new Error(
            'promiseState: Argument must be a Promise or a Map of Promises'
        )
    );
}
