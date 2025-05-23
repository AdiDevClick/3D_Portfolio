import montserratFont from '@assets/fonts/Montserrat_Thin_Regular.json';
import interFont from '@assets/fonts/Inter_Regular.json';
import helveticFont from '@assets/fonts/helvetiker_regular.typeface.json';
import normalMontFont from '@assets/fonts/Montserrat-VariableFont_wght.ttf';

import { FontData } from '@react-three/drei';

/**
 * 3D Font for titles
 */
export const importedFont = helveticFont as unknown as FontData;

/**
 * Text Fallback font for titles
 */
export const importedNormalFont = normalMontFont;
