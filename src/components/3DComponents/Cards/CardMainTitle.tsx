import { Center, Text3D } from '@react-three/drei';
import montserrat from '@assets/fonts/Montserrat_Thin_Regular.json';
import { ElementType, ReducerType } from '@/hooks/reducers/carouselTypes.ts';
import {
    DESKTOP_TITLE_POSITION,
    MOBILE_TITLE_POSITION,
} from '@/configs/3DCarousel.config.ts';

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
            position={
                reducer.isMobile
                    ? MOBILE_TITLE_POSITION
                    : DESKTOP_TITLE_POSITION
            }
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
                as={'H1'}
            >
                {card.cardTitle ? card.cardTitle : 'test'}
                <meshNormalMaterial />
            </Text3D>
        </Center>
    );
}
