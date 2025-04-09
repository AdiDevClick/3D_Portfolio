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
 * @param currentRef - Le ref.current de l'élément HTML
 * @param param1.scaleRatio - Le state actuel du scaleRatio
 * @param param1.setScaleRatio - Le setter du scaleRatio
 * @param param1.setDone - Le setter du state Done pour ne pas avoir trop de callbacks
 * @param param1.done - Le state actuel false/true
 */
export function measure(
    currentRef: HTMLElement | null,
    { scaleRatio, setScaleRatio, done, setDone }: MeasureTypes
) {
    if (!currentRef || done) {
        return;
    }
    const rect = currentRef.getBoundingClientRect();
    const viewportWidth = currentRef.clientWidth;
    const newRatio = viewportWidth / rect.width;

    if (rect.width !== viewportWidth && newRatio !== scaleRatio && !done) {
        setScaleRatio(newRatio);
    } else {
        setDone(true);
    }
}
