import { Center, Text3D } from '@react-three/drei';
import montserrat from '@assets/fonts/Montserrat_Thin_Regular.json';
import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes.ts';

interface CardTitleTypes {
    reducer: ReducerType;
    card: ElementType;
}

/**
 * Texte 3D placé au dessus en mode desktop
 * et placé en dessous en mode mobile -
 */
export function CardMainTitle({ reducer, card }: CardTitleTypes) {
    return (
        <Center
            front
            position={reducer.isMobile ? [0, -1.5, 0.05] : [0, 1.1, 0.15]}
        >
            <Text3D
                castShadow
                bevelEnabled
                curveSegments={10}
                bevelSegments={5}
                bevelThickness={1}
                bevelSize={1}
                bevelOffset={0}
                scale={0.01}
                size={10}
                height={1}
                smooth={1}
                font={montserrat}
            >
                {card.cardTitle ? card.cardTitle : 'test'}
                <meshNormalMaterial />
            </Text3D>
        </Center>
    );
}
