import { IconsContainerProvider } from '@/api/contexts/IconsContainerProvider';
import { IconsContainerTypes } from '@/components/3DComponents/3DIcons/IconsTypes';
import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText';
import { HexCell } from '@/components/3DComponents/Forms/HexCell';
import { GridLayout } from '@/components/3DComponents/Grid/GridLayout';
import { frustumChecker } from '@/utils/frustrumChecker';
import { Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { memo, useRef } from 'react';
import { Box3, Group } from 'three';

// Extend Object3D to include boundingbox property
declare module 'three' {
    interface Object3D {
        boundingbox?: Box3;
    }
}

// const gridOptions = {
//     columnsNumber: 3,
//     rowOffset: 0.5,
//     marginX: 2.5,
//     marginY: 1.5,
//     windowMargin: 1,
// };

/**
 * IconsContainer component that displays a grid of icons with text.
 * @description It uses the GridLayout component to arrange icons in a grid format.
 *
 * @param width - Width of the container
 * @param icons - Array of icons to display
 * @param scalar - Scalar value for scaling the icons depending on the screen size
 * @param margin - Margin between icons (default = 0.5)
 * @param isMobile - Indicating if the device is mobile
 * @param iconScale - Scale of the icon (default = 100)
 * @param props - Additional properties for the 3D group element
 * @param floatOptions - Options for the floating effect
 * @param gridOptions - Options for the grid layout
 * @param children - Children elements to be rendered inside the grid
 * @param eventsList - List of events to attach to the icons
 * @param mobileTextProps - Props for the mobile text
 * @param animations - Animations for the icons
 * @returns JSX.Element
 */
const MemoizedIconsContainer = memo(function IconsContainer({
    children,
    width,
    icons,
    scalar,
    margin = 0.5,
    isMobile,
    eventsList,
    floatOptions,
    iconScale = 100,
    gridOptions,
    mobileTextProps,
    animations,
    // animations = {} as IconsContainerTypes['animations'],
    ...props
}: IconsContainerTypes) {
    const groupRef = useRef<Group>(null!);
    const frameCountRef = useRef(0);

    const iconsContainerContext = {
        width,
        scalar,
        margin,
        isMobile,
        iconScale,
        floatOptions: floatOptions ?? {
            speed: 1,
            floatIntensity: 1,
            rotationIntensity: 0.5,
            floatRange: [-0.1, 0.1],
        },
        eventsList: eventsList ?? {},
        textProps: {
            size: isMobile ? 40 * scalar : 28 * scalar,
        },
        mobileTextProps: mobileTextProps ?? {},
        animations,
    };

    /**
     * This function is called on each frame to update
     * the visibility of the icons based on the camera's frustum.
     *
     * @description It checks every 5 frames on desktop and 20 on mobiles.
     */
    useFrame((state) => {
        if (!groupRef.current) return;

        frameCountRef.current += 1;

        frustumChecker(
            groupRef.current,
            state,
            frameCountRef.current,
            isMobile,
            { mobileTime: 10, desktopTime: 5, name: '-grid' },
            true
        );
    });

    return (
        <IconsContainerProvider value={iconsContainerContext}>
            <group name="icon__center-container" ref={groupRef} {...props}>
                {icons.map(({ name, mobile, optimized, ...rest }, index) => (
                    <GridLayout
                        width={width}
                        key={name + '-grid'}
                        name={name + '-grid'}
                        length={icons.length}
                        index={index}
                        scalar={scalar}
                        options={gridOptions}
                    >
                        <IconWithText
                            key={name}
                            model={`${import.meta.env.BASE_URL}assets/models/${
                                isMobile
                                    ? `mobile/${mobile}`
                                    : `optimized/${optimized}`
                            }`}
                            datas={{
                                text: name,
                                name: name,
                                ...rest,
                            }}
                            position={[0, 0.5 * scalar, 0]}
                        />
                        {children}
                        <Center bottom>
                            <HexCell scalar={scalar} />
                        </Center>
                    </GridLayout>
                ))}
            </group>
        </IconsContainerProvider>
    );
});
export default MemoizedIconsContainer;

/**
 * Resolves the path of the alias to the actual path.
 *
 * @param aliasPath - The alias path to resolve
 */
// function resolvePath(aliasPath: string) {
//     const aliasMap: Record<string, string> = {
//         '@models': '/src/assets/3DModels',
//     };
//     const [alias, ...rest] = aliasPath.split('/');
//     if (alias in aliasMap) {
//         return new URL(`${aliasMap[alias]}/${rest.join('/')}`, import.meta.url)
//             .href;
//     }
//     throw new Error(`Alias "${alias}" non reconnu`);
// }
