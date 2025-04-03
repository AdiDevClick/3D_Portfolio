// On incrémente le facteur d'animation t (entre 0 et 1)
const speedFactor = 0.5;
animationProgressRef.current = Math.min(
    animationProgressRef.current + delta * speedFactor,
    1
);
const t = animationProgressRef.current;

// On récupère la position de départ S (qui est sur l'anneau) et le rayon R
const S = startPositionRef.current.clone(); // Déjà enregistré lors du clic
const R = card.containerScale * 2.5; // Rayon de l'anneau
// Calculer l'angle initial de la carte à partir de S
const angle0 = Math.atan2(S.x, S.z);

// Définir le centre (T) de l'anneau (on suppose ici (0, 0, 0))
const T = new Vector3(0, 0, 0);

// Définir la hauteur maximale (offset vers le ciel) en phase 2
const upwardOffset = 10;

// Calculer la position cible P de la carte en fonction de t
let P = new Vector3();
if (t < 0.5) {
    // Phase 1 : la carte effectue une rotation sur le cercle.
    const u = t / 0.48; // u varie de 0 à 1 pendant la phase 1
    // La carte effectue un tour complet, donc l'angle évolue de angle0 à angle0 + 2π.
    const currentAngle = angle0 + 2 * Math.PI * u;
    P.set(
        Math.sin(currentAngle) * R,
        0, // On maintient y=0 pendant la phase 1
        Math.cos(currentAngle) * R
    );

    const targetRotationY = currentAngle + Math.PI;

    // Appliquer le damping pour la position et la rotation
    easing.damp3(cardRef.current.position, [P.x, P.y, P.z], 0.1, delta);
    easing.damp(cardRef.current.rotation, 'y', targetRotationY, 0.15, delta);

    // Vous pouvez également fixer rotation.x en phase 1 pour que la carte reste horizontale
    easing.damp(cardRef.current.rotation, 'x', 0, 0.15, delta);

    // easing.damp(cardRef.current.rotation, 'y', 2, 0.15, delta);
} else {
    // Phase 2 : la carte descend en "plume" vers le centre.
    const u = (t - 0.5) / 0.3; // u varie de 0 à 1 pendant la phase 2.
    // Horizontalement, on fait un lerp de S vers T, en gardant l'angle initial constant.
    const horizontal = new Vector3().lerpVectors(S, T, u);
    // Pour l'axe vertical, on définit une courbe en deux temps:
    // La carte monte jusqu'à atteindre upwardOffset, puis descend jusqu'à y=0.
    let vertical;
    const u2 = u * 0.5; // u2 varie de 0 à 2
    if (u2 <= 1) {
        // Phase ascension: de 0 à upwardOffset
        vertical = upwardOffset * u2;
    } else {
        // Phase descente: de upwardOffset à 0
        vertical = upwardOffset * (2 - u2);
    }
    horizontal.y = vertical;
    P.copy(horizontal);
}

// Appliquer le damping pour positionner la carte vers P
easing.damp3(cardRef.current.position, [P.x, P.y, P.z], 0.1, delta);

// On peut également gérer la rotation si besoin.
// Par exemple, faire en sorte que la carte reste orientée selon l'angle initial,
// ou qu'elle regarde vers le ciel pour accentuer l'effet "plume".
// Ici, on choisit de laisser la rotation Y inchangée et d'ajuster la rotation X (inclinaison).
// Pour cet effet, supposons que lors de la phase 2, la carte doit s'incliner vers le haut.
if (t >= 0.5) {
    // Durant la phase 2, on interpole la rotation X de 0 à -Math.PI/4 (par exemple)
    const desiredRotX = (-Math.PI / 4) * ((t - 0.5) / 0.5);
    easing.damp(cardRef.current.rotation, 'x', desiredRotX, 0.15, delta);
    state.camera.lookAt(
        cardRef.current.position.x,
        cardRef.current.position.y,
        cardRef.current.position.z
    );
    state.camera.position.lerp(cardRef.current.position, 0.1);
    // easing.damp(cardRef.current.rotation, 'y', 15, 0.15, delta);
} else {
    // En phase 1, on garde la rotation X à 0 (verticale)
    easing.damp(cardRef.current.rotation, 'x', 2, 0.15, delta);
}

// Optionnel : Une fois l'animation terminée (t === 1), déclencher d'autres actions.
if (t === 1) {
    // Par exemple, déclencher un focus caméra
    // state.camera.lookAt(
    //     cardRef.current.position.x,
    //     cardRef.current.position.y,
    //     cardRef.current.position.z
    // );
    state.camera.position.lerp(cardRef.current.position, 0.5);

    setTimeout((e) => {
        navigate('/error/page');
        console.log('e');
        return () => clearTimeout(e);
    }, 100);
}

//     // Animation "vol plume" quand la carte est cliquée
//     const speedFactor = 0.5;
//     animationProgressRef.current = Math.min(
//         animationProgressRef.current + delta * speedFactor,
//         1
//     );
//     const t = animationProgressRef.current;

//     const S = startPositionRef.current.clone();

//     // Position finale (centre)
//     const T = new Vector3(0, 0, 0);
//     // Hauteur d'ascension
//     const upwardOffset = 10;

//     const CP = new Vector3(
//         (S.x + T.x) / 2,
//         S.y + upwardOffset,
//         (S.z + T.z) / 2
//     );

//     const oneMinusT = 1 - t;
//     const P = new Vector3()
//         .add(S.clone().multiplyScalar(oneMinusT * oneMinusT))
//         .add(CP.clone().multiplyScalar(2 * oneMinusT * t))
//         .add(T.clone().multiplyScalar(t * t));

//     // Pour une transition fluide, on applique un damping
//     easing.damp3(cardRef.current.position, [P.x, P.y, P.z], 0.1, delta);

//     // Pour l'orientation : on souhaite que la carte active "s'incline" pour que son front regarde vers le ciel.
//     // Nous souhaitons, par exemple, que la rotation X devienne -π/2.
//     // On laisse la rotation Y inchangée ou on la fixe à une valeur prédéfinie si besoin.
//     easing.damp(
//         cardRef.current.rotation,
//         'x',
//         -Math.PI / 2,
//         0.15,
//         delta
//     );
//     // Selon l'effet désiré, on peut rendre la rotation Y fixe ou la laisser évoluer.
//     // Ici nous la fixons à 0, pour que le côté de la carte soit orienté vers "l'avant"
//     easing.damp(
//         groupRef.current.rotation,
//         'y',
//         -Math.PI / 2,
//         0.15,
//         delta
//     );
//     // easing.damp(groupRef.current.rotation, 'x', -Math.PI / 2, 0.15, delta);
//     // Optionnel : quand l'animation est terminée (t === 1), déclenchez des actions supplémentaires
//     // easing.damp(
//     //     groupRef.current.rotation,
//     //     'x',
//     //     -Math.PI / 2,
//     //     0.15,
//     //     delta
//     // );

//     if (t === 1) {
//         // Par exemple, vous pouvez déclencher un focus caméra ou réinitialiser la carte.
//     }
// }

// // if (card.isActive) {
// //     easing.damp3(
// //         position,
// //         Math.sin(card.position.x * 0.1 + 0.25) -
// //             Math.sqrt(5 ^ (2 - card.position.x) ^ 3),
// //         0.15,
// //         delta
// //     );
// // }
