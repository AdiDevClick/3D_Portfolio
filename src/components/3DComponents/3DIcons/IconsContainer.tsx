import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText.tsx';
import { HexCell } from '@/components/3DComponents/Forms/HexCell.tsx';
import { GridLayout } from '@/components/3DComponents/Grid/GridLayout.tsx';
import { Center } from '@react-three/drei';
import { JSX, useRef } from 'react';
import { Group } from 'three';

type IconsContainerTypes = {
    width: number;
    icons: { name: string; url: string }[];
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
export function IconsContainer({
    width,
    icons,
    scalar,
    margin = 0.5,
    isMobile,
    ...props
}: IconsContainerTypes) {
    const groupRef = useRef<Group>(null!);

    return (
        <group ref={groupRef} {...props}>
            <Center bottom>
                {icons.map((icon, index) => (
                    <GridLayout
                        width={width}
                        key={index}
                        name={icon.name}
                        length={icons.length}
                        index={index}
                        scalar={scalar}
                        options={gridOptions}
                    >
                        <IconWithText
                            scalar={0.8 * scalar}
                            model={resolvePath(
                                `@models/${
                                    isMobile
                                        ? `/mobile/${icon.url}`
                                        : `/optimized/${icon.url}`
                                }`
                            )}
                            text={icon.name}
                            index={index}
                            isMobile={isMobile}
                        />

                        <group position={[0, -0.6 * scalar, 0]}>
                            <Center bottom>
                                <HexCell scalar={scalar} />
                            </Center>
                        </group>
                    </GridLayout>
                ))}
            </Center>
        </group>
    );
}

/**
 * Resolves the path of the alias to the actual path.
 *
 * @param aliasPath - The alias path to resolve
 */
function resolvePath(aliasPath: string) {
    const aliasMap: Record<string, string> = {
        '@models': '/src/3DModels',
    };
    const [alias, ...rest] = aliasPath.split('/');
    if (alias in aliasMap) {
        return new URL(`${aliasMap[alias]}/${rest.join('/')}`, import.meta.url)
            .href;
    }
    throw new Error(`Alias "${alias}" non reconnu`);
}
