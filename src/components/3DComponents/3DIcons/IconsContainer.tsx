import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText';
import { HexCell } from '@/components/3DComponents/Forms/HexCell';
import { GridLayout } from '@/components/3DComponents/Grid/GridLayout';
import { frustumChecker } from '@/utils/frustrumChecker';
import { UseSpringProps } from '@react-spring/three';
import { Center, CenterProps } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { JSX, memo, ReactNode, useRef } from 'react';
import { Box3, Group } from 'three';

// Extend Object3D to include boundingbox property
declare module 'three' {
    interface Object3D {
        boundingbox?: Box3;
    }
}

type IconsContainerTypes = {
    width: number;
    icons: { name: string; optimized: string; mobile: string }[];
    scalar: number;
    /** @DefaultValue 5 */
    margin?: number;
    isMobile: boolean;
    /** @defaultValue 100 */
    iconScale: number;
    floatOptions?: {
        speed?: number;
        floatIntensity?: number;
        rotationIntensity?: number;
        floatRange?: [number, number];
    };
    gridOptions?: {
        columnsNumber: number;
        rowOffset: number;
        marginX: number;
        marginY: number;
        windowMargin: number;
    };
    eventsList?: {
        onClick?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerDown?: (event: ThreeEvent<MouseEvent>) => void;
        onPointerUp?: (event: ThreeEvent<MouseEvent>) => void;
        [key: string]:
            | ((event: ThreeEvent<MouseEvent | PointerEvent>) => void)
            | undefined;
    };
    mobileTextProps?: CenterProps;
    animations:
        | {
              propertiesToCheck?: string[];
              hovered?: boolean;
              [key: string]: any;
          } & UseSpringProps;
    children?: ReactNode;
    // hovered?: boolean;
} & JSX.IntrinsicElements['group'];

export interface IconsContainerContextTypes
    extends Omit<IconsContainerTypes, 'children' | 'icons'> {}

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
    animations = {} as IconsContainerTypes['animations'],
    ...props
}: IconsContainerTypes) {
    const groupRef = useRef<Group>(null!);
    const frameCountRef = useRef(0);

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
        <group name="icon__center-container" ref={groupRef} {...props}>
            {icons.map((icon, index) => (
                // <Suspense fallback={null}>
                <GridLayout
                    width={width}
                    key={icon.name + '-grid'}
                    name={icon.name + '-grid'}
                    length={icons.length}
                    index={index}
                    scalar={scalar}
                    options={gridOptions}
                >
                    <IconWithText
                        key={icon.name}
                        model={`${import.meta.env.BASE_URL}assets/models/${
                            isMobile
                                ? `mobile/${icon.mobile}`
                                : `optimized/${icon.optimized}`
                        }`}
                        datas={{
                            text: icon.name,
                            name: icon.name,
                        }}
                        name={'icon__content'}
                        animations={animations}
                        scalar={scalar}
                        iconScale={iconScale}
                        isMobile={isMobile}
                        eventsList={eventsList}
                        floatOptions={floatOptions}
                        mobileTextProps={mobileTextProps}
                        position={
                            // isMobile ? [0, 0, 0] : [0, 0.5 * scalar, 0]
                            [0, 0.5 * scalar, 0]
                            // isMobile
                            //     ? [0, 0.5 * scalar, -0.15]
                            //     : [0, 0.5 * scalar, 0]
                            // isMobile
                            //     ? [0.5 * scalar, 1.45 * scalar, -0.15]
                            //     : [0, 0.5 * scalar, 0]
                        }
                    />
                    {/* <Suspense fallback={<PlaceholderIcon />}> */}

                    {/* </Suspense> */}
                    {children}
                    <Center bottom>
                        <HexCell scalar={scalar} />
                    </Center>
                </GridLayout>
                // </Suspense>
            ))}
        </group>
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
