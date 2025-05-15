import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';
import { HexCell } from '@/components/3DComponents/Forms/HexCell';
import { GridLayout } from '@/components/3DComponents/Grid/GridLayout';
import { frustumChecker } from '@/utils/frustrumChecker';
import { Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { JSX, memo, Suspense, useRef } from 'react';
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
} & JSX.IntrinsicElements['group'];

const gridOptions = {
    columnsNumber: 3,
    rowOffset: 0.5,
    marginX: 2.5,
    marginY: 1.5,
    windowMargin: 1,
};

/**
 * IconsContainer component that displays a grid of icons with text.
 * @description It uses the GridLayout component to arrange icons in a grid format.
 *
 * @param width - Width of the container
 * @param icons - Array of icons to display
 * @param scalar - Scalar value for scaling the icons depending on the screen size
 * @param margin - Margin between icons (default = 0.5)
 * @param isMobile - Indicating if the device is mobile
 * @param props - Additional properties for the 3D group element
 * @returns JSX.Element
 */
const MemoizedIconsContainer = memo(function IconsContainer({
    width,
    icons,
    scalar,
    margin = 0.5,
    isMobile,
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
            { mobileTime: 20, desktopTime: 5, name: '-grid' },
            true
        );
    });

    return (
        <group ref={groupRef} {...props}>
            <Center name="icon__center-container" bottom>
                {icons.map((icon, index) => (
                    <GridLayout
                        width={width}
                        key={icon.name + '-grid'}
                        name={icon.name + '-grid'}
                        length={icons.length}
                        index={index}
                        scalar={scalar}
                        options={gridOptions}
                    >
                        <Suspense fallback={<PlaceholderIcon />}>
                            <IconWithText
                                key={icon.name}
                                scalar={0.8 * scalar}
                                model={`../assets/models/${
                                    isMobile
                                        ? `mobile/${icon.mobile}`
                                        : `optimized/${icon.optimized}`
                                }`}
                                // model={resolvePath(
                                //     `@models/${
                                //         isMobile
                                //             ? `mobile/${icon.mobile}`
                                //             : `optimized/${icon.optimized}`
                                //     }`
                                // )}
                                index={index}
                                isMobile={isMobile}
                                datas={{
                                    text: icon.name,
                                    name: icon.name,
                                }}
                                name={'icon__content'}
                                position={
                                    isMobile
                                        ? [0.5 * scalar, 1.45 * scalar, 0]
                                        : [-0.4 * scalar, 0.5 * scalar, 0]
                                }
                            />
                        </Suspense>
                        <Center bottom>
                            <HexCell scalar={scalar} />
                        </Center>
                    </GridLayout>
                ))}
            </Center>
        </group>
    );
});
export default MemoizedIconsContainer;

/**
 * Resolves the path of the alias to the actual path.
 *
 * @param aliasPath - The alias path to resolve
 */
function resolvePath(aliasPath: string) {
    const aliasMap: Record<string, string> = {
        '@models': '/src/assets/3DModels',
    };
    const [alias, ...rest] = aliasPath.split('/');
    if (alias in aliasMap) {
        return new URL(`${aliasMap[alias]}/${rest.join('/')}`, import.meta.url)
            .href;
    }
    throw new Error(`Alias "${alias}" non reconnu`);
}
