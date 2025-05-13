const userAgent = navigator.userAgent;

/**
 * Vérifie que l'utilisateur est sur iPad et si sa version est compatible
 * @param maxVersion - Le numéro de version iOS à tester
 * @returns
 */
export function isIPadWithiOSVersion(maxVersion) {
    // Vérifiez si c'est un iPad
    const isIPadBrowser = /iPad/.test(userAgent);
    const isIPadDevice = /Macintosh/i.test(navigator.userAgent);
    // Vérifiez la version d'iOS
    const iOSVersionMatch = userAgent.match(/OS (\d+)_\d+/);
    if (iOSVersionMatch) {
        const iOSVersion = parseInt(iOSVersionMatch[1], 10);
        return (isIPadBrowser || isIPadDevice) && iOSVersion <= maxVersion;
    }
    return false;
}

/**
 * Vérifie si l'utilisateur utilise un iPad
 * @returns
 */
export function isIPad() {
    const isIPadBrowser = /iPad/.test(userAgent);
    const isIPadDevice = /Macintosh/i.test(navigator.userAgent);
    if ((isIPadDevice || isIPadBrowser) && navigator.maxTouchPoints) {
        return true;
    }
    return false;
}

/**
 * Vérifie si l'appareil de l'utilisateur possède un écran tactile
 */
export function isTouchDevice() {
    if (navigator.maxTouchPoints > 0) {
        return true;
    }

    if (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
        return true;
    }

    // Media query CSS check
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    if (mediaQuery && mediaQuery.matches) {
        return true;
    }

    const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (mobileRegex.test(navigator.userAgent)) {
        return true;
    }

    return false;
}
