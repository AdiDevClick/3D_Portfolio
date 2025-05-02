import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText.tsx';
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
    icons,
    scalar,
    margin = 0.5,
    ...props
}: IconsContainerTypes) {
    const groupRef = useRef<Group>(null!);

    return (
        <Center bottom ref={groupRef as any} {...props}>
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
    );
}

function HexCell({ scalar }) {
    return (
        <mesh>
            <cylinderGeometry
                args={[scalar * 0.6, scalar * 0.6, 0.05 * scalar, 6]}
            />
            <meshStandardMaterial
                color="#2a2a2a"
                roughness={0.7}
                metalness={0.3}
            />
        </mesh>
    );
}

// function HexCell({ scalar }) {
//     return (
//         <mesh position={[0, 0, -0.1]}>
//             <cylinderGeometry args={[scalar * 0.85, scalar * 0.85, 0.05, 6]} />
//             <meshStandardMaterial color="#2a2a2a" />
//         </mesh>
//     );
// }
// <IconWithText key={index} model={icon} text={icon} />
function resolvePath(aliasPath: string) {
    const aliasMap = {
        '@models': '/src/3DModels',
    };
    const [alias, ...rest] = aliasPath.split('/');
    if (aliasMap[alias]) {
        return new URL(`${aliasMap[alias]}/${rest.join('/')}`, import.meta.url)
            .href;
    }
    throw new Error(`Alias "${alias}" non reconnu`);
}
