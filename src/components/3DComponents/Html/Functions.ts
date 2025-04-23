import { Vector3 } from 'three';

interface MeasureTypes {
    scaleRatio: number;
    setScaleRatio: (newRatio: number) => void;
    done: boolean;
    setDone: (newDone: boolean) => void;
}

/**
 * Utilise le setter pour renvoyer le scale entre
 * la fenêtre HTML ouverte et le viewport du device -
 *
 * @param element - L'élément HTML
 * @param param1.scaleRatio - Le state actuel du scaleRatio
 * @param param1.setScaleRatio - Le setter du scaleRatio
 * @param param1.setDone - Le setter du state Done pour ne pas avoir trop de callbacks
 * @param param1.done - Le state actuel false/true
 */
export function measure(
    element: HTMLElement,
    { scaleRatio, setScaleRatio, done, setDone }: MeasureTypes
) {
    if (!element) {
        return;
    }

    const { width } = element.getBoundingClientRect();
    // const viewportWidth = element.parentElement.clientWidth;
    const viewportWidth = element.clientWidth;
    // const viewportWidth = window.innerWidth;
    let newRatio = viewportWidth / width;

    // if (camera && element.parentElement) {
    //     // Récupérer la position 3D du conteneur parent
    //     const parentPos = new Vector3();
    //     element.getWorldPosition(parentPos);

    //     // Calculer la distance réelle à la caméra
    //     const distanceToCamera = camera.position.distanceTo(parentPos);
    //     if (distanceToCamera > 0.1) {
    //         const idealDistance = 10;
    //         const distanceRatio = idealDistance / distanceToCamera;
    //         newRatio *= 1 * distanceRatio * 0.1;
    //         newRatio = Math.max(0.5, Math.min(newRatio, 2));
    //     }
    // }

    if (width !== viewportWidth && !done && scaleRatio !== newRatio) {
        console.log(
            'newRatio',
            newRatio,
            'viewport',
            viewportWidth,
            'width',
            width,
            'element',
            element
        );

        setDone(true);
        setScaleRatio(newRatio);
        // setScaleRatio((prev) => (prev < newRatio ? newRatio : prev));
        // document.documentElement.style.setProperty(
        //     '--compensation-scale',
        //     newRatio.toString()
        // );
    } else {
        setDone(true);
    }
}
