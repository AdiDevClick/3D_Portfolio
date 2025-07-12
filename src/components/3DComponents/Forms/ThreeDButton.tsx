import { Button3DProps } from '@/components/3DComponents/Forms/formsTypes';
import { Html, Text, useCursor } from '@react-three/drei';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

/**
 * Button3D component
 *
 * @description This button's events are handled by the parent component
 * via the formEvents object
 *
 * @param position - The position of the button in 3D space.
 * @param disabled - Whether the button is disabled.
 * @param props - The rest of the props & events to be passed to the mesh.
 */
export function Button3D({
    position,
    disabled = false,
    ...props
}: Button3DProps) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<Mesh>(null);

    useCursor(hovered && !disabled);

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                {...props}
            >
                <boxGeometry args={[1.2, 0.3, 0.08]} />
                <meshStandardMaterial
                    color={
                        disabled ? '#6c757d' : hovered ? '#28a745' : '#5cb85c'
                    }
                    // transparent
                    opacity={disabled ? 0.5 : 0.9}
                    emissive={hovered && !disabled ? '#0a4015' : '#000'}
                />
            </mesh>
            <Text
                fontSize={0.08}
                color={disabled ? '#6c757d' : '#ffffff'}
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                position={[0, 0, 0.041]}
            >
                Envoyer
            </Text>
            {hovered && disabled && (
                <Html position={[0, 0.5, 0]}>
                    <div className="about__tooltip">
                        Veuillez remplir le formulaire pour activer le bouton
                    </div>
                </Html>
            )}
        </group>
    );
}
