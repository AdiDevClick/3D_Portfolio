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
    const viewportWidth = element.clientWidth;
    const newRatio = viewportWidth / width;

    if (width !== viewportWidth && newRatio !== scaleRatio && !done) {
        setScaleRatio(newRatio);
    } else if (!done) {
        setDone(true);
    }
}
