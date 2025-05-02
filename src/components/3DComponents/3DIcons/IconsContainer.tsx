import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText.tsx';
import { Center, CenterProps, Float, Grid } from '@react-three/drei';
import { ForwardRefComponent } from '@react-three/drei/helpers/ts-utils';
import { useFrame } from '@react-three/fiber';
import {
    JSX,
    RefAttributes,
    RefObject,
    use,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Box3, Group, Object3DEventMap, Vector3 } from 'three';

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
}: {
    icons: Array<{ name: string; url: string }>;
    scalar: number;
} & JSX.IntrinsicElements['group']) {
    const [gridWidth, setGridWidth] = useState([]);

    const groupRef = useRef<Group>(null!);
    const gridRef = useRef<Group>(null);
    const frameCountRef = useRef(0);
    // const iconsRef = useRef([]);

    // const [visible, setVisible] = useState(false);

    // const rows = Math.ceil(Math.sqrt(icons.length));
    // const columns = Math.min(3, icons.length);

    // useFrame(({ clock }) => {
    //     if (!groupRef.current || !gridRef.current) return;
    //     frameCountRef.current += 1;
    //     if (frameCountRef.current % 70 === 0) {
    //         // groupRef.current.rotation.y =
    //         //     Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    //         icons.forEach((icon, index) => {
    //             // console.log(index, icon);
    //             const presentItem = groupRef.current?.getObjectByName(
    //                 icon.name
    //             );
    //             const presentMesh = presentItem.getObjectByName(
    //                 'icons-Container__icon'
    //             );
    //             const nextMesh = groupRef.current?.getObjectByName(
    //                 icons[index + 1]?.name
    //             );

    //             // const distance = presentMesh?.position.distanceTo(
    //             //     nextMesh?.position
    //             // );
    //             // const size = presentMesh?.getAttributes().size;
    //             // console.log(presentMesh.geometry.attributes.size);
    //             // console.log(presentMesh.geometry);
    //             // console.log(
    //             // groupRef.current.getObjectByName(icons[index + 1].name)
    //             // );
    //         });
    //     }
    // });

    // useEffect(() => {
    //     setVisible(true);
    // }, []);

    // useEffect(() => {
    //     if (!gridRef.current) return;
    //     const worldBox = new Box3().setFromObject(gridRef.current);
    //     const size = new Vector3();
    //     worldBox.getSize(size);
    //     console.log('Largeur mondiale:', size.x);

    //     icons.forEach((icon, index) => {
    //         if (ref.current) {
    //             // Créer une bounding box pour le groupe
    //             const box = new Box3().setFromObject(ref.current);
    //             const size = new Vector3();
    //             box.getSize(size);

    //             console.log(`GridLayout ${index} width:`, size.x);

    //             // Mettre à jour l'état si nécessaire
    //             if (index === 0) {
    //                 setGridWidth(size.x);
    //             }
    //         }
    //     });

    //     // setGridWidth(gridRef.current.geometry.parameters.width);
    // }, [icons.length]);

    /**
     * Saves the size of the item in the userData property of the item.
     * @description item.userData.size
     */
    // const itemRef = useCallback(
    //     (item: Group) => {
    //         if (!item) return;
    //         const box = new Box3().setFromObject(item);
    //         const size = new Vector3();
    //         box.getSize(size);
    //         item.userData.size = size;

    //         setGridWidth(size);
    //     },
    //     [icons.length]
    // );

    return (
        <Center bottom ref={groupRef as any} {...props}>
            {icons.map((icon, index) => (
                <GridLayout
                    // ref={itemRef}
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

    // <group ref={groupRef} {...props}>
    //     {icons.map((icon, index) => {
    //         const col = index % columns;
    //         const row = Math.floor(index / columns);

    //         // Calculer les positions hexagonales (décalage pour les lignes impaires)
    //         const offset = row % 2 === 0 ? 0 : 0.5;

    //         const spacingX = scalar * (2.5 + margin);
    //         const spacingY = scalar * (1.3 + margin);

    //         const x = (col + offset) * (spacingX * scalar);
    //         const y = row * (spacingY * scalar);

    //         const centerOffsetX = columns * spacingX * 0.4;
    //         const centerOffsetY = rows * spacingY * -0.01;

    //         return (
    //             <group
    //                 key={index}
    //                 position={[x - centerOffsetX, -y + centerOffsetY, 0]}
    //                 rotation={[0, 3.164, 0]}
    //             >
    //                 <IconWithText
    //                     key={index}
    //                     scalar={scalar * 0.8}
    //                     model={resolvePath(`@models/${icon.url}`)}
    //                     text={icon.name}
    //                     index={index}
    //                 />
    //             </group>
    //         );
    //     })}
    // </group>
}

export function GridLayout({
    children,
    width,
    index,
    length,
    scalar = 1,
    options = { columnsNumber: 3, rowOffset: 0.5, marginX: 2.5, marginY: 1.3 },
    ...props
}) {
    const [gridSize, setGridSize] = useState({ x: 0, y: 0, z: 0 });
    const columns = Math.min(
        options.columnsNumber,
        Math.ceil((width - options.windowMargin) / 2)
    );

    // const col = (width - options.windowMargin) / columns;
    const col = index % columns;
    const row = Math.floor(index / columns);

    console.log(columns, 'columns');
    console.log(width, 'width');
    console.log(col, 'col');
    // Offset for odd rows
    const offset = row % 2 === 0 ? 0 : options.rowOffset;

    const spacingX = scalar * options.marginX;
    // const spacingX = scalar * options.marginX + gridSize.x;
    const spacingY = scalar * options.marginY;

    // const colWidth = col + spacingX

    const x = (col + offset) * spacingX;
    const y = row * spacingY;

    const centerOffsetX = ((columns - 1) * spacingX) / 2;
    // const x = (col + offset) * (spacingX * scalar);
    // const y = row * (spacingY * scalar);

    // const centerOffsetX = ((columns - 1) * spacingX) / 2;
    // const centerOffsetY = ((rows - 1) * spacingY) / 2;

    // console.log(gridSize, 'ref size');
    // const centerOffsetX = columns + spacingX;
    // const centerOffsetY = rows + spacingY;
    // const centerOffsetX = columns * spacingX * 0.4;
    // const centerOffsetY = rows * spacingY * -0.01;
    const itemRef = useCallback((item: Group) => {
        if (!item) return;
        const box = new Box3().setFromObject(item);
        const size = new Vector3();
        box.getSize(size);
        item.userData.size = size;

        setGridSize({ ...size });
    }, []);

    return (
        <group
            ref={itemRef}
            // position={[x, -y, 0]}
            position={[x - centerOffsetX, -y, 0]}
            rotation={[0, 3.164, 0]}
            {...props}
        >
            {children}
        </group>
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
