import { ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import { Html } from '@react-three/drei';
import { ReactNode } from 'react';

type HtmlContainerTypes = {
    width: number;
    reducer: ReducerType;
    children: ReactNode;
};

/**
 * Contient un <group /> qui sera transformé en élément 3D par défaut -
 * Il faut lui passer un children contenant les éléments voulus -
 */
export function HtmlContainer({
    children,
    reducer,
    width,
    ...props
}: HtmlContainerTypes) {
    return (
        <Html
            // fullscreen
            // portal={document.body}
            // ref={htmlRef}
            position={reducer.isMobile ? [0, -1.5, 0] : [width, 0, 0.05]}
            transform
            distanceFactor={1}
            // rotation={[0, 3.2, 0]}
            // anchorX={100}
            // anchorY={100}
            {...props}
        >
            {children}
        </Html>
    );
}
// const relativePos = new Vector3().subVectors(camera.position, target);
// const spherical = new Spherical();
// spherical.setFromVector3(relativePos);
// // Définir les limites à ±30° en radians
// const minAzimuth = MathUtils.degToRad(-30);
// const maxAzimuth = MathUtils.degToRad(30);

// // On « clampe » l'azimut (theta) entre ces deux valeurs
// spherical.theta = MathUtils.clamp(spherical.theta, minAzimuth, maxAzimuth);

// // Reconvertir en coordonnées cartésiennes
// const newRelativePos = new Vector3().setFromSpherical(spherical);

// // La nouvelle position de la caméra est la cible plus la nouvelle position relative
// camera.position.copy(target).add(newRelativePos);

// // Si nécessaire, forcer le rafraîchissement des matrices
// camera.updateMatrixWorld();
