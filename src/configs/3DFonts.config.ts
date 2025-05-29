// import montserratFont from '@assets/fonts/Montserrat_Thin_Regular.json';
// import interFont from '@assets/fonts/Inter_Regular.json';
import helveticFont from '@assets/fonts/helvetiker_regular.typeface.json';
import normalMontFont from '@assets/fonts/montserrat-variablefont_wght-webfont.woff';
// import normalMontFont from '@assets/fonts/Montserrat-VariableFont_wght.ttf';

import { FontData } from '@react-three/drei';
import { FontLoader } from 'three-stdlib';

/**
 * 3D Font for titles
 */
export const importedFont = new FontLoader().parse(
    helveticFont as unknown as FontData
);
/**
 * Text Fallback font for titles
 */
// export const importedNormalFont =
//     'src/assets/fonts/montserrat-variablefont_wght-webfont.woff';
// export const importedNormalFont = 'Montserrat';
export const importedNormalFont = normalMontFont;
// export const importedNormalFont = 'Montserrat, system-ui, sans-serif';
