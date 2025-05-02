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
    margin?: number;
} & JSX.IntrinsicElements['group'];

const gridOptions = {
    columnsNumber: 3,
    rowOffset: 0.5,
    marginX: 2.5,
    marginY: 1.5,
    windowMargin: 1,
};
export function IconsContainer({
    width,
    ref,
    icons,
    scalar,
    margin = 0.5,
    ...props
}: IconsContainerTypes) {
    const groupRef = useRef<Group>(null!);

    return (
        <group ref={groupRef}>
            <Center bottom {...props}>
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
                            model={resolvePath(`@models/${icon.url}`)}
                            text={icon.name}
                            index={index}
                        />

                        <Center bottom position={[0, -0.6 * scalar, 0]}>
                            <HexCell scalar={scalar} />
                        </Center>
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
