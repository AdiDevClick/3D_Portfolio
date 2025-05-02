import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText.tsx';
import { Center, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { JSX, useEffect, useRef, useState } from 'react';
import { Group } from 'three/examples/jsm/libs/tween.module.js';

export function IconsContainer({
    icons,
    scalar,
    margin = 0.5,
    ...props
}: {
    icons: Array<{ name: string; url: string }>;
    scalar: number;
} & JSX.IntrinsicElements['group']) {
    const groupRef = useRef<Group>(null);
    // const iconsRef = useRef([]);

    // const [visible, setVisible] = useState(false);

    const rows = Math.ceil(Math.sqrt(icons.length));
    const columns = Math.min(3, icons.length);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y =
                Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
        }
    });

    // useEffect(() => {
    //     setVisible(true);
    // }, []);

    return (
        <group ref={groupRef} {...props}>
            {icons.map((icon, index) => {
                const col = index % columns;
                const row = Math.floor(index / columns);

                // Calculer les positions hexagonales (décalage pour les lignes impaires)
                const offset = row % 2 === 0 ? 0 : 0.5;

                const spacingX = scalar * (2.5 + margin);
                const spacingY = scalar * (1.3 + margin);

                const x = (col + offset) * (spacingX * scalar);
                const y = row * (spacingY * scalar);

                const centerOffsetX = columns * spacingX * 0.4;
                const centerOffsetY = rows * spacingY * -0.01;

                // const col = index % 3;
                // const row = Math.floor(index / 3);

                // const angle = (index / icons.length) * Math.PI * 2;
                // const radius = 2 * scalar;

                return (
                    <group
                        key={index}
                        position={[x - centerOffsetX, -y + centerOffsetY, 0]}
                        rotation={[0, 3.164, 0]}
                        // ref={(el) => (iconsRef.current[index] = el)}
                        // position-y={-scalar * index * 0.8}
                        // position-x={index % 2 === 0 ? -0.5 : 0.5}
                        // // Animation de déploiement en cascade
                        // style={{
                        //     opacity: visible ? 1 : 0,
                        //     transform: visible
                        //         ? `translateX(0px)`
                        //         : `translateX(${index % 2 === 0 ? -50 : 50}px)`,
                        //     config: { mass: 1, tension: 280, friction: 60 },
                        //     delay: index * 200,
                        // }}
                    >
                        {/* <Float> */}
                        <IconWithText
                            key={index}
                            scalar={scalar * 0.8}
                            model={resolvePath(`@models/${icon.url}`)}
                            text={icon.name}
                            index={index}
                            // grid={{ col: col, row: row }}
                            // position={[
                            //     Math.sin(angle) * radius,
                            //     Math.cos(angle) * radius * 0.5, // Aplatir le cercle en ellipse
                            //     Math.cos(angle) * radius * 0.3, // Donner de la profondeur
                            // ]}
                            // rotation={[0, -angle + Math.PI / 2, 0]} // Orienter vers le centre
                        />
                        {/* </Float> */}
                    </group>
                );
            })}
        </group>
    );
}

function HexCell({ scalar }) {
    return (
        <mesh position={[0, 0, -0.1]}>
            <cylinderGeometry args={[scalar * 0.85, scalar * 0.85, 0.05, 6]} />
            <meshStandardMaterial color="#2a2a2a" />
        </mesh>
    );
}
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
