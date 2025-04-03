/**
 * Calcule et retourne un array contenant
 * la position X, Y = 0, Z de l'objet sur un cercle
 */
export function MathPos(angle: number, radius: number) {
    const position: [number, number, number] = [
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius,
    ];
    return position;
}
